import { io, Socket } from "socket.io-client";

interface Message {
  content: string;
  sender: boolean;
  createdAt: Date;
}

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    this.socket = io("https://active-center-db-3rfj.onrender.com", {
      auth: { token },
    });

    this.socket.on("connect", () => {
      console.log("Conectado al servidor de WebSocket");
    });

    this.socket.on("disconnect", () => {
      console.log("Desconectado del servidor de WebSocket");
    });
  }

  // Ahora la función espera un callback con Message
  listenToMessages(callback: (message: Message) => void) {
    if (this.socket) {
      this.socket.on("mensajeserver", (data: any) => {
        const newMessage: Message = {
          content: data.content,
          sender: data.sender,
          createdAt: new Date(data.createdAt), // Asegura que sea un Date válido
        };
        callback(newMessage);
      });
    }
  }

  sendMessage(content: string, sender: boolean, chatId: string) {
    if (this.socket) {
      this.socket.emit("mensaje", { content, sender, chatId });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

const socketServiceInstance = new SocketService();
export default socketServiceInstance;
