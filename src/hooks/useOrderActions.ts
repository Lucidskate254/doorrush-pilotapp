import { useState } from 'react';
import { toast } from 'sonner';
import { Order } from '@/types/orders';
import * as orderService from '@/services/orderService';
import { useNavigate } from 'react-router-dom';

export const useOrderActions = (userId: string | null, refreshOrders: () => void) => {
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Accept an order
  const acceptOrder = async (orderId: string) => {
    if (!userId) {
      toast.error('You must be logged in to accept orders');
      return;
    }
    
    setProcessingOrderId(orderId);
    
    try {
      console.log('Accepting order:', orderId, 'by agent:', userId);
      
      // First check if the order is still available
      const orderCheck = await orderService.checkOrderAvailability(orderId);
      
      if (!orderCheck) {
        setProcessingOrderId(null);
        return;
      }
      
      if (orderCheck.status !== 'pending' || orderCheck.agent_id !== null) {
        toast.error('This order has already been accepted');
        // Refresh orders to get the latest state
        refreshOrders();
        setProcessingOrderId(null);
        return;
      }
      
      // Proceed with updating the order
      const { data } = await orderService.acceptOrderInDb(orderId, userId);
      
      if (data) {
        toast.success('Order assigned successfully!');
        refreshOrders();
        // Navigate to OrderDetails page
        navigate(`/order-details?id=${orderId}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred while accepting the order');
      }
      // Refresh orders to get the latest state
      refreshOrders();
    } finally {
      setProcessingOrderId(null);
    }
  };

  // Mark order as on the way
  const markAsOnTheWay = async (orderId: string) => {
    if (!userId) {
      toast.error('You must be logged in to update order status');
      return;
    }

    try {
      const { data } = await orderService.markOrderAsInTransit(orderId, userId);
      if (data) {
        toast.success('Order status updated to in transit');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to update order status');
      }
    }
  };

  // Mark order as delivered (with QR code verification)
  const markAsDelivered = async (orderId: string, deliveryCode: string) => {
    if (!userId) {
      toast.error('You must be logged in to mark order as delivered');
      return;
    }

    try {
      const { data } = await orderService.markOrderAsDelivered(orderId, userId, deliveryCode);
      if (data) {
        toast.success('Order marked as delivered');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to mark order as delivered');
      }
    }
  };

  return {
    processingOrderId,
    acceptOrder,
    markAsOnTheWay,
    markAsDelivered
  };
};
