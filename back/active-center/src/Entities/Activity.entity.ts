/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { v4 as uuid } from 'uuid';
import { Max } from 'class-validator';
import { User } from './User.entity';
import { StatusActivity } from 'src/Activity/activitiesDTO/Activity.dto';

@Entity({ name: 'activities' })
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id = uuid();

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @Column({ type: 'varchar', length: 90, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  img: string;

  @Column({ type: 'integer', nullable: false, default: 20 })
  @Max(100, { message: 'El maximo de personas son 100.' })
  maxPeople: number;

  @Column({ type: 'integer', nullable: false, default: 0 })
  registeredPeople: number;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'varchar', length: 5, nullable: false })
  hour: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: StatusActivity, nullable: false })
  status?: StatusActivity;
}
