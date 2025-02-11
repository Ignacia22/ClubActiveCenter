/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserStatus } from 'src/User/UserDTO/users.dto';

class UserInfoDTO {
  @ApiProperty({
    description: 'Identificador único del usuario.',
    example: '12345abcde',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del usuario.',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Dirección de correo electrónico del usuario.',
    example: 'johndoe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario.',
    example: '+1234567890',
  })
  phone: string;

  @ApiProperty({
    description: 'Dirección física del usuario.',
    example: '123 Main St, Springfield, IL',
    required: false,
  })
  address?: string;

  @ApiProperty({
    description: 'Indica si el usuario es Administrador.',
    example: false,
  })
  isAdmin?: boolean;

  @ApiProperty({
    description:
      'Estado actual del usuario dentro del sistema. Los valores posibles incluyen "active" (activo), "inactive" (inactivo), "banned" (prohibido), entre otros. Este estado determina el nivel de acceso del usuario.',
    example: 'active',
  })
  userStatus: string;
}

export class SingInDTOResponse {
  @ApiProperty({
    description:
      'Información completa del usuario autenticado, incluyendo detalles como su nombre, correo electrónico y estado actual.',
    type: UserInfoDTO,
  })
  userInfo: UserInfoDTO;

  @ApiProperty({
    description:
      'Token JWT generado durante la autenticación. Este token permite el acceso a las rutas protegidas del sistema.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;
}

export class TokenRefreshPayloadDTO {
  @ApiProperty({
    description: 'Identificador único del usuario.',
    example: '12345abcde',
  })
  sub: string;

  @ApiProperty({
    description: 'Dirección de correo electrónico del usuario.',
    example: 'johndoe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'ID del usuario.',
    example: '12345',
  })
  id: string;

  @ApiProperty({
    description: 'Indica si el usuario tiene privilegios de administrador.',
    example: true,
  })
  isAdmin: boolean | string[];

  @ApiProperty({
    description: 'Estado actual del usuario dentro del sistema.',
    example: 'active',
    enum: UserStatus,
  })
  userStatus: string;

  @ApiProperty({
    description:
      'Fecha y hora de expiración del token (UNIX timestamp en segundos)',
    example: Math.floor(Date.now() / 1000) + 60 * 60,
  })
  exp: number;

  @ApiProperty({
    description:
      'Fecha y hora en que se emitió el token (UNIX timestamp en segundos)',
    example: Math.floor(Date.now() / 1000),
  })
  iat: number;

  @ApiProperty({
    description: 'Roles para la validación de tokens.',
  })
  roles: string[];

  @ApiProperty({
    description: 'Si el usuario cuenta con alguna suscripción.'
  })
  isSubscribed: boolean;

  @ApiProperty({
    description: 'Suscripciones para validar.'
  })
  subscribe: string[];
}

export class RefreshTokenDTO {
  @IsString({ message: 'El token debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El token no puede estar vacio' })
  tokenAccess: string;
}

class UserInfo {
  @ApiProperty({ description: 'Id del usuario baneado o desbaneado.' })
  id: string;
}

export class BanDTOResponse {
  @ApiProperty({
    description: 'Infomación del usuario baneado o desbaneado.',
    type: UserInfo,
  })
  user: UserInfo;

  @ApiProperty({
    description:
      'Mensaje informativo de si el usuario fue baneado o desbaneado.',
  })
  message: string;
}

export class LoginDTO {
  @ApiProperty({
    description:
      'La dirección de correo electrónico única del usuario, utilizada para el inicio de sesión y notificaciones.',
    example: 'usuario@ejemplo.com',
  })
  @IsEmail(
    {},
    {
      message:
        'El correo electrónico debe tener un formato válido, como usuario@dominio.com.',
    },
  )
  @IsNotEmpty({
    message: 'El correo electrónico es obligatorio y no puede estar vacío.',
  })
  email: string;
}
