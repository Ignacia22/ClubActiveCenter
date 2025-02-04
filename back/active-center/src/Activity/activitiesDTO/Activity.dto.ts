import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Activity } from "src/Entities/Activity.entity";
import { InfoPageDTO } from "src/User/UserDTO/users.dto";

export class ActivitiesPageDTO {
    @ApiProperty({description: 'Información extra del empaginado.', type: InfoPageDTO})
    infoPage: InfoPageDTO;

    @ApiProperty({description: 'Las actividades recibidas.'})
    activities: Activity[];
}

export class CreateActivityDTO {
    @ApiProperty({
      description: 'Título de la actividad',
      example: 'Clase de Yoga Matutina',
    })
    @IsString({ message: 'El título debe ser un texto válido.' })
    @IsNotEmpty({ message: 'El título es obligatorio.' })
    title: string;
  
    @ApiProperty({
      description: 'Número máximo de personas que pueden participar en la actividad',
      example: 20,
    })
    @IsNumber({}, { message: 'El número máximo de personas debe ser un número.' })
    @IsNotEmpty({ message: 'El número máximo de personas es obligatorio.' })
    maxPeople: number;
  
    @ApiProperty({
      description: 'Fecha y hora en la que se realizará la actividad',
      example: '2025-02-10T09:00:00.000Z',
    })
    @IsDate({ message: 'La fecha debe ser un valor de tipo Date.' })
    @IsNotEmpty({ message: 'La fecha es obligatoria.' })
    date: Date;
  
    @ApiProperty({
      description: 'Descripción de la actividad',
      example: 'Clase de yoga para principiantes en el parque central.',
      required: false,
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser un texto válido.' })
    description: string;
  }