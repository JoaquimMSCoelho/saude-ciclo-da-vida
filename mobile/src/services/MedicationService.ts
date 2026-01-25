// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// MÓDULO: MEDICATION SERVICE (OFFLINE FIRST)
// VERSÃO: FUSÃO FINAL (Visual + Lógica de Negócio)
// -------------------------------------------------------------------------

import api from './api'; // Importação Default para compatibilidade com Axios
import { StorageService } from './storage'; 
import { Alert } from 'react-native';

const CACHE_KEY = '@medications_data';

// INTERFACE HÍBRIDA (Une a UI com o Banco de Dados)
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  // Campos Visuais (Obrigatórios para o Loop da Tela)
  schedules: { 
    time: string; 
    instructions: string; 
  }[];
  // Campos de Negócio (Preservados para lógica futura)
  frequency?: string; 
  stock?: number;
  nextDose?: string;
}

export const MedicationService = {
  
  /**
   * 1. BUSCA INTELIGENTE (Stale-While-Revalidate)
   * Estratégia: Tenta rede (rápido). Se falhar, entrega cache. 
   * Se rede funcionar, atualiza cache silenciosamente.
   */
  getAll: async (userId: string): Promise<{ data: Medication[], source: 'API' | 'CACHE' }> => {
    try {
      // A. Tenta conexão com a API (Prioridade: Dados Frescos)
      // Timeout de 4s garante que o app não trava esperando sinal ruim
      const response = await api.get(`/users/${userId}/medications`, { timeout: 4000 });
      
      if (response.data) {
        // Sucesso: Atualiza o banco local (Cache) para uso futuro
        await StorageService.saveItem(CACHE_KEY, response.data);
        return { data: response.data, source: 'API' };
      }
    } catch (error) {
      // Falha silenciosa: Apenas loga e passa para o plano B
      console.log('[MedicationService] Rede indisponível. Ativando protocolo Offline...');
    }

    // B. Fallback: Recuperação do Disco Local (Modo Avião)
    const cachedData = await StorageService.getItem(CACHE_KEY);
    
    if (cachedData) {
      return { data: cachedData, source: 'CACHE' };
    }

    // C. Cold Start: Sem rede e sem cache (Primeiro uso)
    return { data: [], source: 'API' };
  }
};