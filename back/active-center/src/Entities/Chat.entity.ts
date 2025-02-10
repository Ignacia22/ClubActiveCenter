import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.entity";
import {v4 as uuid} from "uuid"
import { Message } from "./Message.entity";

@Entity({name:"chats"})
export class Chat {

@PrimaryGeneratedColumn("uuid")
id = uuid();

@OneToOne(() => User , (user) => user.chat)
@JoinColumn()
user: User;

@OneToMany(() => Message, (message) => message.chat)
messages:Message[];

}

