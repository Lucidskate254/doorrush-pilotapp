
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { useOrderActions } from '@/hooks/useOrderActions';
import { Order, OrderStatus } from '@/types/orders';
import { QrScannerDialog } from '@/components/orders/QrScannerDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Phone, MapPin, Package, QrCode } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const DeliveryProgress = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { userId } = useAuthCheck();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const { markAsOnTheWay, markAsDelivered, isProcessing } = useOrderActions(userId, () => {});

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId || !userId) return;

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (error) throw error;
        
        if (data) {
          // Convert to Order type
          const orderData: Order = {
            id: data.id,
            customer_name: data.customer_name,
            customer_contact: data.customer_contact,
            customer_id: data.customer_id,
            delivery_address: data.delivery_address,
            description: data.description,
            status: data.status as OrderStatus, // Use the correct type
            delivery_code: data.delivery_code,
            agent_id: data.agent_id,
            created: data.created_at,
            delivered_at: data.delivered_at,
            confirmed_at: data.updated_at,
            amount: data.amount,
            delivery_fee: data.delivery_fee,
            location: data.location
          };
          
          setOrder(orderData);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, userId]);

  const handleStartDelivery = () => {
    if (!orderId) return;
    
    markAsOnTheWay(orderId)
      .then((result) => {
        if (result.success) {
          // Update the local state to reflect the change
          if (order) {
            setOrder({
              ...order,
              status: 'on_transit'
            });
          }
          toast.success('Delivery started successfully');
        }
      });
  };

  const handleScanComplete = (deliveryCode: string) => {
    if (!orderId || !deliveryCode) return;
    
    markAsDelivered(orderId, deliveryCode)
      .then((result) => {
        if (result.success) {
          // Will automatically navigate to success page
        }
      });
    
    setScannerOpen(false);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-48" />
          <Skeleton className="h-24" />
          <Skeleton className="h-12 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-2">Order not found</h2>
          <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/orders')}>Back to Orders</Button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Delivery Progress</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Customer Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{order.customer_name}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground">Contact:</span>
                    <span className="font-medium">{order.customer_contact}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <Button variant="outline" size="sm" onClick={() => {
                      // Copy customer contact to clipboard
                      navigator.clipboard.writeText(order.customer_contact);
                      toast.success('Phone number copied to clipboard');
                    }}>
                      Call Customer
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Delivery Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{order.delivery_address}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{order.description}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {order.status === 'assigned' ? 'Ready for delivery' : 'In transit'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col gap-4">
          {order.status === 'assigned' ? (
            <Button 
              className="w-full" 
              onClick={handleStartDelivery}
              disabled={isProcessing}
            >
              {isProcessing ? 'Starting...' : 'Start Delivery'}
            </Button>
          ) : (
            <Button 
              className="w-full" 
              onClick={() => setScannerOpen(true)}
              disabled={isProcessing}
            >
              <QrCode className="mr-2 h-4 w-4" />
              Scan QR Code to Complete Delivery
            </Button>
          )}
        </div>
      </div>
      
      <QrScannerDialog 
        open={scannerOpen} 
        onOpenChange={setScannerOpen}
        onScanComplete={handleScanComplete}
      />
    </DashboardLayout>
  );
};

export default DeliveryProgress;
