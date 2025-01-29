<<<<<<< HEAD
/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.entity';
import { Product } from './Product.entity';
import { StatusOrder } from 'src/Order/OrderDTO/orders.dto';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
=======
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.entity";
import { Product } from "./Product.entity";
import { Payment } from "./Payment.entity";  // IMPORTA Payment
import { StatusOrder } from "src/Order/OrderDTO/orders.dto";
import { v4 as uuid } from "uuid";

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn("uuid")
>>>>>>> 9142c48 (Implemented Stripe, Moduls , RElations to Order, Entities)
  id = uuid();

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];

<<<<<<< HEAD
  @Column({ type: 'decimal', scale: 2, nullable: false })
  price: number;

  @Column({ type: 'date', default: new Date(), nullable: false })
  date: Date;

  @Column({ type: 'enum', enum: StatusOrder, default: StatusOrder.pending })
  status: string;
=======
  @Column({ type: "decimal", scale: 2, nullable: false })
  price: number;

  @Column({ type: "date", default: new Date(), nullable: false })
  date: Date;

  @Column({ type: "enum", enum: StatusOrder, default: StatusOrder.pending })
  status: StatusOrder;

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];
>>>>>>> 9142c48 (Implemented Stripe, Moduls , RElations to Order, Entities)
}
