
import { useState } from 'react';
import { toast } from 'sonner';
import { Order, OrderStatus } from '@/types/orders';
import * as orderService from '@/services/orderService';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export interface OrderActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

export const useOrderActions = (userId: string | null, refreshOrders: () => void) => {
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const navigate = useNavigate();

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
      const orderCheck = await orderService.checkOrderAvailability(orderId);
      
      if (!orderCheck) {
        toast.error('Unable to verify order availability');
        return { success: false, error: 'Order verification failed' };
      }
      
      if (orderCheck.status !== 'pending' || orderCheck.agent_id !== null) {
        toast.error('This order has already been accepted by another agent');
        // Refresh orders to get the latest state
        refreshOrders();
        return { success: false, error: 'Order already accepted' };
      }
      
      // Proceed with updating the order
      const { data, error } = await orderService.acceptOrderInDb(orderId, userId);
      
      if (data) {
        toast.success('Order assigned successfully! You\'re now responsible for this delivery.');
        refreshOrders();
        // Navigate to OrderDetails page
        navigate(`/order-details?id=${orderId}`);
        return { success: true, data };
      }
      
      if (error) {
        throw new Error(error);
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
      const { data, error } = await orderService.markOrderAsInTransit(orderId, userId);
      
      if (data) {
        toast.success('Order status updated to in transit');
        refreshOrders();
        return { success: true, data };
      }
      
      if (error) {
        throw new Error(error);
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
      const { data, error } = await orderService.markOrderAsDelivered(orderId, userId, deliveryCode);
      
      if (data) {
        toast.success('Order marked as delivered');
        refreshOrders();
        return { success: true, data };
      }
      
      if (error) {
        throw new Error(error);
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
      const { data: messageData, error } = await supabase
        .from('messages')
        .insert({
          order_id: orderId,
          sender_id: userId,
          receiver_id: customerId,
          message_text: message,
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: messageData };
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
