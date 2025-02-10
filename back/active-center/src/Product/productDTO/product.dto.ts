import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  IsPositive,
  IsOptional,
  IsInt,
  IsNumberString,
} from 'class-validator';

export enum StatusProduct {
  Available = 'available',
  OutOfStock = 'out_of_stock',
  Retired = 'retired',
}

export class CreateProductDto {
  @ApiProperty({ description: 'Nombre del producto', example: 'Camiseta Gamer' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descripción del producto', example: 'Camiseta de algodón con diseño de Dark Souls' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Precio del producto', example: 29.99, type: Number })
  @Type(() => Number)
  @IsPositive()
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Stock disponible', example: 100, type: Number })
  @Type(() => Number)
  @IsPositive()
  @IsNumber()
  stock: number;

  @ApiProperty({ description: 'Categoría del producto', example: 'Ropa' })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiPropertyOptional({ description: 'Imagen del producto (URL o base64)', example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString({ message: 'img must be a string' })
  img?: string;

  @ApiPropertyOptional({ description: 'Estado del producto', enum: StatusProduct, example: StatusProduct.Available })
  @IsEnum(StatusProduct)
  productStatus?: StatusProduct = StatusProduct.Available;
}

export interface ProductFilters {
  name?: string;
  category?: string;
  stock?: number;
  minPrice?: number;
  maxPrice?: number;
}
