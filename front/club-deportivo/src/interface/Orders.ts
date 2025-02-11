export interface OrderItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  price: number;
  totalPrice: number;
  status: string;
  date: string;
  orderItems: OrderItem[];
}

export interface UserOrdersProps {
  orders: Order[];
}
