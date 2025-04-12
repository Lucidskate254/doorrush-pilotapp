
import React from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package } from 'lucide-react';
import OrderItem from './OrderItem';
import { Order } from '@/types/orders';

interface AvailableOrdersListProps {
  orders: Order[];
  processingOrderId: string | null;
  onAcceptOrder: (orderId: string) => void;
}

const AvailableOrdersList: React.FC<AvailableOrdersListProps> = ({
  orders,
  processingOrderId,
  onAcceptOrder,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold mb-4">Available Orders</h2>
      {orders.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <OrderItem
                  key={order.id}
                  order={order}
                  processingOrderId={processingOrderId}
                  onAcceptOrder={onAcceptOrder}
                  showDescription={true}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10 bg-muted/30 rounded-lg">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium">No available orders</h3>
          <p className="text-muted-foreground mt-1">There are no available orders in your area</p>
        </div>
      )}
    </motion.div>
  );
};

export default AvailableOrdersList;
