// src/Order/OrderDTO/orders.dto.ts

import { IsArray, IsDecimal, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

// Declarar el enum antes de usarlo en el DTO
export enum StatusOrder {
  pending = 'Pending',
  complete = 'Complete',
  cancel = 'Canceled',
}

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;  // ID del usuario asociado con la orden

  @IsArray()
  @IsNotEmpty()
  products: { productId: string; quantity: number }[];  // Lista de productos con sus cantidades

  @IsDecimal()
  price: number;  // El precio total de la orden

  @IsEnum(StatusOrder)
  @IsNotEmpty()
  status: StatusOrder;  // El estado de la orden (pendiente, completada, etc.)

  @IsNotEmpty()
  date: Date;  // Fecha de la orden
}
