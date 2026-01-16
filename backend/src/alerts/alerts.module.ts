// ARQUIVO: backend/src/alerts/alerts.module.ts
import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { PrismaService } from '../prisma.service'; // Importando a ferramenta

@Module({
  controllers: [AlertsController],
  providers: [AlertsService, PrismaService], // Injetando a ferramenta
})
export class AlertsModule {}