import { NotFoundException} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SECRET_SECRET_WORD } from "src/config/config.envs";
import { UserService } from "src/User/user.service";
import { CreateMessageDto } from "./message.Dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "src/Entities/Message.entity";
import { Repository } from "typeorm";
import { Chat } from "src/Entities/Chat.entity";
import { User } from "src/Entities/User.entity";
import respuestasPredefinidas from "./resPredifinidas";


@WebSocketGateway({
    transports:["websocket" , "polling"],
    cors:{origin:"*"}})
export class websockets implements OnGatewayInit , OnGatewayConnection , OnGatewayDisconnect {
    constructor(private readonly jwtService:JwtService,
        private readonly userService:UserService,
        @InjectRepository(Message) private messageRepository:Repository<Message>,
        @InjectRepository(Chat) private chatRepository:Repository<Chat>,
        @InjectRepository(User) private userRepository:Repository<User>,
   ){}
    
    @WebSocketServer()
    server: Server;

    private users = new Map<string, Socket>();
    
    afterInit(server:Server) {
    }

     async handleConnection(client: Socket) {

        try{
            const token = client.handshake.headers.authorization?.split(" ")[1] || client.handshake.auth.token;
            
            if(!token){
                throw new NotFoundException("no se encontro el token")
            }

            const payload = await this.jwtService.verifyAsync(token,{
                secret: SECRET_SECRET_WORD 
            })
            
            const user = await this.userService.getUserById(payload.id)
            if(!user){
                throw new NotFoundException("el usuario no existe")
            }

            client.data.user = user;
            this.users.set(client.id,client)
            console.log(user);
            
        }catch(error){
            console.log(error);
        }
    }

    handleDisconnect(client: Socket) {
        this.users.delete(client.id)
    }
    
    @SubscribeMessage("mensaje")
    async handleMessage(@ConnectedSocket() Client:Socket ,@MessageBody() data:CreateMessageDto){

        try{
            const token =  Client.handshake.auth.token || Client.handshake.headers.authorization?.split(" ")[1];
            
            if(!token){
                throw new NotFoundException("no se encontro el token")
            }
            
            const payload = await this.jwtService.verifyAsync(token,{
                secret: SECRET_SECRET_WORD 
            })
            
            const user = await this.userRepository.findOne({
                where:{id:payload.id},
                relations:["chat"]
            })
            
            if(!user){
                throw new NotFoundException("el usuario no existe")
            }
            const chat = user.chat
            
            if(!chat){
                const newChat = this.chatRepository.create({user})
                
                await this.chatRepository.save(newChat);
                throw new NotFoundException("el usuario no tiene un chat asignado")
            }

            
            const sender = payload.isAdmin;

            const newMessage = this.messageRepository.create({
                content:data.content,
                sender,
                createdAt:new Date(),
                chat,
            });

            await this.messageRepository.save(newMessage)
            this.server.emit("mensajeserver" , newMessage)


           function obtenerRespuestaAutomatica(mensaje: string): string | null {
                const mensajeLower = mensaje.toLowerCase();
                for (const { key, response } of respuestasPredefinidas) {
                    if (key.some((palabra) => mensajeLower.includes(palabra))) {
                        return response;
                    }
                }
                return null;
            }
        
        const respuestaBot = obtenerRespuestaAutomatica(data.content);
        
        if (respuestaBot) {
        setTimeout(async () => {
        const botMessage = this.messageRepository.create({
            content: respuestaBot,
            sender: true, 
            createdAt: new Date(),
            chat,
        });
        
        await this.messageRepository.save(botMessage);
        Client.emit("mensajeserver", botMessage);
        }, 2000);
        }
        }catch(error){
            console.log(error)
        }
    }        
}

