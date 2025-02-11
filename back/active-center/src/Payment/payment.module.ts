import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/Entities/Order.entity';
import { User } from 'src/Entities/User.entity';
import { Payment } from 'src/Entities/Payment.entity';
import { OrderModule } from 'src/Order/order.module';
import { Reservation } from 'src/Entities/Reservation.entity';
import { SubscriptionModule } from 'src/Subscription/subscription.module';
import { Subscription } from 'src/Entities/Subscription.entity';
import { SubscriptionDetail } from 'src/Entities/SubscriptionDetails.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User, Payment, Reservation,Subscription,SubscriptionDetail]),
    forwardRef(() => OrderModule),forwardRef(() => SubscriptionModule)
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
