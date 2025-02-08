import { Module } from "@nestjs/common";
import { websockets } from "./websocket.gateway";

@Module({
    providers:[websockets]
})

export class webSocketModule{}