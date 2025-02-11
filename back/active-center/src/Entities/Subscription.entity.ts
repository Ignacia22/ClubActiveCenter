import { Max } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubscriptionDetail } from './SubscriptionDetails.entity';

@Entity({ name: 'subscriptions' })
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'integer', nullable: false })
  @Max(100, { message: 'El maxímo posible es del 100%' })
  percentage: number;

  @Column({ type: 'simple-array', nullable: false })
  benefits: string[];

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'integer', nullable: false })
  @Max(365, { message: 'El maximo de tiempo es un año, 365 dias' })
  duration: number;

  @OneToMany(
    () => SubscriptionDetail,
    (subscriptionsDetails) => subscriptionsDetails.subscription,
  )
  subscriptionsDetails?: SubscriptionDetail[];
}
