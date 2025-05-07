import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SubscriptionEntity } from './Subscription.entity';
import { User } from './User.entity';

@Entity({ name: 'subscriptionsDetails' })
export class SubscriptionDetail {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'date', default: new Date(), nullable: true })
  dayInit: Date;

  @Column({ type: 'date', nullable: false })
  dayEnd: Date;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'boolean', default: true, nullable: false })
  status?: boolean;

  @ManyToOne(
    () => SubscriptionEntity,
    (subscriptions: SubscriptionEntity) => subscriptions.subscriptionsDetails,
  )
  subscription?: SubscriptionEntity;

  @Column({ type: 'int', nullable: false })
  duration?: number;

  @ManyToOne(() => User, (user) => user.subscriptionsDetails)
  user?: User;
}
