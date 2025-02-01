import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

// DTO para cada producto en el carrito
export class CartItemDTO {
  @IsString()
  productId: string;

  @IsString()
  productName: string;

  @IsNumber()
  productPrice: number;

  @IsNumber()
  quantity: number;
}

// DTO para el carrito
export class CartDTO {
  @IsString()
  id: string;

  @IsBoolean()
  isActive: boolean;

  @IsArray()
  items: CartItemDTO[];

  @IsString()
  userId: string;

  @IsString()
  userName: string;
}
