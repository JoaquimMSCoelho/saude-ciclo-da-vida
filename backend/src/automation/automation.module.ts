// ------------------------------------------------------------
// ARQUIVO: backend/src/automation/automation.module.ts
// OBJETIVO: AJUSTE DE REFERÊNCIA - PRISMA SERVICE
// ------------------------------------------------------------

import { Module } from '@nestjs/common';
import { AutomationController } from './automation.controller';
import { AutomationService } from './automation.service';
// --- LINHA AJUSTADA ABAIXO (Removido /prisma/) ---
import { PrismaService } from '../prisma.service'; 

@Module({
  controllers: [AutomationController],
  providers: [AutomationService, PrismaService],
  exports: [AutomationService],
})
export class AutomationModule {}