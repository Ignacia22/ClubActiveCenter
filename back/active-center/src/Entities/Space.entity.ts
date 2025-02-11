/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Activity } from './Activity.entity';
import { v4 as uuid } from 'uuid';
import { Reservation } from './Reservation.entity';

@Entity({ name: 'spaces' })
export class Space {
  @PrimaryGeneratedColumn('uuid')
  id = uuid();

  @Column({ type: 'varchar', length: 80, nullable: false })
  title: string;

  @Column({ type: 'simple-array', nullable: false })
  img: string[];

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'simple-array', nullable: false })
  details: string[];

  @Column({ type: 'simple-array', nullable: false })
  characteristics: string[];

  @Column({ type: 'decimal', nullable: false, scale: 2, precision: 8 })
  price_hour: number;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @OneToMany(() => Reservation, (reservation) => reservation.spaces)
  reservation: Reservation[];
}
