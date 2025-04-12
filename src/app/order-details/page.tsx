
'use client';

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/orders';
import { useOrderActions } from '@/hooks/useOrderActions';
import { useAuth } from '@/hooks/useAuth';
import QRScanner from '@/components/QRScanner';
import { Link } from 'react-router-dom';

export default function OrderDetails() {
  const [order, setOrder] = useState<Order | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const { user } = useAuth();
  const { markAsOnTheWay, markAsDelivered } = useOrderActions(user?.id || null, () => {});

  useEffect(() => {
    if (!orderId) {
      toast.error('No order ID provided');
      navigate('/dashboard');
      return;
    }

    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        toast.error('Failed to fetch order details');
        navigate('/dashboard');
        return;
      }

      setOrder(data);
    };

    fetchOrder();
  }, [orderId, navigate]);

  const handleStartDelivery = async () => {
    if (!orderId) return;
    try {
      await markAsOnTheWay(orderId);
      toast.success('Delivery started!');
    } catch (error) {
      toast.error('Failed to start delivery');
    }
  };

  const handleQRScan = async (scannedCode: string) => {
    if (!order || !orderId) return;

    if (scannedCode === order.delivery_code) {
      try {
        await markAsDelivered(orderId, scannedCode);
        toast.success('Delivery confirmed!');
        setIsScanning(false);
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to confirm delivery');
      }
    } else {
      toast.error('Invalid QR code');
    }
  };

  const handleChatWithCustomer = () => {
    if (!order) return;
    navigate(`/messages?id=${order.customer_id}`);
  };

  if (!order) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/dashboard" className="text-blue-500 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <Link to="/dashboard" className="text-blue-500 hover:underline">
          ← Back to Dashboard
        </Link>
        <div className="text-sm text-gray-500">
          Order Status: <span className="font-semibold">{order.status}</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
        <p className="mb-2"><strong>Name:</strong> {order.customer_name}</p>
        <p className="mb-2">
          <strong>Contact:</strong>{' '}
          <a href={`tel:${order.customer_contact}`} className="text-blue-500 hover:underline">
            {order.customer_contact}
          </a>
        </p>
        <p className="mb-2"><strong>Delivery Location:</strong> {order.delivery_address}</p>
      </div>

      <div className="flex flex-col gap-4">
        {order.status === 'assigned' && (
          <button
            onClick={handleStartDelivery}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Start Delivery
          </button>
        )}

        {order.status === 'in_transit' && (
          <button
            onClick={() => setIsScanning(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Scan QR Code to Confirm Delivery
          </button>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleChatWithCustomer}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 flex-1"
          >
            Chat with Customer
          </button>
          <a
            href={`tel:${order.customer_contact}`}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex-1 text-center"
          >
            Call Customer
          </a>
        </div>
      </div>

      {isScanning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <QRScanner onScan={handleQRScan} onClose={() => setIsScanning(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
