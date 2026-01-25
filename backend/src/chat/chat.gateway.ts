import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // console.log(`⚡ Cliente Conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // console.log(`❌ Cliente Saiu: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.join(roomId);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() payload: { roomId: string; userId: string; text: string; type?: 'TEXT' | 'ALERT' }) {
    const messageData = {
      ...payload,
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9),
      type: payload.type || 'TEXT',
    };
    // Envia para todos na sala
    this.server.to(payload.roomId).emit('newMessage', messageData);
  }

  @SubscribeMessage('triggerSOS')
  handleSOS(@MessageBody() data: { userId: string; location: any }) {
    console.log(`🚨 SOS DE: ${data.userId}`);
    this.server.to(`guardians_${data.userId}`).emit('sosAlert', data);
  }
}