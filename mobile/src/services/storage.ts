// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// MÓDULO: MOBILE STORAGE (PERSISTÊNCIA)
// TIPO: SERVICE
// DESCRIÇÃO: Gerencia dados offline para permitir SOS sem login
// -------------------------------------------------------------------------

import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@SCV_USER_PROFILE';

export interface UserProfile {
  name: string;
  email: string;
  photoUrl?: string;
}

export const StorageService = {
  // 1. Salvar usuário após login com sucesso
  async saveUser(user: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      console.log('💾 [STORAGE] Perfil salvo localmente:', user.name);
    } catch (error) {
      console.error('❌ [STORAGE] Erro ao salvar:', error);
    }
  },

  // 2. Recuperar usuário ao abrir o app (para o botão SOS)
  async getUser(): Promise<UserProfile | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(USER_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('❌ [STORAGE] Erro ao ler:', error);
      return null;
    }
  },

  // 3. Limpar (apenas se fizer logout explícito e quiser desabilitar o SOS)
  async clearUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('❌ [STORAGE] Erro ao limpar:', error);
    }
  }
};