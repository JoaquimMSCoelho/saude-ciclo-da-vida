/**
 * -------------------------------------------------------------------------
 * PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
 * ARQUITETURA: BACKEND (Automation Module)
 * OBJETIVO: FORNECER DADOS PARA O OPENCLAW COM SEGURANÇA JWT E AUDITORIA
 * VERSÃO: FUSÃO CONTROLADA v2.9.4 - INCLUSÃO DE ROTA DE PÂNICO
 * -------------------------------------------------------------------------
 */

import { 
  Controller, 
  Get, 
  Post, 
  Param, 
  Req, 
  UseGuards 
} from '@nestjs/common';
import { AutomationService } from './automation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { Request } from 'express';

/**
 * Interface técnica para estender o Request do Express com a tipagem do User
 * Necessário para capturar o ID do Médico/Admin que está extraindo o dado.
 */
interface RequestWithUser extends Request {
  user: {
    id: string; // Mapeado para userId no sistema
    userId?: string; // Compatibilidade com diferentes versões de payload JWT
    email: string;
    role: string;
  };
}

// AJUSTE CRÍTICO: O prefixo api/v1 é injetado pelo main.ts automaticamente
@Controller('automation') 
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  /**
   * Endpoint de Extração Direta (Mapeado para campos médicos)
   * Local: GET /api/v1/automation/extract/:patientId
   */
  @UseGuards(JwtAuthGuard)
  @Get('extract/:patientId')
  async getPatientForAutofill(
    @Param('patientId') id: string,
    @Req() req: RequestWithUser
  ) {
    // Captura o ID de quem está solicitando para o log de auditoria
    const requesterId = req.user.id || req.user.userId; 
    return this.automationService.getPayloadForCrawler(id, requesterId);
  }

  /**
   * Endpoint de Integração (Payload para Prontuário)
   * Local: GET /api/v1/automation/payload/:id
   */
  @UseGuards(JwtAuthGuard)
  @Get('payload/:id')
  async exportToProntuario(
    @Param('id') id: string,
    @Req() req: RequestWithUser
  ) {
    const requesterId = req.user.id || req.user.userId;
    return this.automationService.getPayloadForCrawler(id, requesterId);
  }

  /**
   * Rota de Gatilho de Pânico (SOS)
   * Conecta o acionamento do botão ao serviço de crise
   * Local: POST /api/v1/automation/panic/:userId
   */
  @UseGuards(JwtAuthGuard)
  @Post('panic/:userId')
  async triggerPanic(@Param('userId') userId: string) {
    return this.automationService.triggerPanicAlert(userId);
  }

  /**
   * Rota de Setup (Validação Técnica)
   * Permite criar dados de teste para o paciente alvo
   * Local: POST /api/v1/automation/setup-test/:id
   */
  @UseGuards(JwtAuthGuard)
  @Post('setup-test/:id')
  async setupTest(@Param('id') id: string) {
    return this.automationService.setupTestProfile(id);
  }
}