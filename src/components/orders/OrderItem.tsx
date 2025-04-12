
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, QrCode, Truck } from 'lucide-react';
import { Order } from '@/types/orders';

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
  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'assigned':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Assigned</Badge>;
      case 'in_transit':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">In Transit</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Delivered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
          {order.status.toLowerCase() === 'pending' && (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => onAcceptOrder(order.id)}
              disabled={processingOrderId === order.id}
            >
              {processingOrderId === order.id ? 'Accepting...' : 'Accept Order'}
            </Button>
          )}
        
          {order.status.toLowerCase() === 'assigned' && onStartDelivery && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStartDelivery(order.id)}
            >
              <Truck className="h-4 w-4 mr-1" />
              Start Delivery
            </Button>
          )}
          
          {order.status.toLowerCase() === 'in_transit' && onScanQrCode && (
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => onScanQrCode(order.id)}
            >
              <QrCode className="h-4 w-4 mr-1" />
              Scan
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default OrderItem;
