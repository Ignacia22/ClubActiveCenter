
import { IsString, IsNotEmpty, IsDecimal, IsUrl, IsEnum, IsNumber } from 'class-validator';
import { Product } from 'src/Entities/Product.entity';

export enum ProductCategory {
    FUTBOL = 'Fútbol',
    TENIS = 'Tenis',
    NATACION = 'Natación',
    CICLISMO = 'Ciclismo',
    FITNESS = 'Fitness',
    BALONCESTO = 'Baloncesto',
    HOCKEY = 'Hockey',
    GOLF = 'Golf',
    TENIS_DE_MESA = 'Tenis de mesa',
    DEPORTES_ACUATICOS = 'Deportes acuáticos',
  }

export enum ProductState{
    DISPONIBLE = "disponible",
    SINSTOCK = "sin stock",
    RETIRADO = "retirado"
}

export interface pagedProducts{
  total: number,
  page: number,
  limit: number,
  totalPages: number,
  data: Product[]
}

export class CreateProductDTO {
  
  @IsString()
  @IsNotEmpty()
  title: string;  

  @IsDecimal()
  @IsNotEmpty()
  price: number; 

  @IsString()
  @IsNotEmpty()
  description: string;  

  @IsString()
  category: string;   

  @IsNumber()
  stock: number;

  @IsUrl()
  @IsNotEmpty()
  img: string; 

}