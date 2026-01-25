// -------------------------------------------------------------------------
// MÓDULO: CHAT (Configuração)
// -------------------------------------------------------------------------

import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Module({
  providers: [ChatGateway],
  exports: [ChatGateway] // Exporta para uso externo se necessário
})
export class ChatModule {}