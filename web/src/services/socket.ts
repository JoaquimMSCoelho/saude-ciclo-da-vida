// -------------------------------------------------------------------------
// ARQUIVO: E:\Projetos\SaudeCicloDaVida\web\src\services\socket.ts
// OBJETIVO: Conexão Real com o Backend (Porta 4000)
// -------------------------------------------------------------------------

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000';

class SocketService {
  public socket: Socket | null = null;

  connect() {
    if (this.socket) return;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => console.log('🟢 WEB Conectado! ID:', this.socket?.id));
    this.socket.on('disconnect', () => console.log('🔴 WEB Desconectado.'));
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.socket) this.connect();
    this.socket?.on(event, callback);
  }

  off(event: string) {
    this.socket?.off(event);
  }
}

export const socketService = new SocketService();