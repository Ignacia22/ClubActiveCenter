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
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @Type(() => Number)
  @IsPositive()
  @IsNumber()
  price: number;

  @Type(() => Number)
  @IsPositive()
  @IsNumber()
  stock: number;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsOptional()
  @IsString({ message: 'img must be a string' })
  img?: string;

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