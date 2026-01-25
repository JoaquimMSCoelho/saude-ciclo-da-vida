// -------------------------------------------------------------------------
// ARQUIVO: backend/src/app.module.ts
// OBJETIVO: Módulo Raiz (Orquestrador Global)
// STATUS: INFRAESTRUTURA HÍBRIDA (Prisma + TypeORM SQLite + Socket.IO)
// -------------------------------------------------------------------------

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- IMPORTAÇÃO CRÍTICA PARA O MÓDULO 6
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

// --- NOVO: CÉREBRO DE REAL-TIME ---
import { AppGateway } from './app.gateway'; // <--- OBRIGATÓRIO: Gateway do Socket

// --- MÓDULOS DE NEGÓCIO ---
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AlertsModule } from './alerts/alerts.module';
import { LocationModule } from './location/location.module'; // Módulo 6 (GPS)
import { ChatModule } from './chat/chat.module';             // Módulo 2 (Chat SOS)

// --- CONTROLLERS ---
import { EmergencyController } from './emergency.controller';

// --- INFRAESTRUTURA DE E-MAIL ---
import { MailerModule } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';

@Module({
  imports: [
    // 1. CONFIGURAÇÃO DE BANCO DE DADOS (TYPEORM - EXCLUSIVO PARA GPS)
    // Cria um arquivo 'location_data.db' na raiz para armazenar logs de rastreio.
    // Isso roda em paralelo ao Prisma, sem gerar conflitos.
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'location_data.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Cria tabelas automaticamente (apenas em dev)
    }),

    // 2. Módulos Funcionais do Sistema
    UsersModule,
    AuthModule,
    AlertsModule,
    LocationModule, // Rastreamento
    ChatModule,     // WebSockets (Salas e Mensagens)

    // 3. Configuração do Carteiro (E-mail Service)
    MailerModule.forRootAsync({
      useFactory: async () => {
        // Cria conta de teste no Ethereal (Ambiente de Dev)
        const account = await nodemailer.createTestAccount();
        
        console.log('--------------------------------------------------');
        console.log('📧 SERVIÇO DE E-MAIL (TEST MODE)');
        console.log(`👤 User: ${account.user}`);
        console.log('--------------------------------------------------');
        
        return {
          transport: {
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: { user: account.user, pass: account.pass },
          },
          defaults: { from: '"Saúde Ciclo da Vida" <noreply@saudeciclodavida.com>' },
        };
      },
    }),
  ],
  controllers: [
    AppController, 
    EmergencyController
  ],
  providers: [
    AppService, 
    PrismaService, // Mantido globalmente para compatibilidade com Auth/Users
    AppGateway     // <--- AQUI ESTÁ A MÁGICA: Registra o Socket para funcionar
  ],
})
export class AppModule {}