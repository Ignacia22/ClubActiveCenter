import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateSubscriptionDTO {
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @Length(3, 60, { message: 'El minímo es de 3 caracteres y un maxímo de 60.' })
  name: string;

  @IsNotEmpty({ message: 'La descriptión no puede estar vacío.' })
  @IsString({ message: 'La descriptión debe ser una cadena de texto.' })
  @Length(30, 400, {
    message: 'El minímo es de 30 caracteres y un maxímo de 400.',
  })
  description: string;

  @IsNotEmpty({ message: 'El porcentaje no puede estar vacío.' })
  @Transform((value) => Number(value))
  @IsNumber({}, { message: 'Este valor debe ser un número.' })
  @Max(100, { message: 'El maxímo posible es del 100%' })
  percentage: number;

  @ArrayNotEmpty({ message: 'El arreglo de beneficios no puede estar vacío.' })
  @Transform((value: any) =>
    Array.isArray(value)
      ? value
      : value.split(',').map((item: string) => item.trim()),
  )
  @IsArray({
    message: 'Los beneficiós deben ser un arreglo de cadenas de texto.',
  })
  benefits: string[];

  @IsNotEmpty({ message: 'El precio no puede estar vacío.' })
  @Transform((value) => Number(value))
  @IsNumber({}, { message: 'Este valor debe ser un número.' })
  @Max(999999999, {
    message:
      'El maxímo posible es de 999999999, y hablado en serio quien hiría a comprar esto deberia ser más bajo el tope.',
  })
  price: number;

  @IsNotEmpty({ message: 'La duración no puede estar vacío.' })
  @Transform((value) => Number(value))
  @IsNumber({}, { message: 'Este valor debe ser un número.' })
  @Min(7, { message: 'El minimo es de 7 dias.' })
  @Max(365, { message: 'El maximo de tiempo es un año, 365 dias' })
  duration: number;
}
