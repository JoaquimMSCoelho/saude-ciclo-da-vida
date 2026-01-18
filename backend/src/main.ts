/**
 * -------------------------------------------------------------------------
 * PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
 * ARQUITETURA: BACKEND (Entry Point)
 * GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
 * -------------------------------------------------------------------------
 * MÓDULO: MAIN FILE
 * DESCRIÇÃO: Inicializa o servidor e HABILITA O CORS para permitir
 * que o Frontend (Porta 3001) converse com o Backend (Porta 3000).
 * -------------------------------------------------------------------------
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- CONFIGURAÇÃO DE SEGURANÇA (CORS) ---
  app.enableCors({
    origin: '*', // Em produção, trocaremos por 'http://seudominio.com'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // ----------------------------------------

  await app.listen(3000, '0.0.0.0'); // O '0.0.0.0' é fundamental para o celular conectar
console.log(`🚀 BACKEND OPERACIONAL: http://192.168.15.8:3000`);
}
bootstrap();