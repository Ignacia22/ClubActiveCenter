import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Max } from 'class-validator';

export class CategoryDTO {
  @ApiProperty({ description: 'Nombre de la actegoria.', example: 'Bate' })
  @IsNotEmpty({ message: 'El npmbre de la categoria no debe estar vacio.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @Max(60, { message: 'El numero maximo de caracteres es de 60.' })
  name: string;
}
