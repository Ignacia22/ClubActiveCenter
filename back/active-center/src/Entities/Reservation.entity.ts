/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User.entity';
import { v4 as uuid } from 'uuid';
import { Space } from './Space.entity';

@Entity({ name: 'reservations' })
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id = uuid();

  @Column({ type: 'date', nullable: false, default: new Date() })
  date: Date;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: false })
  price: number;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @ManyToOne(() => Space, (space) => space.reservation)
  spaces: Space[];

  @Column({ type: 'integer', nullable: false })
  hours: number;
}
