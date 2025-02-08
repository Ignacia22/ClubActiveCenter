import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway()
export class websockets implements OnGatewayInit , OnGatewayConnection , OnGatewayDisconnect {
    
    @WebSocketServer()
    server: Server;
    
    afterInit(server:Server) {
        console.log("se inicializo con exito!")
        throw new Error("Method not implemented.");
    }

    handleConnection(client: Socket) {
        
        console.log(`user con ID: ${client} se conecto`)
    }

    handleDisconnect(client: Socket) {
        console.log(`user con ID: ${client.id} se conecto`)
    }

    @SubscribeMessage("mensaje")
    handleMessage(@ConnectedSocket() Client:Socket ,@MessageBody() data:any){
        console.log(data);
        Client.broadcast.emit("mensajeserver" , data)

    }
}



