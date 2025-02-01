import { Controller, Post, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiBearerAuth()
  @Post(':userId/convert-cart')
  async convertCartToOrder(@Param('userId') userId: string) {
    const result = await this.orderService.convertCartToOrder(userId);
    return {
      order: result.order,
      checkoutUrl: result.checkoutUrl, 
    };
  }
}
