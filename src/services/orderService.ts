import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/orders';
import { toast } from 'sonner';

// Fetch active orders (assigned to this agent and not delivered)
export const fetchAgentActiveOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('agent_id', userId)
    .not('status', 'eq', 'delivered')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return data as Order[];
};

// Fetch available orders (pending and not assigned to any agent)
export const fetchAvailableOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('status', 'pending')
    .is('agent_id', null)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return data as Order[];
};

// Check if order is still available
export const checkOrderAvailability = async (orderId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('status, agent_id')
    .eq('id', orderId)
    .single();
    
  if (error) {
    console.error('Error checking order status:', error);
    toast.error('Failed to check order status');
    return null;
  }
  
  return data;
};

// Accept an order
export const acceptOrderInDb = async (orderId: string, userId: string) => {
  // First check if the order is available
  const { data: orderCheck, error: checkError } = await supabase
    .from('orders')
    .select('status, agent_id')
    .eq('id', orderId)
    .single();

  if (checkError) {
    throw new Error('Failed to check order status');
  }

  if (!orderCheck) {
    throw new Error('Order not found');
  }

  if (orderCheck.status !== 'pending' || orderCheck.agent_id !== null) {
    throw new Error('This order has already been accepted');
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('orders')
    .update({
      agent_id: userId,
      status: 'assigned',
      confirmed_at: now
    })
    .eq('id', orderId)
    .eq('status', 'pending')
    .eq('agent_id', null)
    .select();

  if (error) {
    throw new Error('Failed to accept order: ' + error.message);
  }

  if (!data || data.length === 0) {
    throw new Error('Order was already accepted by another agent');
  }

  return { data, error: null };
};

// Mark order as on the way
export const markOrderAsOnTheWay = async (orderId: string, userId: string) => {
  const { error } = await supabase
    .from('orders')
    .update({
      status: 'on the way',
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)
    .eq('agent_id', userId);
  
  if (error) throw error;
};

// Verify delivery code for an order
export const verifyDeliveryCode = async (orderId: string, userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('delivery_code')
    .eq('id', orderId)
    .eq('agent_id', userId)
    .single();
  
  if (error) throw error;
  
  return data;
};

// Mark order as in transit
export const markOrderAsInTransit = async (orderId: string, userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .update({
      status: 'in_transit',
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)
    .eq('agent_id', userId)
    .eq('status', 'assigned')
    .select();

  if (error) {
    throw new Error('Failed to update order status: ' + error.message);
  }

  if (!data || data.length === 0) {
    throw new Error('Order not found or not in correct status');
  }

  return { data, error: null };
};

// Mark order as delivered
export const markOrderAsDelivered = async (orderId: string, userId: string, deliveryCode: string) => {
  const { data: orderCheck, error: checkError } = await supabase
    .from('orders')
    .select('delivery_code')
    .eq('id', orderId)
    .eq('agent_id', userId)
    .single();

  if (checkError) {
    throw new Error('Failed to verify delivery code');
  }

  if (orderCheck.delivery_code !== deliveryCode) {
    throw new Error('Invalid delivery code');
  }

  const { data, error } = await supabase
    .from('orders')
    .update({
      status: 'delivered',
      delivered_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)
    .eq('agent_id', userId)
    .eq('status', 'in_transit')
    .select();

  if (error) {
    throw new Error('Failed to mark order as delivered: ' + error.message);
  }

  if (!data || data.length === 0) {
    throw new Error('Order not found or not in correct status');
  }

  return { data, error: null };
};
