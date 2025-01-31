import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './Order.entity';
import { User } from './User.entity';
import { v4 as uuid } from 'uuid';
import { PaymentStatus } from 'src/Payment/PaymentDTO/payment.dto';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id = uuid();

  @ManyToOne(() => User, (user) => user.payments, {
    eager: true,
    nullable: false,
  })
  user: User;

  @ManyToOne(() => Order, (order) => order.payments, {
    eager: true,
    nullable: false,
  })
  order: Order;

  @Column({ type: 'decimal', scale: 2, precision: 8, nullable: false })
  amount: number;

  @Column({ type: 'varchar', nullable: false })
  currency: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;
}
