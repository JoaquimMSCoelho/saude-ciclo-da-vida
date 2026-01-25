// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// MÓDULO: CHAT SERVICE (CLIENTE SOCKET.IO)
// OBJETIVO: Gerenciar conexão em tempo real com o Backend
// -------------------------------------------------------------------------

import io, { Socket } from 'socket.io-client';

// URL DO BACKEND
// Nota: Se estiver rodando no Emulador Android, use 'http://10.0.2.2:4000'
// Se estiver no dispositivo físico, use o IP da sua máquina (ex: 192.168.15.11)
const SOCKET_URL = 'http://192.168.15.11:4000'; 

class ChatServiceImpl {
  private socket: Socket | null = null;

  /**
   * 1. INICIAR CONEXÃO
   * Estabelece o túnel de comunicação com o servidor
   */
  connect() {
    // Evita criar múltiplas conexões se já existir uma ativa
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'], // Força WebSocket para melhor performance
      reconnection: true,        // Tenta reconectar se a net cair
    });

    this.socket.on('connect', () => {
      console.log('🟢 [CHAT MOBILE] Conectado ao Servidor:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('🔴 [CHAT MOBILE] Desconectado.');
    });

    this.socket.on('connect_error', (err) => {
      console.log('⚠️ [CHAT MOBILE] Erro de conexão:', err.message);
    });
  }

  /**
   * 2. ENTRAR EM UMA SALA
   * @param roomId ID da sala (ex: "sos_user123" ou "group_family")
   */
  joinRoom(roomId: string) {
    if (!this.socket) this.connect();
    this.socket?.emit('joinRoom', roomId);
  }

  /**
   * 3. ENVIAR MENSAGEM
   */
  sendMessage(roomId: string, userId: string, text: string, type: 'TEXT' | 'ALERT' = 'TEXT') {
    if (!this.socket) return;
    
    this.socket.emit('sendMessage', {
      roomId,
      userId,
      text,
      type
    });
  }

  /**
   * 4. DISPARAR SOS (Botão de Pânico)
   */
  triggerSOS(userId: string, location: any) {
    if (!this.socket) this.connect();
    this.socket?.emit('triggerSOS', { userId, location });
  }

  /**
   * 5. OUVIR MENSAGENS (Callback)
   * A tela passa uma função para ser executada quando chegar mensagem nova
   */
  onMessageReceived(callback: (message: any) => void) {
    if (!this.socket) return;
    
    // Remove listeners antigos para não duplicar mensagens na tela
    this.socket.off('newMessage'); 
    
    this.socket.on('newMessage', (msg) => {
      callback(msg);
    });
  }

  /**
   * 6. ENCERRAR (Logout)
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const ChatService = new ChatServiceImpl();