/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.entity';
import { Space } from './Space.entity';
import { Payment } from './Payment.entity';
import { v4 as uuid } from 'uuid';

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity({ name: 'reservations' })
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id = uuid();

  @Column({ type: 'date', nullable: false, default: new Date() })
  date: Date;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: false })
  price: number;

  @ManyToOne(() => User, (user) => user.reservations, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Space, (space) => space.reservation)
  spaces: Space;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @OneToMany(() => Payment, (payment) => payment.reservation)
  payments: Payment[];
  length: number;
  map: any;
}
