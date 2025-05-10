
import { useState, useEffect } from 'react';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { toast } from 'sonner';
import { useOrderActions } from '@/hooks/useOrderActions';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/orders';
import { ORDER_STATUS } from '@/constants/orderStatus';

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
      const { data: activeOrdersData, error: activeError } = await supabase
        .from('orders')
        .select('*')
        .eq('agent_id', userId)
        .neq('status', ORDER_STATUS.DELIVERED)
        .order('created_at', { ascending: false });

      if (activeError) throw activeError;
      
      // Convert to Order types
      const activeOrdersConverted: Order[] = activeOrdersData.map((order: any) => ({
        id: order.id,
        customer_name: order.customer_name,
        customer_contact: order.customer_contact,
        customer_id: order.customer_id,
        delivery_address: order.delivery_address,
        description: order.description,
        status: order.status,
        delivery_code: order.delivery_code,
        agent_id: order.agent_id,
        created: order.created_at,
        delivered_at: order.delivered_at,
        confirmed_at: order.updated_at,
        amount: order.amount,
        delivery_fee: order.delivery_fee,
        location: order.location
      }));
      
      setActiveOrders(activeOrdersConverted);
      
      // Updated: Fetch available orders (Pending and not assigned to any agent)
      const { data: availableOrdersData, error: availableError } = await supabase
        .from('orders')
        .select('*')
        .eq('status', ORDER_STATUS.PENDING)
        .is('agent_id', null)
        .order('created_at', { ascending: false });

      if (availableError) throw availableError;
      
      // Convert to Order types
      const availableOrdersConverted: Order[] = availableOrdersData.map((order: any) => ({
        id: order.id,
        customer_name: order.customer_name,
        customer_contact: order.customer_contact,
        customer_id: order.customer_id,
        delivery_address: order.delivery_address,
        description: order.description,
        status: order.status,
        delivery_code: order.delivery_code,
        agent_id: order.agent_id,
        created: order.created_at,
        delivered_at: order.delivered_at,
        confirmed_at: order.updated_at,
        amount: order.amount,
        delivery_fee: order.delivery_fee,
        location: order.location
      }));
      
      setAvailableOrders(availableOrdersConverted);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const { 
    processingOrderId,
    acceptOrder, 
    markAsOnTheWay, 
    markAsDelivered 
  } = useOrderActions(userId, fetchOrders);

  // Set up real-time subscription for orders
  useEffect(() => {
    if (!userId) return;
    
    fetchOrders();
    
    // Set up real-time subscription for orders
    const ordersSubscription = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(ordersSubscription);
    };
  }, [userId]);

  return {
    activeOrders,
    availableOrders,
    isLoading,
    processingOrderId,
    acceptOrder,
    markAsOnTheWay,
    markAsDelivered,
    refreshOrders: fetchOrders
  };
};
