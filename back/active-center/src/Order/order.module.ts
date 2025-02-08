/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/Entities/Order.entity';
import { Product } from 'src/Entities/Product.entity';
import { User } from 'src/Entities/User.entity';
import { CartModule } from 'src/Cart/cart.module';
import { PaymentModule } from 'src/Payment/payment.module';
import { OrderItem } from 'src/Entities/OrdenItem.entity';
import { CartItem } from 'src/Entities/CartItem.entity';
import { Cart } from 'src/Entities/Cart.entity';
import { SendGridModule } from 'src/SendGrid/sendGrid.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product, User, OrderItem, CartItem, Cart]),
    CartModule,
    forwardRef(() => PaymentModule),
    SendGridModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
