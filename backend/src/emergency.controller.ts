// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// ARQUIVO: backend/src/emergency.controller.ts
// OBJETIVO: Controller de Emergência Híbrido (Persistência RAM + Socket Real-Time)
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

    // A. Criação do Objeto de Alerta (Logica do Data A)
    // Se vier localização do celular, usa. Se não, usa fallback Piracicaba.
    const newAlert: Alert = {
      id: Date.now().toString(),
      latitude: data.location?.latitude || -22.7348, 
      longitude: data.location?.longitude || -47.6476,
      batteryLevel: data.battery || '50%',
      createdAt: new Date().toISOString(),
      resolved: false,
      user: {
        name: data.userName || 'Paciente Monitorado',
        photoUrl: 'https://ui-avatars.com/api/?background=random&name=' + (data.userName || 'User'),
        chronicDiseases: 'Monitoramento Cardíaco'
      }
    };

    // B. Persistência em Memória (Data A)
    ALERTS_DB.unshift(newAlert);

    // C. DISPARO REAL-TIME VIA SOCKET (Data B)
    // Isso faz o card vermelho aparecer no Dashboard (5173)
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
        message: 'SOS processado, salvo e enviado para a Central.' 
    };
  }

  // --- 2. LISTAR ALERTAS (GET /sos) ---
  @Get()
  getAllAlerts() {
    return ALERTS_DB;
  }

  // --- 3. RESOLVER ALERTA (PATCH /sos/:id) ---
  @Patch(':id')
  resolveAlert(@Param('id') id: string) {
    const alertIndex = ALERTS_DB.findIndex(a => a.id === id);
    if (alertIndex > -1) {
      ALERTS_DB[alertIndex].resolved = true;
      // Opcional: Avisar o painel que foi resolvido via socket também
      this.appGateway.server.emit('update-alerts', ALERTS_DB);
    }
    return { status: 'RESOLVED' };
  }
}