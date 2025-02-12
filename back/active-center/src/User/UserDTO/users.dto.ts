/* eslint-disable prettier/prettier */
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  IsUUID,
  Length,
  Validate,
} from 'class-validator';
import { Activity } from 'src/Entities/Activity.entity';
import { Order } from 'src/Entities/Order.entity';
import { Payment } from 'src/Entities/Payment.entity';
import { Reservation, ReservationStatus } from 'src/Entities/Reservation.entity';
import { Space } from 'src/Entities/Space.entity';
import { SubscriptionDetail } from 'src/Entities/SubscriptionDetails.entity';
import { Confirmation } from 'src/utils/passwordConfimation.pipe';

export enum UserStatus {
  active = 'Conect',
  disconect = 'Disconnected',
  delete = 'Elimined',
  ban = 'Banned',
}

export class ReservationDTO {
  id: string;
  date: Date;
  price: number;
  spaces: Space;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  payments: Payment[];
  length: number;
  map: any;
}

export class InfoPageDTO {
  @ApiProperty({
    description: 'Total de ítems disponibles.',
  })
  totalItems: number;

  @ApiProperty({
    description: 'Número máximo de páginas disponibles.',
  })
  maxPages: number;

  @ApiProperty({
    description: 'Número de la página actual.',
  })
  page: number;

  @ApiProperty({
    description: 'Número actual de usuarios en la página.',
  })
  currentUsers: number;
}

export class UserDTOREsponseGet {
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
    description: 'Indica si un usuario esta o no suscrito.',
    example: false,
    default: false,
  })
  isSubscribed: boolean;

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
  @ApiProperty({
    description: 'Información del empaginado.',
    type: InfoPageDTO,
  })
  infoPage: InfoPageDTO;

  @ApiProperty({
    description: 'Colección de usuarios en la página.',
    type: [UserDTOREsponseGet],
  })
  users: UserDTOREsponseGet[];
}

export class RegisterUserDTO {
  @ApiProperty({
    description:
      'El nombre completo del usuario, que será utilizado como identificación principal.',
    example: 'Juan Pérez',
  })
  @IsString({
    message:
      'El nombre debe ser un texto válido, sin incluir números ni caracteres especiales.',
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio y no puede estar vacío.' })
  @Length(2, 50, {
    message: 'El nombre debe tener entre 2 y 50 caracteres para ser válido.',
  })
  name: string;

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

  @ApiHideProperty()
  @IsEmpty({ message: 'Esta propiedad no puede se mandada.' })
  isSubscribed: boolean;

  @ApiProperty({
    description:
      'La contraseña del usuario para acceder al sistema, que debe cumplir con criterios de seguridad.',
    example: 'ContraseñaSegura123!',
  })
  @IsString({ message: 'La contraseña debe ser un texto válido.' })
  @IsNotEmpty({
    message: 'La contraseña es obligatoria y no puede estar vacía.',
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minUppercase: 1,
      minLowercase: 1,
      minSymbols: 1,
    },
    {
      message:
        'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un símbolo especial.',
    },
  )
  password: string;

  @IsNotEmpty({
    message: 'El campo confirmación de contraseña no debe estar vacío.',
  })
  @ApiProperty({
    description: 'Debe contener la misma contraseña que el input contraseña',
    example: 'ContraseñaSegura123!',
  })
  @Validate(Confirmation, ['password'], { always: true })
  passwordConfirmation: string;

  @ApiProperty({
    description:
      'El número de teléfono del usuario, incluyendo el código del país.',
    example: '+5491178900995',
  })
  @IsPhoneNumber(undefined, {
    message:
      'El número de teléfono debe ser válido según el estándar internacional e incluir el código de país (ejemplo: +52 para México).',
  })
  @IsNotEmpty({
    message: 'El número de teléfono es obligatorio y no puede estar vacío.',
  })
  phone: string;

  @ApiPropertyOptional({
    description:
      'La dirección física del usuario, que puede ser utilizada para el envío de correspondencia.',
    example: 'Calle Falsa 123, Ciudad Ficticia',
  })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser un texto válido.' })
  address?: string;

  @ApiProperty({
    description:
      'El Documento Nacional de Identidad (DNI) del usuario, utilizado como identificación oficial.',
    example: 12345778,
  })
  @IsNumber({}, { message: 'El DNI debe ser un número entero válido.' })
  @IsNotEmpty({ message: 'El DNI es obligatorio y no puede estar vacío.' })
  dni: number;

  @ApiHideProperty()
  @IsEmpty({
    message:
      'No se permite incluir el estado del usuario en la solicitud. Este valor se asigna automáticamente.',
  })
  userStatus?: string;

  @ApiHideProperty()
  @IsEmpty({
    message:
      'No se permite incluir el indicador de administrador en la solicitud. Este valor se asigna automáticamente.',
  })
  isAdmin?: boolean;

  @ApiHideProperty()
  @IsEmpty({
    message:
      'No se permite incluir la fecha de creación del usuario en la solicitud. Este valor se asigna automáticamente.',
  })
  createUser?: Date;

  @ApiHideProperty()
  @IsEmpty({
    message:
      'No se permite incluir la fecha de actualización del usuario en la solicitud. Este valor se asigna automáticamente.',
  })
  updateUser?: Date;
}

export class SignInUserDTO {
  @ApiProperty({
    description: 'Correo electrónico del usuario para iniciar sesión.',
    example: 'usuario@ejemplo.com',
  })
  @IsNotEmpty({ message: 'El email no puede estar vacío.' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario para iniciar sesión.',
    example: 'ContraseñaSegura123!',
  })
  @IsNotEmpty({ message: 'La contraseña no debe estar vacía.' })
  password: string;
}

export class UpdateUserDTO {
  @ApiHideProperty()
  @IsEmpty({
    message: 'No se puede modificar el identificador único del usuario.',
  })
  id: string;

  @ApiPropertyOptional({
    description: 'El nombre del usuario, se puede modificar.',
    example: 'Pena Almendra',
  })
  @IsOptional()
  @IsString({
    message:
      'El nombre debe ser un texto válido, sin incluir números ni caracteres especiales.',
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio y no puede estar vacío.' })
  @Length(2, 50, {
    message: 'El nombre debe tener entre 2 y 50 caracteres para ser válido.',
  })
  name: string;

  @ApiHideProperty()
  @IsEmpty({ message: 'El correo electrónico no se puede modificar.' })
  email: string;

  @ApiPropertyOptional({
    description: 'La contraseña del usuario puede ser modificada.',
    example: 'ContraseñaSegura1234!',
  })
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser un texto válido.' })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía si se manda.' })
  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minUppercase: 1,
      minLowercase: 1,
      minSymbols: 1,
    },
    {
      message:
        'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un símbolo especial.',
    },
  )
  password: string;

  @ApiPropertyOptional({
    description:
      'El número de teléfono del usuario, incluyendo el código del país. Puede ser modificado.',
    example: '+5215512345678',
  })
  @IsOptional()
  @IsPhoneNumber(undefined, {
    message:
      'El número de teléfono debe ser válido según el estándar internacional e incluir el código de país (ejemplo: +52 para México).',
  })
  phone: string;

  @ApiPropertyOptional({
    description:
      'La dirección física del usuario, que puede ser utilizada para el envío de correspondencia. Puede ser modificada.',
    example: 'Calle Falsa 123, Ciudad Ficticia',
  })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser un texto válido.' })
  address?: string;

  @ApiPropertyOptional({
    description:
      'El Documento Nacional de Identidad (DNI) del usuario, utilizado como identificación oficial.',
    example: 12345678,
  })
  @IsOptional()
  @IsInt({ message: 'El DNI debe ser un número entero válido.' })
  @IsNotEmpty({ message: 'El DNI es obligatorio y no puede estar vacío.' })
  dni: number;

  @ApiHideProperty()
  @IsEmpty({
    message:
      'No se permite incluir el estado del usuario en la solicitud. Este valor se asigna automáticamente.',
  })
  userStatus?: string;

  @ApiHideProperty()
  @IsEmpty({ message: 'No se puede editar el rol del usuario.' })
  isAdmin?: boolean;

  @ApiHideProperty()
  @IsEmpty({
    message:
      'No se permite incluir la fecha de creación del usuario en la solicitud. Este valor se asigna automáticamente.',
  })
  createUser?: Date;

  @ApiHideProperty()
  @IsEmpty({
    message:
      'No se permite incluir la fecha de actualización del usuario en la solicitud. Este valor se asigna automáticamente.',
  })
  updateUser?: Date;

  @ApiHideProperty()
  @IsEmpty({
    message: 'No pueden ser modificadas las actividades del usuario.',
  })
  activities: Activity[];

  @ApiHideProperty()
  @IsEmpty({
    message: 'No pueden ser modificadas las reservaciones del usuario.',
  })
  reservations: Reservation[];

  @ApiHideProperty()
  @IsEmpty({ message: 'No pueden ser modificadas las órdenes del usuario.' })
  orders: Order[];
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

  @ApiProperty({ description: 'Ordenes del usuario.' })
  orders: Omit<Order[], 'user'>;

  @ApiProperty({ description: 'Reservaciones del usuario.', type: [ReservationDTO]})
  reservations: ReservationDTO[];

  @ApiProperty({
    description: 'Actividades a las que se registro el usuario.',
    type: [Activity],
  })
  activities: Activity[];

  @ApiProperty({
    description: 'Suscripciones a las que se inscribio el usuario.',
    type: [SubscriptionDetail],
  })
  subscriptionsDetails: SubscriptionDetail[]
}

export class UserDTOResponse {
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

export interface UserFilters {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  dni?: number;
  userStatus?: string;
  isAdmin?: string;
}
