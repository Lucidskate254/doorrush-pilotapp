
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Package, QrCode, Truck } from 'lucide-react';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAgentOrders } from '@/hooks/useAgentOrders';
import { QrScannerDialog } from '@/components/orders/QrScannerDialog';

const Orders = () => {
  const { 
    activeOrders, 
    availableOrders, 
    isLoading, 
    acceptOrder, 
    markAsOnTheWay, 
    markAsDelivered 
  } = useAgentOrders();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleScanQRCode = (orderId: string) => {
    setSelectedOrderId(orderId);
    setScannerOpen(true);
  };

  const handleScanComplete = (deliveryCode: string) => {
    if (selectedOrderId && deliveryCode) {
      markAsDelivered(selectedOrderId, deliveryCode);
    }
    setScannerOpen(false);
    setSelectedOrderId(null);
  };

  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'assigned':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Assigned</Badge>;
      case 'on the way':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">On The Way</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Delivered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Orders</h1>
          <p className="text-muted-foreground">
            View and manage your assigned delivery orders
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {activeOrders.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold mb-4">Active Orders</h2>
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
                      {activeOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.customer_name}</div>
                              <div className="text-sm text-muted-foreground">{order.customer_contact}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <span>{order.delivery_address}</span>
                            </div>
                          </TableCell>
                          <TableCell>{renderStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {order.status.toLowerCase() === 'assigned' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => markAsOnTheWay(order.id)}
                                >
                                  <Truck className="h-4 w-4 mr-1" />
                                  On Way
                                </Button>
                              )}
                              
                              {(order.status.toLowerCase() === 'assigned' || 
                               order.status.toLowerCase() === 'on the way') && (
                                <Button 
                                  variant="secondary" 
                                  size="sm"
                                  onClick={() => handleScanQRCode(order.id)}
                                >
                                  <QrCode className="h-4 w-4 mr-1" />
                                  Scan
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-10 bg-muted/30 rounded-lg">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No active orders</h3>
                <p className="text-muted-foreground mt-1">You don't have any active orders at the moment</p>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-4">Available Orders</h2>
              {availableOrders.length > 0 ? (
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
                      {availableOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.customer_name}</div>
                              <div className="text-sm text-muted-foreground">{order.customer_contact}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <span>{order.delivery_address}</span>
                            </div>
                          </TableCell>
                          <TableCell>{order.description}</TableCell>
                          <TableCell>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => acceptOrder(order.id)}
                            >
                              Accept
                            </Button>
                          </TableCell>
                        </TableRow>
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
          </>
        )}
      </div>

      <QrScannerDialog 
        open={scannerOpen} 
        onOpenChange={setScannerOpen}
        onScanComplete={handleScanComplete}
      />
    </DashboardLayout>
  );
};

export default Orders;
