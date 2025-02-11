import { Controller, Post, Param, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Order } from 'src/Entities/Order.entity';
import { OrderService } from './order.service';
import { Role } from 'src/User/UserDTO/Role.enum';
import { RolesGuard } from 'src/Auth/Guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { OrderDto } from './OrderDTO/orders.dto';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Convertir el carrito en una orden',
    description:
      'Convierte el carrito del usuario en una orden de compra. ' +
      'Si el carrito tiene productos válidos, se genera una orden y ' +
      'se proporciona una URL de pago.',
  })
  @ApiResponse({
    status: 201,
    description: 'Orden creada exitosamente',
    schema: {
      example: {
        order: {
          id: '12345',
          user: { id: '67890' },
          totalPrice: 500,
          status: 'pending',
          date: '2024-02-06T12:00:00.000Z',
        },
        checkoutUrl: 'https://payment.gateway/checkout/12345',
      },
    },
  })
  @Post(':userId/convert-cart')
  async convertCartToOrder(@Param('userId') userId: string) {
    const result = await this.orderService.convertCartToOrder(userId);
    return {
      order: result.order,
      checkoutUrl: result.checkoutUrl,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Lista de órdenes obtenida exitosamente.',
    content: {
      'application/json': {
        example: [
          {
            id: '1a2b3c',
            price: 50.0,
            totalprice: 55.0,
            status: 'Completado',
            date: '2024-01-01T12:00:00Z',
            user: {
              id: '123',
              username: 'usuario123',
              email: 'usuario@example.com',
            },
            orderItems: [
              {
                id: 'item1',
                quantity: 2,
                price: 25.0,
                product: {
                  id: 'prod1',
                  name: 'Producto A',
                },
              },
            ],
          },
          {
            id: '4d5e6f',
            price: 30.0,
            totalprice: 35.0,
            status: 'Pendiente',
            date: '2024-01-02T15:30:00Z',
            user: {
              id: '456',
              username: 'usuario456',
              email: 'user456@example.com',
            },
            orderItems: [
              {
                id: 'item2',
                quantity: 1,
                price: 30.0,
                product: {
                  id: 'prod2',
                  name: 'Producto B',
                },
              },
            ],
          },
        ],
      },
    },
  })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener todas las órdenes (solo administradores)',
    description:
      'Devuelve la lista de todas las órdenes generadas en la plataforma.',
  })
  @Get('allOrders')
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  async getAllOrder(): Promise<OrderDto[]> {
    return this.orderService.getAllOrder();
  }

  @ApiResponse({
    status: 200,
    description: 'Órdenes encontradas exitosamente.',
    content: {
      'application/json': {
        example: [
          {
            id: '7g8h9i',
            price: 40.0,
            totalprice: 45.0,
            status: 'En proceso',
            date: '2024-01-03T18:45:00Z',
            user: {
              id: '789',
              username: 'usuario789',
              email: 'usuario789@example.com',
            },
            orderItems: [
              {
                id: 'item3',
                quantity: 3,
                price: 15.0,
                product: {
                  id: 'prod3',
                  name: 'Producto C',
                },
              },
            ],
          },
        ],
      },
    },
  })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener una orden por ID',
    description:
      'Busca y devuelve los detalles de una orden específica por su ID. ' +
      'Incluye información sobre los productos comprados y el estado de la orden.',
  })
  @Get(':id')
  async getOrdersByUserId(@Param('id') orderId: string): Promise<OrderDto> {
    return this.orderService.getOrdersByUserId(orderId);
  }
}
