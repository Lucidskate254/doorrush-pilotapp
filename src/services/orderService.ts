
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ORDER_STATUS } from '@/constants/orderStatus';

// Fetch active orders (assigned to this agent and not delivered)
export const fetchAgentActiveOrders = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('agent_id', userId)
      .neq('status', ORDER_STATUS.DELIVERED)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching active orders:', error);
    throw error;
  }
};

// Fetch available orders (pending and not assigned to any agent)
export const fetchAvailableOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('status', ORDER_STATUS.PENDING)
      .is('agent_id', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching available orders:', error);
    throw error;
  }
};

// Check if order is still available
export const checkOrderAvailability = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('status, agent_id')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error checking order status:', error);
    toast.error('Failed to check order status');
    return null;
  }
};

// Accept an order
export const acceptOrderInDb = async (orderId: string, userId: string) => {
  try {
    // First check if the order is available
    const { data: orderCheck, error: checkError } = await supabase
      .from('orders')
      .select('status, agent_id')
      .eq('id', orderId)
      .single();

    if (checkError) throw checkError;

    if (!orderCheck) {
      throw new Error('Order not found');
    }

    // Updated to use constants
    if (orderCheck.status !== ORDER_STATUS.PENDING || orderCheck.agent_id !== null) {
      throw new Error('This order has already been accepted by another agent');
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('orders')
      .update({
        agent_id: userId,
        status: ORDER_STATUS.ON_TRANSIT,  // Changed from 'assigned' to 'in_transit'
        updated_at: now
      })
      .eq('id', orderId)
      .select();

    if (error) throw error;

    return { data: data?.[0], error: null };
  } catch (error: any) {
    throw new Error('Failed to accept order: ' + error.message);
  }
};

// Mark order as on the way
export const markOrderAsOnTheWay = async (orderId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({
        status: ORDER_STATUS.ON_TRANSIT,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};

// Verify delivery code for an order
export const verifyDeliveryCode = async (orderId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('delivery_code')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return { delivery_code: data.delivery_code };
  } catch (error) {
    throw error;
  }
};

// Mark order as in transit
export const markOrderAsInTransit = async (orderId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: ORDER_STATUS.ON_TRANSIT,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select();

    if (error) throw error;

    return { data: data?.[0], error: null };
  } catch (error: any) {
    throw new Error('Failed to update order status: ' + error.message);
  }
};

// Mark order as delivered
export const markOrderAsDelivered = async (orderId: string, userId: string, deliveryCode: string) => {
  try {
    // Check delivery code
    const { data: orderCheck, error: checkError } = await supabase
      .from('orders')
      .select('delivery_code, status')
      .eq('id', orderId)
      .single();

    if (checkError) throw checkError;

    if (!orderCheck) {
      throw new Error('Order not found');
    }

    if (orderCheck.delivery_code !== deliveryCode) {
      throw new Error('Invalid delivery code');
    }

    if (orderCheck.status !== ORDER_STATUS.ON_TRANSIT) {
      throw new Error('Order must be in transit before marking as delivered');
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: ORDER_STATUS.DELIVERED,
        delivered_at: now,
        updated_at: now
      })
      .eq('id', orderId)
      .select();

    if (error) throw error;

    return { data: data?.[0], error: null };
  } catch (error: any) {
    throw new Error('Failed to mark order as delivered: ' + error.message);
  }
};
