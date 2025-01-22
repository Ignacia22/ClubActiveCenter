/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export enum UserStatus {
  active = 'Conect',
  disconect = 'Disconect',
  delete = 'Elimined',
  ban = 'Banned',
}

export class InfoPage {
  totalItems: number;
  maxPages: number;
  page: number;
  currentUsers: number;
}

export class UserDtoREsponseGet {
  @ApiProperty({
    description: 'El identificador único del usuario.',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'El nombre completo del usuario.',
    example: 'Juan Pérez',
  })
  name: string;

  @ApiProperty({
    description: 'El correo electrónico del usuario.',
    example: 'usuario@ejemplo.com',
  })
  email: string;

  @ApiProperty({
    description: 'El número de teléfono del usuario.',
    example: '+5215512345678',
  })
  phone: string;

  @ApiPropertyOptional({
    description: 'La dirección del usuario.',
    example: 'Calle Falsa 123',
  })
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'El número de documento del usuario (DNI).',
    example: 12345678,
  })
  dni: number;

  @ApiProperty({
    description: 'El estado actual del usuario.',
    enum: UserStatus,
    example: UserStatus.disconect,
  })
  userStatus: string;

  @ApiPropertyOptional({
    description: 'Indica si el usuario tiene permisos de administrador.',
    example: true,
  })
  @IsOptional()
  isAdmin?: boolean;

  @ApiPropertyOptional({
    description: 'La fecha de creación del usuario.',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsOptional()
  createUser?: Date;

  @ApiPropertyOptional({
    description: 'La fecha de la última actualización del usuario.',
    example: '2023-06-15T12:30:00.000Z',
  })
  @IsOptional()
  updateUser?: Date;
}

export class UserDTOPage {
    @ApiProperty({description: 'Indormación del empaginado.', type: InfoPage})
    infoPage: InfoPage;
    @ApiProperty({description: 'Colección de usuarios en la pagina.', type: [UserDtoREsponseGet]})
    users: UserDtoREsponseGet[];
}

export class UserDTOResponseId {
  @ApiProperty({
    description: 'El identificador único del usuario.',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'El nombre completo del usuario.',
    example: 'Juan Pérez',
  })
  name: string;

  @ApiProperty({
    description: 'El correo electrónico del usuario.',
    example: 'usuario@ejemplo.com',
  })
  email: string;

  @ApiProperty({
    description: 'El número de teléfono del usuario.',
    example: '+5215512345678',
  })
  phone: string;

  @ApiPropertyOptional({
    description: 'La dirección del usuario.',
    example: 'Calle Falsa 123',
  })
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'El número de documento del usuario (DNI).',
    example: 12345678,
  })
  dni: number;

  @ApiProperty({
    description: 'El estado actual del usuario.',
    enum: UserStatus,
    example: UserStatus.disconect,
  })
  userStatus: string;

}
