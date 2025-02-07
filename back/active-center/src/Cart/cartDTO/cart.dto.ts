import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export class CartItemDTO {
  @ApiProperty({
    description: 'Identificador único del usuario.',
    example: '12345abcde',
  })
  productId: string;

  @ApiProperty({
    description: 'Precio del producto.',
    example: 25.99,
  })
  productPrice: number;

  @ApiProperty({
    description: 'Cantidad del producto en el carrito.',
    example: 2,
  })
  quantity: number;
}

export class CartDTO {
  @ApiProperty({
    description: 'Identificador único del carrito.',
    example: 'cart12345',
  })
  id: string;

  @ApiProperty({
    description: 'Indica si el carrito está activo o no.',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Lista de productos en el carrito.',
    type: [CartItemDTO],
  })
  @IsArray()
  items: CartItemDTO[];

  @ApiProperty({
    description: 'Identificador único del usuario propietario del carrito.',
    example: 'user12345',
  })
  userId: string;

  @ApiProperty({
    description: 'Nombre del usuario propietario del carrito.',
    example: 'Juan Pérez',
  })
  userName: string;
}
export class UpdateItemDTO {
  @ApiProperty({
    description: 'Identificador único del usuario.',
    example: 'user12345',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Identificador único del producto.',
    example: '12345abcde',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'Cantidad del producto en el carrito.',
    example: 2,
  })
  @IsNumber()
  quantity: number;
}

export class AddProductsDTO {
  @ApiProperty({
    description: 'Identificador único del usuario.',
    example: 'user12345',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Lista de productos a agregar al carrito.',
    type: [CartItemDTO],
  })
  @IsArray()
  products: CartItemDTO[];
}

export class RemoveItemDTO {
  @ApiProperty({
    description: 'Identificador único del usuario.',
    example: 'user12345',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Identificador único del producto a eliminar.',
    example: '12345abcde',
  })
  @IsString()
  productId: string;
}


