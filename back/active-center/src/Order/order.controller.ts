// src/Order/order.controller.ts

import { Controller, Post, Param } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post(':userId/convert-cart')
  async convertCartToOrder(@Param('userId') userId: string) {
    const result = await this.orderService.convertCartToOrder(userId);
    return {
      order: result.order,
      checkoutUrl: result.checkoutUrl,  // URL para completar el pago en Stripe
    };
  }
}
