import { Module } from "@nestjs/common";
import { websockets } from "./websocket.gateway";
import { UserService } from "src/User/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "src/Entities/Message.entity";
import { User } from "src/Entities/User.entity";
import { Chat } from "src/Entities/Chat.entity";
import { SendGridService } from "src/SendGrid/sendGrid.service";
import { SendGridModule } from "src/SendGrid/sendGrid.module";

@Module({
    providers:[websockets,UserService],
    imports:[TypeOrmModule.forFeature([Message,User,Chat])]
})

export class webSocketModule{}