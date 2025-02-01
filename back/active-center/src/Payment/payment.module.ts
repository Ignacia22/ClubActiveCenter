import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/Entities/Order.entity';
import { User } from 'src/Entities/User.entity';
import { Payment } from 'src/Entities/Payment.entity';
import { OrderModule } from 'src/Order/order.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Payment]),forwardRef(() => OrderModule)],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports:[PaymentService]
})
export class PaymentModule {}
