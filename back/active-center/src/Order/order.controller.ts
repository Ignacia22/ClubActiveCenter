import { Controller, Post, Param, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Order } from 'src/Entities/Order.entity';
import { OrderService } from './order.service';
import { Role } from 'src/User/UserDTO/Role.enum';
import { RolesGuard } from 'src/Auth/Guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

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

  @ApiBearerAuth()
  @Get('allOrders')
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  async getAllOrder(): Promise<Order[]> {
    return await this.orderService.getAllOrder();
  }

  @ApiBearerAuth()
  @Get(':id')
  async getOrderById(@Param('id') orderId: string): Promise<Order> {
    return await this.orderService.getOrderById(orderId);
  }

}
