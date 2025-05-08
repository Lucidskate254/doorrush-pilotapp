
export type OrderStatus = 'available' | 'assigned' | 'on_transit' | 'delivered';

export type Order = {
  id: string;
  customer_name: string;
  customer_contact: string;
  customer_id: string;
  delivery_address: string;
  description: string;
  status: OrderStatus;
  delivery_code: string;
  agent_id?: string | null;
  created: string;
  delivered_at?: string | null;
  confirmed_at?: string | null;
  amount?: number | null;
  delivery_fee?: number | null;
  location?: string | null;
};
