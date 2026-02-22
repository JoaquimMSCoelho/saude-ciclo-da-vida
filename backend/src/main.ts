/**
 * -------------------------------------------------------------------------
 * PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
 * ARQUITETURA: BACKEND (Entry Point)
 * VERSÃO: FINAL STABLE (Híbrida A+B)
 * -------------------------------------------------------------------------
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // INJEÇÃO TÉCNICA: Define o prefixo global para todas as rotas
  // Isso garante que o endereço seja /api/v1/... (Ex: /api/v1/auth/login)
  app.setGlobalPrefix('api/v1');

  // 1. SEGURANÇA (Mantendo sua configuração robusta)
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 2. INICIALIZAÇÃO (Ajuste Crítico de Infraestrutura)
  // - Porta: 4000 (Para não colidir com o Web Admin na 3000)
  // - Host: '0.0.0.0' (OBRIGATÓRIO para o celular conectar via Wi-Fi)
  await app.listen(4000, '0.0.0.0');

  console.log(`\n🚀 ---------------------------------------------------`);
  console.log(`✅ BACKEND OPERACIONAL NA PORTA 4000`);
  console.log(`💻 Acesso Local: http://localhost:4000`);
  console.log(`📡 Prefixo API: /api/v1`);
  console.log(`📱 Acesso Mobile: Use o IP da sua máquina (ex: 192.168.15.11:4000)`);
  console.log(`🧪 Teste de Rota: http://localhost:4000/api/v1/automation/payload/...`);
  console.log(`---------------------------------------------------\n`);
}
bootstrap();