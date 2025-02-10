import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import {v4 as uuid} from "uuid"
import { Chat } from "./Chat.entity";
import { Role } from "src/User/UserDTO/Role.enum";


@Entity({name: "messages"})
export class Message {

  @PrimaryGeneratedColumn("uuid")
  id = uuid();

  @Column()
  content:string;

  @Column()
  sender: boolean;

  @CreateDateColumn({type: "timestamp"})
  createdAt: Date;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat:Chat;


}