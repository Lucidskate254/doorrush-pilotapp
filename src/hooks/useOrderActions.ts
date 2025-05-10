
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ORDER_STATUS } from '@/constants/orderStatus';

export interface OrderActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

export const useOrderActions = (userId: string | null, refreshOrders: () => void) => {
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const navigate = useNavigate();

  // Check if order is still available
  const checkOrderAvailability = async (orderId: string) => {
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
  const acceptOrder = async (orderId: string): Promise<OrderActionResult> => {
    if (!userId) {
      toast.error('You must be logged in to accept orders');
      return { success: false, error: 'Authentication required' };
    }
    
    setProcessingOrderId(orderId);
    setIsProcessing(true);
    
    try {
      console.log('Accepting order:', orderId, 'by agent:', userId);
      
      // First check if the order is still available
      const orderCheck = await checkOrderAvailability(orderId);
      
      if (!orderCheck) {
        toast.error('Unable to verify order availability');
        return { success: false, error: 'Order verification failed' };
      }
      
      // UPDATED: Using constants for order status
      if (orderCheck.status !== ORDER_STATUS.PENDING || 
         (orderCheck.agent_id !== null && orderCheck.agent_id !== userId)) {
        toast.error('This order has already been accepted by another agent');
        // Refresh orders to get the latest state
        refreshOrders();
        return { success: false, error: 'Order already accepted' };
      }
      
      // If it's already assigned to the current agent, no need to reassign
      if (orderCheck.agent_id === userId) {
        toast.info('You have already accepted this order');
        navigate(`/delivery-progress/${orderId}`);
        return { success: true };
      }
      
      // Proceed with updating the order - Changed to directly set to in_transit
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('orders')
        .update({
          agent_id: userId,
          status: ORDER_STATUS.ON_TRANSIT, // Changed from 'assigned' to 'in_transit'
          updated_at: now
        })
        .eq('id', orderId)
        .select();
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data && data.length > 0) {
        toast.success('Order accepted successfully! You\'re now responsible for this delivery.');
        refreshOrders();
        
        // Navigate to the delivery progress page
        navigate(`/delivery-progress/${orderId}`);
        
        return { success: true, data: data[0] };
      }
      
      return { success: false, error: 'Failed to accept order' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred while accepting the order';
      toast.error(errorMessage);
      // Refresh orders to get the latest state
      refreshOrders();
      return { success: false, error: errorMessage };
    } finally {
      setProcessingOrderId(null);
      setIsProcessing(false);
    }
  };

  // Mark order as on the way
  const markAsOnTheWay = async (orderId: string): Promise<OrderActionResult> => {
    if (!userId) {
      toast.error('You must be logged in to update order status');
      return { success: false, error: 'Authentication required' };
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: 'on_transit',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select();
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data && data.length > 0) {
        toast.success('Order status updated to in transit');
        refreshOrders();
        return { success: true, data: data[0] };
      }
      
      return { success: false, error: 'Failed to update order status' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update order status';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  };

  // Mark order as delivered (with QR code verification)
  const markAsDelivered = async (orderId: string, deliveryCode: string): Promise<OrderActionResult> => {
    if (!userId) {
      toast.error('You must be logged in to mark order as delivered');
      return { success: false, error: 'Authentication required' };
    }

    setIsProcessing(true);

    try {
      // First check if the delivery code is correct
      const { data: orderCheck, error: checkError } = await supabase
        .from('orders')
        .select('delivery_code, status')
        .eq('id', orderId)
        .single();
      
      if (checkError) throw new Error(checkError.message);
      
      if (!orderCheck) {
        throw new Error('Order not found');
      }

      if (orderCheck.delivery_code !== deliveryCode) {
        throw new Error('Invalid delivery code');
      }

      if (orderCheck.status !== ORDER_STATUS.ON_TRANSIT) {
        throw new Error('Order must be in transit before marking as delivered');
      }
      
      // Proceed with updating the order
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
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data && data.length > 0) {
        toast.success('Order marked as delivered');
        refreshOrders();
        
        // Navigate to the confirmation page
        navigate('/delivery-success');
        
        return { success: true, data: data[0] };
      }
      
      return { success: false, error: 'Failed to mark order as delivered' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark order as delivered';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  };

  // Send message to customer
  const sendMessageToCustomer = async (orderId: string, customerId: string, message: string): Promise<OrderActionResult> => {
    if (!userId) {
      toast.error('You must be logged in to send messages');
      return { success: false, error: 'Authentication required' };
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          order_id: orderId,
          sender_id: userId,
          receiver_id: customerId,
          message_text: message,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) throw new Error(error.message);

      return { success: true, data: data ? data[0] : null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      console.error('Error sending message:', error);
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processingOrderId,
    isProcessing,
    acceptOrder,
    markAsOnTheWay,
    markAsDelivered,
    sendMessageToCustomer
  };
};
