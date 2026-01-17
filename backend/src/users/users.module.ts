/**
 * -------------------------------------------------------------------------
 * PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
 * ARQUITETURA: BACKEND (Module Layer)
 * -------------------------------------------------------------------------
 * MÓDULO: USERS MODULE
 * DESCRIÇÃO: Agrupa Controller e Service.
 * CRÍTICO: Exporta o UsersService para que o AuthModule possa usar.
 * -------------------------------------------------------------------------
 */

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // <--- A MÁGICA: Permite que o AuthModule use este serviço
})
export class UsersModule {}