import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User.entity';
import { Order } from './Order.entity';
import { Reservation } from './Reservation.entity';
import { v4 as uuid } from 'uuid';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id = uuid();

  @ManyToOne(() => User, (user) => user.payments, {
    eager: true,
    nullable: false,
  })
  user: User;
  
  @Column()
  userId: string;



  @ManyToOne(() => Order, (order) => order.payments, {
    eager: true,
    nullable: true,
  })
  order: Order;

  @ManyToOne(() => Reservation, (reservation) => reservation.payments, {
    eager: true,
    nullable: true,
  })
  reservation: Reservation;

  @Column({ type: 'varchar', nullable: true })
  reservationId: string | null;

  @Column({ type: 'decimal', scale: 2, precision: 8, nullable: false })
  amount: number;

  @Column({ type: 'varchar', nullable: false })
  currency: string;

  @Column({ nullable: false, unique: true })
  paymentIntentId: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;
}

