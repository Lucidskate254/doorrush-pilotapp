
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { toast } from 'sonner';

export type Order = {
  id: string;
  customer_name: string;
  customer_contact: string;
  customer_id: string;
  delivery_address: string;
  description: string;
  status: string;
  delivery_code: string;
  agent_id?: string | null;
  created_at: string;
  delivered_at?: string | null;
  confirmed_at?: string | null;
  amount?: number | null;
  delivery_fee?: number | null;
  location?: string | null;
};

export const useAgentOrders = () => {
  const { agentData, userId } = useAuthCheck();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch both active and available orders
  const fetchOrders = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    
    try {
      // Fetch active orders (assigned to this agent and not delivered)
      const { data: agentOrders, error: agentError } = await supabase
        .from('orders')
        .select('*')
        .eq('agent_id', userId)
        .not('status', 'eq', 'delivered')
        .order('created_at', { ascending: false });
      
      if (agentError) throw agentError;
      
      setActiveOrders(agentOrders as unknown as Order[]);
      
      // Fetch available orders (pending and not assigned to any agent)
      const { data: pendingOrders, error: pendingError } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'pending')
        .is('agent_id', null)
        .order('created_at', { ascending: false });
      
      if (pendingError) throw pendingError;
      
      setAvailableOrders(pendingOrders as unknown as Order[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  // Accept an order
  const acceptOrder = async (orderId: string) => {
    if (!userId) {
      toast.error('You must be logged in to accept orders');
      return;
    }
    
    try {
      console.log('Accepting order:', orderId, 'by agent:', userId);
      
      // First check if the order is still available (pending and not assigned)
      const { data: orderCheck, error: checkError } = await supabase
        .from('orders')
        .select('status, agent_id')
        .eq('id', orderId)
        .single();
        
      if (checkError) {
        console.error('Error checking order status:', checkError);
        toast.error('Failed to accept order: Could not verify order status');
        return;
      }
      
      if (orderCheck.status !== 'pending' || orderCheck.agent_id !== null) {
        toast.error('This order has already been accepted');
        // Refresh orders to get the latest state
        fetchOrders();
        return;
      }
      
      // Proceed with updating the order
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
      
      if (error) {
        console.error('Error accepting order:', error);
        toast.error('Failed to accept order');
        return;
      }
      
      if (!data || data.length === 0) {
        toast.error('This order has already been accepted');
        fetchOrders();
        return;
      }
      
      toast.success('Order successfully accepted!');
      
      // Update local state - move the order from available to active
      const updatedOrder = availableOrders.find(order => order.id === orderId);
      if (updatedOrder) {
        updatedOrder.agent_id = userId;
        updatedOrder.status = 'assigned';
        updatedOrder.confirmed_at = now;
        setActiveOrders([updatedOrder, ...activeOrders]);
        setAvailableOrders(availableOrders.filter(order => order.id !== orderId));
      } else {
        // Refresh orders to get the latest state
        fetchOrders();
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      toast.error('Failed to accept order');
    }
  };

  // Mark order as on the way
  const markAsOnTheWay = async (orderId: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'on the way',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .eq('agent_id', userId); // Ensure it's assigned to this agent
      
      if (error) throw error;
      
      toast.success('Order marked as on the way');
      
      // Update local state
      setActiveOrders(
        activeOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'on the way' } 
            : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  // Mark order as delivered (with QR code verification)
  const markAsDelivered = async (orderId: string, scannedCode: string) => {
    if (!userId) return;
    
    try {
      // First, verify that the delivery code matches
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('delivery_code')
        .eq('id', orderId)
        .eq('agent_id', userId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching order details:', fetchError);
        toast.error('Failed to verify delivery code');
        return;
      }
      
      // Check if scanned code matches the delivery code
      if (!data || data.delivery_code !== scannedCode) {
        toast.error('Invalid QR code. Please scan the correct code.');
        return;
      }
      
      // Update the order status to delivered
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'delivered',
          delivered_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .eq('agent_id', userId);
      
      if (updateError) throw updateError;
      
      toast.success('Order successfully delivered!');
      
      // Update local state to remove the delivered order from active orders
      setActiveOrders(activeOrders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error marking order as delivered:', error);
      toast.error('Failed to complete delivery');
    }
  };

  // Set up real-time subscription for orders
  useEffect(() => {
    if (!userId) return;
    
    fetchOrders();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return {
    activeOrders,
    availableOrders,
    isLoading,
    acceptOrder,
    markAsOnTheWay,
    markAsDelivered
  };
};
