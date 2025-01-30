<<<<<<< HEAD
export enum StatusProduct {
  Available = 'available',
  OutOfStock = 'out of stock',
  Retirado = 'retired',
=======
import { IsNotEmpty, IsNumber, IsString, IsUUID, IsEnum, IsPositive } from "class-validator";

export enum StatusProduct {   
    Available = "available",
    OutOfStock = "out_of_stock",
    Retirado = "retired",
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
>>>>>>> 19f8fe8 (implemeted products with of the juanma)
}
