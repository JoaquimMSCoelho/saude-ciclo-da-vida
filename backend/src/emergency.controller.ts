// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// ARQUIVO: backend/src/emergency.controller.ts
// OBJETIVO: Controller de Emergência Híbrido (RAM + Socket + Sincronia Global)
// -------------------------------------------------------------------------

import { Controller, Post, Get, Body, Patch, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { AppGateway } from './app.gateway'; // <--- CÉREBRO DO SOCKET

// 1. DEFINIÇÃO DE TIPAGEM
interface Alert {
  id: string;
  latitude: number;
  longitude: number;
  batteryLevel: string | number;
  createdAt: string;
  resolved: boolean;
  resolvedAt?: string; // Campo para relatório de auditoria
  user: {
    name: string;
    photoUrl: string;
    chronicDiseases: string;
  };
}

// 2. BANCO DE DADOS VOLÁTIL (Memória RAM)
let ALERTS_DB: Alert[] = []; 

@Controller('sos') 
export class EmergencyController {
  
  // INJEÇÃO DE DEPENDÊNCIA (Conecta o Controller ao Socket)
  constructor(private readonly appGateway: AppGateway) {}

  // --- 1. RECEBER ALERTA E DISPARAR (POST /sos) ---
  @Post()
  @HttpCode(HttpStatus.OK)
  async receiveAlert(@Body() data: any) {
    console.log('\n🚨 ------------------------------------------------ 🚨');
    console.log('🚨 ALERTA SOS RECEBIDO (HTTP)');
    console.log(`👤 Usuário: ${data.userName || 'Desconhecido'}`);

    // A. Criação do Objeto de Alerta
    const newAlert: Alert = {
      id: Date.now().toString(),
      latitude: data.location?.latitude || -22.7348, 
      longitude: data.location?.longitude || -47.6476,
      batteryLevel: data.battery || '50%',
      createdAt: new Date().toISOString(),
      resolved: false,
      user: {
        name: data.userName || 'Paciente Monitorado',
        photoUrl: `https://ui-avatars.com/api/?background=random&name=${data.userName || 'User'}`,
        chronicDiseases: 'Monitoramento Ativo'
      }
    };

    // B. Persistência em Memória
    ALERTS_DB.unshift(newAlert);

    // C. DISPARO REAL-TIME VIA SOCKET
    this.appGateway.server.emit('triggerSOS', {
        userId: newAlert.id,
        userName: newAlert.user.name,
        location: { latitude: newAlert.latitude, longitude: newAlert.longitude },
        battery: newAlert.batteryLevel,
        timestamp: newAlert.createdAt
    });

    console.log('📡 [SOCKET] Alerta enviado para Dashboards conectados');
    console.log('🚨 ------------------------------------------------ 🚨\n');

    return { 
        status: 'RECEIVED', 
        message: 'SOS processado, salvo e enviado para a Central.',
        alertId: newAlert.id 
    };
  }

  // --- 2. LISTAR ALERTAS (GET /sos) ---
  @Get()
  getAllAlerts() {
    return ALERTS_DB;
  }

  // --- 3. RESOLUÇÃO DE CHAMADOS (PATCH /sos/:id/resolve) ---
  @Patch(':id/resolve')
  resolveAlert(@Param('id') id: string) {
    const alertIndex = ALERTS_DB.findIndex(a => a.id === id);
    
    if (alertIndex > -1) {
      const now = new Date().toISOString();
      ALERTS_DB[alertIndex].resolved = true;
      ALERTS_DB[alertIndex].resolvedAt = now;

      console.log(`✅ [SISTEMA] Ocorrência ${id} resolvida em ${now}`);

      // GATILHO GLOBAL: Sincroniza todos os terminais para remover o card
      this.appGateway.server.emit('alertResolved', { id });
      
      return { 
        status: 'RESOLVED', 
        resolvedAt: now,
        message: 'Ocorrência encerrada com sucesso.'
      };
    }
    
    return { status: 'NOT_FOUND', message: 'Alerta não encontrado no banco volátil.' };
  }
}