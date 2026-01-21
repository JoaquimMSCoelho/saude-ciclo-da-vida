// ARQUIVO: backend/src/app.module.ts
// OBJETIVO: Módulo Raiz (Orquestrador Global)
// STATUS: FUSÃO COMPLETA (Auth + Pânico + Alertas + E-mail)

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

// --- MÓDULOS DE NEGÓCIO ---
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AlertsModule } from './alerts/alerts.module';

// --- CONTROLLERS ---
import { EmergencyController } from './emergency.controller'; // O Botão de Pânico

// --- INFRAESTRUTURA DE E-MAIL ---
import { MailerModule } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';

@Module({
  imports: [
    // 1. Módulos do Sistema (Legado + Atual)
    UsersModule,
    AuthModule,
    AlertsModule, // Mantido para não quebrar o sistema de notificações

    // 2. Configuração do Carteiro (Ethereal / Nodemailer)
    MailerModule.forRootAsync({
      useFactory: async () => {
        // Cria uma conta de teste fake no Ethereal na hora (Zero Config)
        const account = await nodemailer.createTestAccount();
        
        console.log('--------------------------------------------------');
        console.log('📧 SERVIÇO DE E-MAIL INICIADO (Modo Teste)');
        console.log(`👤 Usuário: ${account.user}`);
        console.log(`🔑 Senha:   ${account.pass}`);
        console.log('--------------------------------------------------');
        
        return {
          transport: {
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
              user: account.user,
              pass: account.pass,
            },
          },
          defaults: {
            from: '"Saúde Ciclo da Vida" <noreply@saudeciclodavida.com>',
          },
        };
      },
    }),
  ],
  controllers: [
    AppController,
    EmergencyController // Mantido: A rota do Botão SOS
  ],
  providers: [
    AppService,
    PrismaService // Injetado globalmente para garantir acesso ao DB
  ],
})
export class AppModule {}