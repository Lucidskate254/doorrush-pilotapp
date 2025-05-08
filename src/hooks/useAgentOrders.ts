
import { useState, useEffect } from 'react';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { toast } from 'sonner';
import * as orderService from '@/services/orderService';
import { useOrderActions } from '@/hooks/useOrderActions';
import { pb } from '@/integrations/pocketbase/client';
import { Order } from '@/integrations/pocketbase/client';

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
    // PocketBase uses a different realtime subscription approach
    pb.collection('orders').subscribe('*', function(e) {
      fetchOrders();
    });
    
    return () => {
      pb.collection('orders').unsubscribe();
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
