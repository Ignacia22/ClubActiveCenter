export enum StatusOrder {
  pending = "Pending",
  complete = "Complete",
  cancel = "Canceled",
}

export interface OrderItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string; // ID del usuario relacionado con la orden
  orderItems: OrderItem[];
  price: number;
  totalPrice: number;
  status: StatusOrder;
  date: string;
}
