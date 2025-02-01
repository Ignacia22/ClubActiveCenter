// src/Order/OrderDTO/orders.dto.ts

import { IsArray, IsDecimal, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';


export enum StatusOrder {
  pending = 'Pending',
  complete = 'Complete',
  cancel = 'Canceled',
}

export class CreateOrderDto {
  
  @IsUUID()
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
