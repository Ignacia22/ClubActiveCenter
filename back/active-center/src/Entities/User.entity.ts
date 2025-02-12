/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reservation } from './Reservation.entity';
import { Order } from './Order.entity';
import { UserStatus } from 'src/User/UserDTO/users.dto';
import { v4 as uuid } from 'uuid';
import { Activity } from './Activity.entity';
import { Cart } from './Cart.entity';
import { Payment } from './Payment.entity';
import { SubscriptionDetail } from './SubscriptionDetails.entity';
import { Chat } from './Chat.entity';


@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  isSubscribed: boolean;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  email: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 16, unique: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'integer', unique: true, nullable: false })
  dni: number;

  @OneToMany(() => SubscriptionDetail, (subscription) => subscription.user)
  subscriptionsDetails: SubscriptionDetail[];

  @ManyToMany(() => Activity)
  @JoinTable()
  activities: Activity[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];

  @OneToMany(() => Order, (orders) => orders.user)
  orders: Order[];

  @Column({
    type: 'enum',
    default: UserStatus.disconect,
    nullable: true,
    enum: UserStatus,
  })
  userStatus: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  isAdmin?: boolean;

  @CreateDateColumn()
  createUser?: Date;

  @UpdateDateColumn()
  updateUser?: Date;

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @OneToOne(() => Chat, (chat) => chat.user)
  chat: Chat;
}
