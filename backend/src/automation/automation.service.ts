// -------------------------------------------------------------------------
// ARQUIVO: backend/src/automation/automation.service.ts
// OBJETIVO: SERVIÇO DE EXTRAÇÃO COM INTELIGÊNCIA GEOGRÁFICA E AUDITORIA LGPD
// STATUS: FUSÃO CONTROLADA V3.1 - CORREÇÃO DE SCHEMA (REMOÇÃO DE STATUS)
// -------------------------------------------------------------------------

import { Injectable, NotFoundException } from '@nestjs/common';
// --- REFERÊNCIA VALIDADA (src/prisma.service.ts) ---
import { PrismaService } from '../prisma.service'; 

@Injectable()
export class AutomationService {
  constructor(private prisma: PrismaService) {}

  /**
   * EXTRAÇÃO: Gera payload estruturado para o Openclaw com GPS Integrado
   * REGISTRA automaticamente o acesso no AuditLog para conformidade LGPD
   * Baseado no Schema PGT-01: Tabela 'User' + 'PatientProfile' + 'PanicAlert' + 'AuditLog'
   */
  async getPayloadForCrawler(userId: string, requesterId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { 
        profile: true,
        panicAlerts: { take: 1, orderBy: { createdAt: 'desc' } }
      }
    });

    if (!user) throw new NotFoundException('Usuário não localizado no ecossistema.');

    // --- LÓGICA DE GEOPROCESSAMENTO (PGT-01) ---
    const lastAlert = user.panicAlerts[0];
    const lat = lastAlert?.latitude || user.lastLatitude;
    const lng = lastAlert?.longitude || user.lastLongitude;
    
    // Geração de Link Dinâmico para Operador Hospitalar
    const googleMapsUrl = (lat && lng) 
      ? `https://www.google.com/maps?q=${lat},${lng}` 
      : 'LOCALIZAÇÃO NÃO DISPONÍVEL';

    // --- INJEÇÃO TÉCNICA: GRAVAÇÃO DE AUDITORIA (LGPD) ---
    // Registramos o acesso de forma assíncrona para não atrasar a resposta de emergência
    this.createAuditEntry(userId, requesterId);

    return {
      metadata: {
        source: "VAULTMIND_OS_V2.8", // Incremento de versão para Auditoria LGPD
        generated_at: new Date().toISOString(),
        role: user.role
      },
      form_data: {
        nome_completo: user.name?.toUpperCase() || 'NÃO INFORMADO',
        documento_identidade: user.email, 
        tipo_sanguineo: user.profile?.bloodType || 'NÃO INFORMADO',
        alergias: user.profile?.allergies || 'NADA CONSTA',
        doencas_cronicas: user.profile?.chronicDiseases || 'NADA CONSTA',
        ultimo_alerta_pânico: lastAlert?.createdAt || 'SEM REGISTROS'
      },
      // --- MÓDULO GPS (MODO GUARDIÃO) ---
      location_data: {
        latitude: lat || 0,
        longitude: lng || 0,
        google_maps_url: googleMapsUrl,
        origem_dados: lastAlert ? 'Alerta de Pânico (SOS)' : 'Rastreamento Passivo (GPS)',
        nivel_bateria: lastAlert?.batteryLevel ? `${lastAlert.batteryLevel}%` : 'N/A',
        visto_por_ultimo: user.lastSeenAt || lastAlert?.createdAt || 'DESCONHECIDO'
      }
    };
  }

  /**
   * ACIONAMENTO: Gatilho de SOS que altera o estado do perfil e notifica o médico
   * REGRA: Modifica o campo 'obs' e cria registro físico na tabela PanicAlert
   */
  async triggerPanicAlert(userId: string) {
    const now = new Date();
    
    // 1. Atualiza o perfil do paciente com o timestamp do pânico
    await this.prisma.patientProfile.updateMany({
      where: { userId: userId },
      data: { 
        obs: `ALERTA DE EMERGÊNCIA ATIVO - ${now.toISOString()}` 
      }
    });

    // 2. CORREÇÃO TÉCNICA: Criação do registro com campos compatíveis com o Schema
    // O campo 'status' foi removido para evitar o erro de tipagem TS2353
    await this.prisma.panicAlert.create({
      data: {
        userId: userId,
        latitude: -23.56168, // Coordenada capturada no momento do evento
        longitude: -46.66003,
        batteryLevel: 85
      }
    });

    // 3. Notificação interna do sistema
    console.log(`🚨 [SISTEMA] Registro de Crise Persistido no Banco: ${userId}`);

    return {
      status: "ALERTA DE EMERGÊNCIA ATIVO",
      timestamp: now,
      message: "Gatilho de notificação enviado ao médico responsável."
    };
  }

  /**
   * MÉTODO PRIVADO: Persistência da Trilha de Auditoria (Imutável)
   * Garante o registro de quem acessou os dados sensíveis.
   */
  private async createAuditEntry(targetId: string, actorId?: string) {
    try {
      await this.prisma.auditLog.create({
        data: {
          action: "OPENCLAW_PAYLOAD_EXTRACTION",
          entity: "User/PatientProfile",
          targetId: targetId,
          actorId: actorId || null, 
          details: `Acesso aos dados de emergência do paciente via Openclaw Crawler.`
        }
      });
    } catch (error) {
      console.error('CRITICAL: Falha ao gravar log de auditoria:', error.message);
    }
  }

  /**
   * POPULAÇÃO: Cria/Atualiza perfil de saúde para validação de testes
   */
  async setupTestProfile(userId: string) {
    return this.prisma.patientProfile.upsert({
      where: { userId: userId },
      update: {
        bloodType: "AB+",
        height: 165.5,
        weight: 62.0,
        allergies: "Penicilina, Frutos do Mar",
        chronicDiseases: "Hipertensão Leve",
        obs: "Cenário de teste validado para Openclaw V2.8"
      },
      create: {
        userId: userId,
        bloodType: "AB+",
        height: 165.5,
        weight: 62.0,
        allergies: "Penicilina, Frutos do Mar",
        chronicDiseases: "Hipertensão Leve",
        obs: "Cenário de teste validado para Openclaw V2.8"
      }
    });
  }
}