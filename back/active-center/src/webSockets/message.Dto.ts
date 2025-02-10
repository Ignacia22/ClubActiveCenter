import { IsBoolean, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Role } from "src/User/UserDTO/Role.enum";

export class CreateMessageDto{

    @IsString()
    @IsNotEmpty()
    content:string;

    
    @IsBoolean()
    sender:boolean;
    
    @IsString()
    @IsNotEmpty()
    chatId:string

}