import { NotFoundException, Request } from "@nestjs/common";
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

@WebSocketGateway()
export class websockets implements  OnGatewayConnection , OnGatewayDisconnect {
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
        console.log("se inicializo con exito!")
    }

     async handleConnection(client: Socket) {

        try{
            const authHeader = client.handshake.headers.authorization;
            const token = authHeader?.split(" ")[1];
            
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
            
            console.log(`${user.name} se conecto al chat`)
            console.log('Usuarios conectados:', Array.from(this.users.keys()));
            
        }catch(error){
            console.log("token invalido")
        }
    }

    handleDisconnect(client: Socket) {
    
        console.log(`${client.data.user.name} se desconecto`)
        this.users.delete(client.id)
        console.log('Usuarios conectados:', Array.from(this.users.keys()))
    }

    @SubscribeMessage("mensaje")
    async handleMessage(@ConnectedSocket() Client:Socket ,@MessageBody() data:CreateMessageDto){

        try{
            const authHeader = Client.handshake.headers.authorization;
            const token = authHeader?.split(" ")[1];
            
            if(!token){
                throw new NotFoundException("no se encontro el token")
            }

            const payload = await this.jwtService.verifyAsync(token,{
                secret: SECRET_SECRET_WORD 
            })
            console.log(payload.isAdmin)
            
            const user = await this.userRepository.findOne({
                where:{id:payload.id},
                relations:["chat"]
            })
            if(!user){
                throw new NotFoundException("el usuario no existe")
            }
            console.log(user);

            const sender = payload.isAdmin;
            const chatId = user.chat.id;
              
            const chat = await this.chatRepository.findOne({
                where:{id:chatId}
            })
            
            if(!chat){
                throw new NotFoundException("el chat no existe");
            }
            
            const newMessage = this.messageRepository.create({
                content:data.content,
                sender,
                createdAt:new Date(),
                chat,
            });
            console.log(newMessage)
            
            await this.messageRepository.save(newMessage)
            
            this.users.forEach((Client) => {
                if((sender  && Client.data.user.id === user.id) || 
                (!sender === true && Client.data.user.id === user.id)){
                    
                    Client.emit("mensajeserver" , newMessage)
                }
    
         })

        }catch(error){
            console.log(error)
        
        }

    }
}



