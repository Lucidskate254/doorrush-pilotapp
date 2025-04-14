
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, RefreshCw } from 'lucide-react';
import OrderItem from './OrderItem';
import { Order } from '@/types/orders';
import { Button } from '@/components/ui/button';

interface AvailableOrdersListProps {
  orders: Order[];
  processingOrderId: string | null;
  onAcceptOrder: (orderId: string) => void;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

const AvailableOrdersList: React.FC<AvailableOrdersListProps> = ({
  orders,
  processingOrderId,
  onAcceptOrder,
  isRefreshing = false,
  onRefresh,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Available Orders</h2>
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh} 
            disabled={isRefreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            <span>Refresh</span>
          </Button>
        )}
      </div>
      
      <AnimatePresence mode="wait">
        {orders.length > 0 ? (
          <motion.div 
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-md border"
          >
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
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-10 bg-muted/30 rounded-lg"
          >
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">No available orders</h3>
            <p className="text-muted-foreground mt-1">There are no available orders in your area</p>
            {onRefresh && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRefresh} 
                disabled={isRefreshing}
                className="mt-4 flex items-center gap-1"
              >
                <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                <span>Check for new orders</span>
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AvailableOrdersList;
