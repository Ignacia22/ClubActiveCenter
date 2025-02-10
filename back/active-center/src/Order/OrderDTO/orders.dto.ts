// src/Order/OrderDTO/orders.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { OrderItem } from 'src/Entities/OrdenItem.entity';
import { User } from 'src/Entities/User.entity';

export enum StatusOrder {
  pending = 'Pending',
  complete = 'Complete',
  cancel = 'Canceled',
}

export class CreateOrderDto {
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsNotEmpty()
  products: { productId: string; quantity: number }[];

  @IsDecimal()
  price: number;

  @IsEnum(StatusOrder)
  @IsNotEmpty()
  status: StatusOrder;

  @IsNotEmpty()
  date: Date;
}

export class OrderDto {
  @ApiProperty({ description: 'ID de la orden' })
  id: string;

  @ApiProperty({
    description: 'Información del usuario asociado a la orden',
    type: User,
  })
  user: User;

  @ApiProperty({
    description: 'Lista de productos comprados en esta orden',
    type: [OrderItem],
  })
  orderItems: {
    productId: string;
    quantity: number;
    price: number;
  }[];

  @ApiProperty({ description: 'Precio de la orden sin descuentos' })
  price: number;

  @ApiProperty({ description: 'Precio total de la orden con descuentos' })
  totalPrice: number;

  @ApiProperty({ enum: StatusOrder, description: 'Estado de la orden' })
  status: StatusOrder;

  @ApiProperty({ description: 'Fecha en que se creó la orden' })
  date: Date;
}
