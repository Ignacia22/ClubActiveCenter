/* eslint-disable prettier/prettier */
import { UserStatus } from 'src/User/UsersDTO/User.dto';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reservation } from './Reservation.entity';
import { Order } from './Order.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

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

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];

  @OneToMany(() => Order, (orders) => orders.user)
  orders: Order;

  @Column({ type: 'enum', default: UserStatus.disconect, nullable: true, enum: UserStatus })
  userStatus: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  isAdmin?: boolean;

  @CreateDateColumn()
  createUser?: Date;

  @UpdateDateColumn()
  updateUser?: Date;
}
