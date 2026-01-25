// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// ARQUIVO: backend/src/app.gateway.ts
// OBJETIVO: Gerenciador de Real-Time (Socket.IO) - O Cérebro da Conexão
// -------------------------------------------------------------------------

import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  OnGatewayConnection, 
  OnGatewayDisconnect 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// Configuração de CORS específica para WebSockets
// Autoriza: Novo Dashboard (5173), Antigo (3000) e Mobile/Outros (*)
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000', '*'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`⚡ [SOCKET] Cliente Conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ [SOCKET] Cliente Desconectado: ${client.id}`);
  }

  // --- OUVINTE 1: GATILHO DE PÂNICO (Vem do Mobile) ---
  @SubscribeMessage('sos-alert')
  handleSosAlert(client: Socket, payload: any): void {
    console.log('🚨 ALERTA DE PÂNICO RECEBIDO (Gateway):', payload);
    
    // Retransmite para TODOS os Dashboards conectados
    this.server.emit('triggerSOS', payload);
  }

  // --- OUVINTE 2: RASTREAMENTO GPS (Vem do Mobile) ---
  @SubscribeMessage('send-location')
  handleLocation(client: Socket, payload: any): void {
    // Retransmite a localização para os mapas
    this.server.emit('update-location', payload);
  }

  // --- OUVINTE 3: SALA DE CHAT (Entrada de Usuário) ---
  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, userId: string): void {
    client.join(userId);
    console.log(`👤 Usuário entrou na sala: ${userId}`);
  }
}