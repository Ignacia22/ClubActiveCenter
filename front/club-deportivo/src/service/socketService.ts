import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  constructor() {}

  // Conectar al servidor WebSocket
  connect(token: string) {
    this.socket = io("https://active-center-db-3rfj.onrender.com", {
      auth: {
        token,
      },
    });

    this.socket.on("connect", () => {
      console.log("Conectado al servidor de WebSocket");
    });

    this.socket.on("disconnect", () => {
      console.log("Desconectado del servidor de WebSocket");
    });
  }

  // Emitir un mensaje
  sendMessage(content: string, sender: boolean, chatId: string) {
    if (this.socket) {
      this.socket.emit("mensaje", { content, sender, chatId });
    }
  }

  // Escuchar mensajes del servidor
  listenToMessages(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on("mensajeserver", callback);
    }
  }

  // Desconectar el socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketService();
