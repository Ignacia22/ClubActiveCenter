import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional,IsString } from "class-validator";

export class CreateSpaceDto {

    @IsString()
    title: string;

    @IsArray()
    @ArrayNotEmpty()
    imgUrl: string[];

    @IsString()
    descripcion: string;
    
    @IsNumber()
    @IsNotEmpty()
    price_hours: number;


    @IsBoolean()
    @IsOptional()
    status:boolean;


}
