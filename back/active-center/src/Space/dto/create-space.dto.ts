import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSpaceDto {
  @IsString()
  title: string;

  @IsArray()
  @IsOptional()
  img: string[];

  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value
      : value?.split(',').map((item: string) => item.trim()),
  )
  details: string[];

  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value
      : value?.split(',').map((item: string) => item.trim()),
  )
  characteristics: string[];

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  price_hour: number;

  @IsBoolean()
  @IsOptional()
  status: boolean;
}
