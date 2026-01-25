// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// MÓDULO: SERVIÇO DE LOCALIZAÇÃO (CLIENTE MOBILE)
// OBJETIVO: Gerenciar permissões e enviar telemetria para o Backend
// -------------------------------------------------------------------------

import * as Location from 'expo-location';
import axios from 'axios';
import { Alert } from 'react-native';

// URL DO BACKEND (Deve ser a mesma do api.ts ou HomeScreen)
// Nota: Em produção, isso virá de uma variável de ambiente.
const API_URL = 'http://192.168.15.11:4000'; 

export const LocationService = {

  /**
   * 1. Solicita permissão de uso do GPS (Foreground)
   * Retorna true se permitido, false se negado.
   */
  requestPermissions: async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Negada',
          'O Modo Guardião precisa da sua localização para funcionar. Por favor, habilite nas configurações.'
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('[LocationService] Erro ao pedir permissão:', error);
      return false;
    }
  },

  /**
   * 2. Obtém a posição atual com precisão balanceada
   */
  getCurrentPosition: async () => {
    try {
      return await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // Balanceado para economizar bateria
      });
    } catch (error) {
      console.warn('[LocationService] Erro ao obter GPS:', error);
      return null;
    }
  },

  /**
   * 3. Envia o "Ping" para o Backend (Rota POST /location)
   */
  sendLocationLog: async (userId: string, lat: number, lng: number, battery: number = 100) => {
    try {
      if (!userId) return;

      await axios.post(`${API_URL}/location`, {
        latitude: lat,
        longitude: lng,
        batteryLevel: battery, // Futuro: integrar com expo-battery
        source: 'GPS_FOREGROUND',
        userId: userId // Backend espera isso no body por enquanto
      });
      
      // console.log(`[LocationService] Ping enviado: ${lat}, ${lng}`);
    } catch (error) {
      // Falha silenciosa para não incomodar o idoso (Retry logic fica para v2)
      console.warn('[LocationService] Falha ao enviar log:', error);
    }
  }
};