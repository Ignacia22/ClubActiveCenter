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
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  stock: number;

  @IsString()
  @IsNotEmpty()
  img: string;

  @IsString()
  @IsNotEmpty()
  category: string;

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