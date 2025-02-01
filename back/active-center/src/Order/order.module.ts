/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/Entities/Order.entity';
import { Product } from 'src/Entities/Product.entity';
import { User } from 'src/Entities/User.entity';
import { CartService } from 'src/Cart/cart.service';
import { CartModule } from 'src/Cart/cart.module';
import { PaymentModule } from 'src/Payment/payment.module';
import { OrderItem } from 'src/Entities/OrdenItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order,Product,User,OrderItem]),CartModule,forwardRef(() => PaymentModule)],
  controllers: [OrderController],
  providers: [OrderService],
  exports:[OrderService]
})
export class OrderModule {}
