import { Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { User } from "./User.entity";
import { Payment } from "./Payment.entity";
import { OrderItem } from "./OrdenItem.entity";

export enum StatusOrder {
  pending = 'Pending',
  complete = 'Complete',
  cancel = 'Canceled',
}

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { eager: true })
  orderItems: OrderItem[]; 


  @Column({ type: 'decimal', scale: 2, nullable: false })
  price: number;

 
  @Column({ type: "decimal", scale: 2 })
  totalPrice: number;


  @Column({ type: 'enum', enum: StatusOrder, default: StatusOrder.pending })
  status: StatusOrder;

  @Column({ type: "date", default: () => "CURRENT_TIMESTAMP" })
  date: Date;

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];
}
