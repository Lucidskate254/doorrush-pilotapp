
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MapPin, Truck, QrCode, Loader } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/orders';
import { QrScannerDialog } from '@/components/orders/QrScannerDialog';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useOrderActions } from '@/hooks/useOrderActions';
import { useAuthCheck } from '@/hooks/useAuthCheck';

const DeliveryProgress = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { userId } = useAuthCheck();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);
  
  const { markAsOnTheWay, markAsDelivered } = useOrderActions(userId, () => {
    fetchOrder();
  });

  const fetchOrder = async () => {
    if (!orderId || !userId) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('agent_id', userId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setOrder({
          id: data.id,
          customer_name: data.customer_name,
          customer_contact: data.customer_contact,
          customer_id: data.customer_id,
          delivery_address: data.delivery_address,
          description: data.description,
          status: data.status,
          delivery_code: data.delivery_code,
          agent_id: data.agent_id,
          created: data.created_at,
          delivered_at: data.delivered_at,
          confirmed_at: data.updated_at,
          amount: data.amount,
          delivery_fee: data.delivery_fee,
          location: data.location
        });
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    
    // Set up real-time subscription for this order
    const orderSubscription = supabase
      .channel(`order-${orderId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'orders',
          filter: `id=eq.${orderId}`
        }, 
        (payload) => {
          fetchOrder();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(orderSubscription);
    };
  }, [orderId, userId]);

  const handleStartDelivery = async () => {
    if (order) {
      await markAsOnTheWay(order.id);
    }
  };

  const handleScanQrCode = () => {
    setScannerOpen(true);
  };

  const handleScanComplete = (deliveryCode: string) => {
    if (order && deliveryCode) {
      markAsDelivered(order.id, deliveryCode);
    }
    setScannerOpen(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading order details...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold">Order not found</h2>
          <p className="text-muted-foreground mt-2">The order you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button 
            className="mt-4" 
            onClick={() => navigate('/orders')}
          >
            Back to Orders
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Delivery Progress</h1>
            <p className="text-muted-foreground">
              Track and manage your current delivery
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/orders')}
          >
            Back to Orders
          </Button>
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Order #{order.id.substring(0, 8)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-md">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p>{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact</p>
                  <p>{order.customer_contact}</p>
                </div>
              </div>
            </div>

            {/* Address & Delivery Details */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Delivery Details</h3>
              <div className="bg-muted/30 p-4 rounded-md space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivery Address</p>
                  <div className="flex items-start gap-2 mt-1">
                    <MapPin className="h-4 w-4 mt-1 text-primary" />
                    <p>{order.delivery_address}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p>{order.description}</p>
                </div>
                {order.amount && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Amount</p>
                    <p>KES {order.amount.toFixed(2)}</p>
                  </div>
                )}
                {order.delivery_fee && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Delivery Fee</p>
                    <p>KES {order.delivery_fee.toFixed(2)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${order.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 
                      order.status === 'on_transit' ? 'bg-purple-100 text-purple-800' : 
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'}`}
                  >
                    {order.status === 'assigned' ? 'Assigned' : 
                     order.status === 'on_transit' ? 'In Transit' : 
                     order.status === 'delivered' ? 'Delivered' : 
                     order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>
              </div>
            </div>

            {/* Here you could add a map component if needed */}
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            {order.status === 'assigned' && (
              <Button 
                variant="default" 
                onClick={handleStartDelivery}
                className="flex items-center gap-2"
              >
                <Truck className="h-4 w-4" />
                Start Delivery
              </Button>
            )}
            {order.status === 'on_transit' && (
              <Button 
                variant="default" 
                onClick={handleScanQrCode}
                className="flex items-center gap-2"
              >
                <QrCode className="h-4 w-4" />
                Scan Delivery QR Code
              </Button>
            )}
          </CardFooter>
        </Card>
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
