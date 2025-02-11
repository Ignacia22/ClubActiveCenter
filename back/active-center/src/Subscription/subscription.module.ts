import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscriptions.service';
import { UserModule } from 'src/User/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'src/Entities/Subscription.entity';
import { SubscriptionDetail } from 'src/Entities/SubscriptionDetails.entity';
import { User } from 'src/Entities/User.entity';
import { PaymentModule } from 'src/Payment/payment.module';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  imports: [TypeOrmModule.forFeature([Subscription, SubscriptionDetail, User]),forwardRef(() => PaymentModule),],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
