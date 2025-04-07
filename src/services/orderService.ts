
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
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('orders')
    .update({
      agent_id: userId,
      status: 'assigned',
      confirmed_at: now
    })
    .eq('id', orderId)
    .is('agent_id', null) // Ensure the agent_id is still null
    .eq('status', 'pending') // Ensure it's still pending
    .select();
  
  if (error) throw error;
  
  return { data, timestamp: now };
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

// Mark order as delivered
export const markOrderAsDelivered = async (orderId: string, userId: string) => {
  const { error } = await supabase
    .from('orders')
    .update({
      status: 'delivered',
      delivered_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)
    .eq('agent_id', userId);
  
  if (error) throw error;
};
