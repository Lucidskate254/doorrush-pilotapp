
import { useState } from 'react';
import { toast } from 'sonner';
import { Order } from '@/types/orders';
import * as orderService from '@/services/orderService';

export const useOrderActions = (userId: string | null, refreshOrders: () => void) => {
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);

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
      
      if (!data || data.length === 0) {
        toast.error('This order has already been accepted');
        refreshOrders();
        return;
      }
      
      toast.success('Order successfully accepted!');
      refreshOrders();
      
    } catch (error) {
      console.error('Error accepting order:', error);
      toast.error('Failed to accept order');
    } finally {
      setProcessingOrderId(null);
    }
  };

  // Mark order as on the way
  const markAsOnTheWay = async (orderId: string) => {
    if (!userId) return;
    
    try {
      await orderService.markOrderAsOnTheWay(orderId, userId);
      toast.success('Order marked as on the way');
      refreshOrders();
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
      const data = await orderService.verifyDeliveryCode(orderId, userId);
      
      // Check if scanned code matches the delivery code
      if (!data || data.delivery_code !== scannedCode) {
        toast.error('Invalid QR code. Please scan the correct code.');
        return;
      }
      
      // Update the order status to delivered
      await orderService.markOrderAsDelivered(orderId, userId);
      
      toast.success('Order successfully delivered!');
      refreshOrders();
    } catch (error) {
      console.error('Error marking order as delivered:', error);
      toast.error('Failed to complete delivery');
    }
  };

  return {
    processingOrderId,
    acceptOrder,
    markAsOnTheWay,
    markAsDelivered
  };
};
