// ARQUIVO: backend/src/emergency.controller.ts
// OBJETIVO: Controller de Emergência isolado na rota '/sos'
// ---------------------------------------------------------
import { Controller, Post, Get, Body, Patch, Param } from '@nestjs/common';

// 1. DEFINIÇÃO DE TIPAGEM (Para evitar erros de "never")
interface Alert {
  id: string;
  latitude: number;
  longitude: number;
  batteryLevel: number;
  createdAt: string;
  resolved: boolean;
  user: {
    name: string;
    photoUrl: string;
    chronicDiseases: string;
  };
}

// 2. BANCO DE DADOS VOLÁTIL (Memória RAM)
// Reinicia vazio toda vez que o servidor reinicia
let ALERTS_DB: Alert[] = []; 

// 3. MUDANÇA CRÍTICA: Rota definida como 'sos' para evitar conflitos com 'alerts'
@Controller('sos') 
export class EmergencyController {

  // RECEBER ALERTA (POST /sos)
  @Post()
  async receiveAlert(@Body() data: any) {
    console.log('\n🚨 ------------------------------------------------ 🚨');
    console.log('🚨 ALERTA SOS RECEBIDO NA NOVA ROTA (/sos)');
    console.log(`👤 Usuário: ${data.userName}`);
    console.log('🚨 ------------------------------------------------ 🚨\n');
    
    const newAlert: Alert = {
      id: Date.now().toString(),
      latitude: -22.7348, // Localização Simulada (Piracicaba)
      longitude: -47.6476,
      batteryLevel: parseInt(data.battery) || 50,
      createdAt: new Date().toISOString(),
      resolved: false,
      user: {
        name: data.userName || 'Paciente',
        photoUrl: 'https://ui-avatars.com/api/?background=random&name=' + (data.userName || 'User'),
        chronicDiseases: 'Monitorado'
      }
    };

    // Adiciona no topo da lista
    ALERTS_DB.unshift(newAlert);

    return { status: 'RECEIVED', message: 'Alerta processado na rota SOS' };
  }

  // LISTAR ALERTAS (GET /sos)
  @Get()
  getAllAlerts() {
    return ALERTS_DB;
  }

  // RESOLVER ALERTA (PATCH /sos/:id)
  @Patch(':id')
  resolveAlert(@Param('id') id: string) {
    const alertIndex = ALERTS_DB.findIndex(a => a.id === id);
    if (alertIndex > -1) {
      ALERTS_DB[alertIndex].resolved = true;
    }
    return { status: 'RESOLVED' };
  }
}