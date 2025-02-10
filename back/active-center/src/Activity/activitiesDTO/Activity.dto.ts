import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Validate, ValidateIf } from "class-validator";
import { Activity } from "src/Entities/Activity.entity";
import { InfoPageDTO } from "src/User/UserDTO/users.dto";
import { ConfirmationHour } from "src/utils/dateAndHourValidate.pipe";

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
    @Transform(({ value }) => Number(value))
    @IsNumber({}, { message: 'El número máximo de personas debe ser un número.' })
    @IsNotEmpty({ message: 'El número máximo de personas es obligatorio.' })
    maxPeople: number;
  
    @ApiProperty({
        description: 'Fecha en la que se realizará la actividad',
        example: '2025-02-10',
      })
      @IsNotEmpty({ message: 'La fecha es obligatoria.' })
      @Transform(({ value }) => {
        const parsedDate = new Date(value);
        if (isNaN(parsedDate.getTime())) {
          throw new BadRequestException('El formato de la fecha no es válido. yyyy-mm-dd');
        }
        return parsedDate;
      })
      date: Date;
    
    @ApiProperty({
        description: 'Hora en la cual se va a realizar la actividad.',
        example: '14:30',
    })
    @ValidateIf((obj) => obj.date)
    @IsNotEmpty({ message: 'La hora no puede ser inválida.' })
    @Transform(({ value }) => {
        if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)) {
          throw new BadRequestException('El formato de la hora debe ser HH:mm.');
        }
        return value;
    })
    @Validate(ConfirmationHour, ['date'], { always: true })
    hour: string;
  
    @ApiProperty({
      description: 'Descripción de la actividad',
      example: 'Clase de yoga para principiantes en el parque central.',
      required: false,
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser un texto válido.' })
    description: string;
}

export class ActivityResponseDTO {
  
  @ApiProperty({
    description: 'Identificador único de la actividad',
    example: '9d21f2f5-6d3e-4f25-85bb-df7c531d445a',
  })
  id: string;

  @ApiProperty({
    description: 'Título de la actividad',
    example: 'Torneo de Videojuegos',
  })
  title: string;

  @ApiProperty({description: 'Imagen de la actividad.'})
  img: string;

  @ApiProperty({
    description: 'Descripción detallada de la actividad (opcional)',
    example: 'Una competencia de videojuegos en varias categorías.',
    required: false,
  })
  description?: string | undefined;

  @ApiProperty({
    description: 'Fecha de la actividad',
    example: '2025-02-04T09:00:00Z',
  })
  date: Date;

  @ApiProperty({
    description: 'Hora de la actividad en formato de 24 horas',
    example: '14:00',
  })
  hour: string;

  @ApiProperty({
    description: 'Número máximo de personas que pueden participar',
    example: 100,
  })
  maxPeople: number;

  @ApiProperty({
    description: 'Número de personas actualmente registradas en la actividad',
    example: 50,
  })
  registeredPeople: number;

  @ApiProperty({
    description: 'Estado de la actividad (activa o inactiva)',
    required: false,
    example: true,
  })
  status?: boolean | undefined;
}