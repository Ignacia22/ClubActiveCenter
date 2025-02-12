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

  listenToMessages(callback: (message: Message) => void) {
    if (this.socket) {
      this.socket.on("mensajeserver", (data: unknown) => {
        try {
          if (
            typeof data === "object" &&
            data !== null &&
            "content" in data &&
            "sender" in data &&
            "createdAt" in data &&
            (typeof (data as { createdAt: unknown }).createdAt === "string" ||
              typeof (data as { createdAt: unknown }).createdAt === "number")
          ) {
            const newMessage: Message = {
              content: String((data as { content: unknown }).content),
              sender: Boolean((data as { sender: unknown }).sender),
              createdAt: new Date(
                (data as { createdAt: string | number }).createdAt
              ),
            };
            callback(newMessage);
          } else {
            console.error("Datos de mensaje inválidos:", data);
          }
        } catch (error) {
          console.error("Error procesando mensaje:", error);
        }
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
