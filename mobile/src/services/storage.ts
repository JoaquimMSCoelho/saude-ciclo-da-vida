// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// MÓDULO: STORAGE SERVICE (PERSISTÊNCIA HÍBRIDA)
// OBJETIVO: Compatibilidade Legada + Suporte a Novos Módulos Offline
// -------------------------------------------------------------------------

import AsyncStorage from '@react-native-async-storage/async-storage';

// CHAVES DE ACESSO (MANTIDAS ORIGINAIS PARA NÃO QUEBRAR LOGIN EXISTENTE)
const KEYS = {
  USER: '@SCV_USER_PROFILE',  // Chave original do seu código (NÃO ALTERAR)
  TOKEN: '@SCV_AUTH_TOKEN',   // Nova chave para autenticação API
};

// Interface original mantida para tipagem estrita no Login
export interface UserProfile {
  name: string;
  email: string;
  photoUrl?: string;
  id?: string; // Adicionado opcional para garantir compatibilidade com API
}

export const StorageService = {
  
  // =========================================================================
  // 1. MOTOR GENÉRICO (CORE DO SISTEMA OFFLINE)
  // Necessário para MedicationService, LocationService e Cache Geral
  // =========================================================================

  /**
   * Salva qualquer objeto no banco local convertido em string JSON
   */
  saveItem: async (key: string, value: any): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      // console.log(`💾 [STORAGE] Salvo: ${key}`);
    } catch (error) {
      console.error(`❌ [STORAGE] Erro ao salvar chave ${key}:`, error);
    }
  },

  /**
   * Recupera e converte qualquer objeto do banco local
   */
  getItem: async <T>(key: string): Promise<T | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`❌ [STORAGE] Erro ao ler chave ${key}:`, error);
      return null;
    }
  },

  /**
   * Remove um item específico
   */
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`❌ [STORAGE] Erro ao remover chave ${key}:`, error);
    }
  },

  // =========================================================================
  // 2. MÉTODOS DE NEGÓCIO (WRAPPERS DE COMPATIBILIDADE)
  // Usam o Motor Genérico mas apontam para as chaves antigas corretas
  // =========================================================================

  // Mantém a assinatura original saveUser(user: UserProfile)
  saveUser: async (user: UserProfile) => {
    await StorageService.saveItem(KEYS.USER, user);
    console.log('💾 [STORAGE] Perfil salvo (Legacy Key):', user.name);
  },

  // Mantém a assinatura original getUser()
  getUser: async (): Promise<UserProfile | null> => {
    return await StorageService.getItem<UserProfile>(KEYS.USER);
  },

  // Limpeza específica do usuário (Para o botão Sair)
  clearUser: async () => {
    await StorageService.removeItem(KEYS.USER);
  },

  // --- NOVOS MÉTODOS PARA API (TOKEN) ---
  
  saveToken: async (token: string) => {
    await StorageService.saveItem(KEYS.TOKEN, token);
  },

  getToken: async () => {
    return await StorageService.getItem<string>(KEYS.TOKEN);
  },

  /**
   * Limpeza Total (Hard Reset)
   */
  clearAll: async () => {
    try {
      await AsyncStorage.clear();
      console.log('🧹 [STORAGE] Limpeza completa realizada.');
    } catch (error) {
      console.error('❌ [STORAGE] Erro ao limpar tudo:', error);
    }
  }
};