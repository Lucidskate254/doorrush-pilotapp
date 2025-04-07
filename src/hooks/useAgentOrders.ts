
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { toast } from 'sonner';
import { Order } from '@/types/orders';
import * as orderService from '@/services/orderService';
import { useOrderActions } from '@/hooks/useOrderActions';

export { Order } from '@/types/orders';

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
      const agentOrders = await orderService.fetchAgentActiveOrders(userId);
      setActiveOrders(agentOrders);
      
      // Fetch available orders (pending and not assigned to any agent)
      const pendingOrders = await orderService.fetchAvailableOrders();
      setAvailableOrders(pendingOrders);
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
    processingOrderId,
    acceptOrder,
    markAsOnTheWay,
    markAsDelivered
  };
};
