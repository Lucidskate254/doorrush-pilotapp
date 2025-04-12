
import React from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package } from 'lucide-react';
import OrderItem from './OrderItem';
import { Order } from '@/types/orders';

interface ActiveOrdersListProps {
  orders: Order[];
  processingOrderId: string | null;
  onAcceptOrder: (orderId: string) => void;
  onStartDelivery: (orderId: string) => void;
  onScanQrCode: (orderId: string) => void;
}

const ActiveOrdersList: React.FC<ActiveOrdersListProps> = ({
  orders,
  processingOrderId,
  onAcceptOrder,
  onStartDelivery,
  onScanQrCode,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4">Active Orders</h2>
      {orders.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <OrderItem
                  key={order.id}
                  order={order}
                  processingOrderId={processingOrderId}
                  onAcceptOrder={onAcceptOrder}
                  onStartDelivery={onStartDelivery}
                  onScanQrCode={onScanQrCode}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10 bg-muted/30 rounded-lg">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium">No active orders</h3>
          <p className="text-muted-foreground mt-1">You don't have any active orders at the moment</p>
        </div>
      )}
    </motion.div>
  );
};

export default ActiveOrdersList;
