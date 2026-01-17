/**
 * -------------------------------------------------------------------------
 * PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
 * ARQUITETURA: BACKEND (Controller Layer)
 * GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
 * -------------------------------------------------------------------------
 * MÓDULO: ALERTS CONTROLLER
 * ROTA: http://localhost:3000/alerts
 * -------------------------------------------------------------------------
 */

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlertsService } from './alerts.service';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  create(@Body() data: any) { return this.alertsService.create(data); }

  @Get()
  findAll() { return this.alertsService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.alertsService.findOne(id); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) { return this.alertsService.update(id, data); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.alertsService.remove(id); }
}