/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [],
})
export class OrderModule {}
