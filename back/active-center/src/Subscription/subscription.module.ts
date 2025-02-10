import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscriptions.service';
import { UserModule } from 'src/User/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'src/Entities/Subscription.entity';
import { SubscriptionDetail } from 'src/Entities/SubscriptionDetails.entity';
import { User } from 'src/Entities/User.entity';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  imports: [TypeOrmModule.forFeature([Subscription, SubscriptionDetail, User])]
})
export class SubscriptionModule {}
