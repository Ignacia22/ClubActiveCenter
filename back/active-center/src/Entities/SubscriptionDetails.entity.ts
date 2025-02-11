import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Subscription } from './Subscription.entity';
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
    () => Subscription,
    (subscriptions) => subscriptions.subscriptionsDetails,
  )
  subscription?: Subscription;

  @ManyToOne(() => User, (user) => user.subscriptionsDetails)
  user?: User;
}
