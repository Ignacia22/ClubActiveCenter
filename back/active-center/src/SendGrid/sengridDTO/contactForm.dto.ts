import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class ContactFormDTO {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @Matches(/^\d{7,15}$/, {
    message: 'El teléfono debe contener entre 7 y 15 dígitos numéricos',
  })
  phone: string;

  @IsEmail({}, { message: 'El email no es válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'El mensaje no puede estar vacío' })
  message: string;
}
