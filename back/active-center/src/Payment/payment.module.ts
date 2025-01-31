import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/Entities/Order.entity';
import { User } from 'src/Entities/User.entity';
import { Payment } from 'src/Entities/Payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Payment])],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
