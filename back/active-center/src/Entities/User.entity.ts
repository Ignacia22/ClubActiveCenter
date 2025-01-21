/* eslint-disable prettier/prettier */
import { UserStatus } from 'src/User/UsersDTO/User.dto';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column({ type: 'varchar', length: 50 })
  country: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'varchar', length: 50 })
  city: string;

  @Column({type: 'number', length: 8, unique: true, nullable: false})
  dni: number;

  @Column({type: 'enum', default: UserStatus.disconect, nullable: true})
  userStatus: string

  @Column({ type: 'boolean', default: false, nullable: true })
  isAdmin?: boolean;

  @CreateDateColumn()
  createUser?: Date;

  @UpdateDateColumn()
  updateUser?: Date;
}
