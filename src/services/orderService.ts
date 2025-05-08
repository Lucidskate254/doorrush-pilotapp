
import { pb } from '@/integrations/pocketbase/client';
import { toast } from 'sonner';

// Fetch active orders (assigned to this agent and not delivered)
export const fetchAgentActiveOrders = async (userId: string) => {
  try {
    const records = await pb.collection('orders').getList(1, 50, {
      filter: `agent_id = "${userId}" && status != "delivered"`,
      sort: '-created'
    });
    return records.items;
  } catch (error) {
    console.error('Error fetching active orders:', error);
    throw error;
  }
};

// Fetch available orders (pending and not assigned to any agent)
export const fetchAvailableOrders = async () => {
  try {
    const records = await pb.collection('orders').getList(1, 50, {
      filter: 'status = "available" && agent_id = null',
      sort: '-created'
    });
    return records.items;
  } catch (error) {
    console.error('Error fetching available orders:', error);
    throw error;
  }
};

// Check if order is still available
export const checkOrderAvailability = async (orderId: string) => {
  try {
    const record = await pb.collection('orders').getOne(orderId);
    return {
      status: record.status,
      agent_id: record.agent_id
    };
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
    const orderCheck = await pb.collection('orders').getOne(orderId);

    if (!orderCheck) {
      throw new Error('Order not found');
    }

    if (orderCheck.status !== 'available' || orderCheck.agent_id !== null) {
      throw new Error('This order has already been accepted by another agent');
    }

    const now = new Date().toISOString();
    const data = await pb.collection('orders').update(orderId, {
      agent_id: userId,
      status: 'assigned',
      confirmed_at: now
    });

    return { data, error: null };
  } catch (error: any) {
    throw new Error('Failed to accept order: ' + error.message);
  }
};

// Mark order as on the way
export const markOrderAsOnTheWay = async (orderId: string, userId: string) => {
  try {
    await pb.collection('orders').update(orderId, {
      status: 'on_transit',
      updated: new Date().toISOString()
    });
  } catch (error) {
    throw error;
  }
};

// Verify delivery code for an order
export const verifyDeliveryCode = async (orderId: string, userId: string) => {
  try {
    const record = await pb.collection('orders').getOne(orderId);
    return { delivery_code: record.delivery_code };
  } catch (error) {
    throw error;
  }
};

// Mark order as in transit
export const markOrderAsInTransit = async (orderId: string, userId: string) => {
  try {
    const data = await pb.collection('orders').update(orderId, {
      status: 'on_transit',
      updated: new Date().toISOString()
    });

    return { data, error: null };
  } catch (error: any) {
    throw new Error('Failed to update order status: ' + error.message);
  }
};

// Mark order as delivered
export const markOrderAsDelivered = async (orderId: string, userId: string, deliveryCode: string) => {
  try {
    // Check delivery code
    const orderCheck = await pb.collection('orders').getOne(orderId);

    if (!orderCheck) {
      throw new Error('Order not found');
    }

    if (orderCheck.delivery_code !== deliveryCode) {
      throw new Error('Invalid delivery code');
    }

    if (orderCheck.status !== 'on_transit') {
      throw new Error('Order must be in transit before marking as delivered');
    }

    const data = await pb.collection('orders').update(orderId, {
      status: 'delivered',
      delivered_at: new Date().toISOString(),
      updated: new Date().toISOString()
    });

    return { data, error: null };
  } catch (error: any) {
    throw new Error('Failed to mark order as delivered: ' + error.message);
  }
};
