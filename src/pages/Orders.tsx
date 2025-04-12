
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAgentOrders } from '@/hooks/useAgentOrders';
import { QrScannerDialog } from '@/components/orders/QrScannerDialog';
import ActiveOrdersList from '@/components/orders/ActiveOrdersList';
import AvailableOrdersList from '@/components/orders/AvailableOrdersList';

const Orders = () => {
  const { 
    activeOrders, 
    availableOrders, 
    isLoading, 
    processingOrderId,
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Orders</h1>
          <p className="text-muted-foreground">
            View and manage your delivery orders
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Orders */}
            <ActiveOrdersList 
              orders={activeOrders} 
              processingOrderId={processingOrderId}
              onAcceptOrder={acceptOrder}
              onStartDelivery={markAsOnTheWay}
              onScanQrCode={handleScanQRCode}
            />

            {/* Available Orders */}
            <AvailableOrdersList 
              orders={availableOrders} 
              processingOrderId={processingOrderId}
              onAcceptOrder={acceptOrder}
            />
          </div>
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
