import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class InquiryDTO{

    @IsNotEmpty({message: "El mail no puede estar vacío"})
    @IsEmail({}, { message: "El email no es válido" })
    email: string;

    @IsNotEmpty({message: "Añada un asunto"})
    @IsString()
    @Length(4, 12,{message: "El asunto debe tener entre 4 y 12 caracteres"})
    asunto: string;

    @IsNotEmpty({message: "por favor, añada el texto de su consulta"})
    @IsString()
    @Length(10, 200,{message: "El texto de la consulta debe tener entre 10 y 200 caracteres"})
    text: string;
}