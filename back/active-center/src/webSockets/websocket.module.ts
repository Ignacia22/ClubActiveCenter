import { Module } from "@nestjs/common";
import { websockets } from "./websocket.gateway";
import { UserService } from "src/User/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "src/Entities/Message.entity";
import { User } from "src/Entities/User.entity";
import { Chat } from "src/Entities/Chat.entity";

@Module({
    providers:[websockets,UserService],
    imports:[TypeOrmModule.forFeature([Message,User,Chat])]
})

export class webSocketModule{}