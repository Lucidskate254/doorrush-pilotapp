
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, QrCode, Truck, Eye } from 'lucide-react';
import { Order } from '@/types/orders';
import { useNavigate } from 'react-router-dom';
import { ORDER_STATUS } from '@/constants/orderStatus';

interface OrderItemProps {
  order: Order;
  processingOrderId: string | null;
  onAcceptOrder: (orderId: string) => void;
  onStartDelivery?: (orderId: string) => void;
  onScanQrCode?: (orderId: string) => void;
  showDescription?: boolean;
}

const OrderItem: React.FC<OrderItemProps> = ({
  order,
  processingOrderId,
  onAcceptOrder,
  onStartDelivery,
  onScanQrCode,
  showDescription = false,
}) => {
  const navigate = useNavigate();

  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case ORDER_STATUS.PENDING.toLowerCase():
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case ORDER_STATUS.ON_TRANSIT.toLowerCase():
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">In Transit</Badge>;
      case ORDER_STATUS.DELIVERED.toLowerCase():
        return <Badge variant="outline" className="bg-green-100 text-green-800">Delivered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewOrder = (orderId: string) => {
    navigate(`/delivery-progress/${orderId}`);
  };

  return (
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
      
      {!showDescription && (
        <TableCell>{renderStatusBadge(order.status)}</TableCell>
      )}
      
      {showDescription && (
        <TableCell>{order.description}</TableCell>
      )}
      
      <TableCell>
        <div className="flex items-center gap-2">
          {order.status === ORDER_STATUS.PENDING && (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => onAcceptOrder(order.id)}
              disabled={processingOrderId === order.id}
            >
              {processingOrderId === order.id ? 'Accepting...' : 'Accept Order'}
            </Button>
          )}
        
          {order.status === ORDER_STATUS.ON_TRANSIT && (
            <>
              {onStartDelivery && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onStartDelivery(order.id)}
                >
                  <Truck className="h-4 w-4 mr-1" />
                  Start Delivery
                </Button>
              )}
              
              {onScanQrCode && (
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => onScanQrCode(order.id)}
                >
                  <QrCode className="h-4 w-4 mr-1" />
                  Scan
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewOrder(order.id)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default OrderItem;
