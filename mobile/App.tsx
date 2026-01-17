/**
 * -------------------------------------------------------------------------
 * PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
 * ARQUITETURA: MOBILE (React Native / Expo)
 * GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
 * -------------------------------------------------------------------------
 * MÓDULO: APP ENTRY POINT (CLIENTE PACIENTE)
 * DESCRIÇÃO: Interface principal do dispositivo do paciente.
 * FUNCIONALIDADE: Botão de Pânico com envio de Geolocalização (GPS).
 * INTEGRAÇÃO: Consome API Backend na rota /alerts.
 * -------------------------------------------------------------------------
 * DATA DE REVISÃO: 17/01/2026
 * AUTOR: CyberTreinaIA & Arquiteto Líder
 * -------------------------------------------------------------------------
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, StatusBar } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

// --- CONSTANTES DE CONFIGURAÇÃO ---

// ⚠️ IMPORTANTE: O emulador/celular não entende 'localhost'.
// Use o IP da sua máquina (Ex: 192.168.15.8).
// Execute 'ipconfig' no terminal para descobrir.
const API_URL = 'http://192.168.15.8:3000/alerts';

// ID do Usuário "João da Silva" (Fixo para simulação do dispositivo físico)
const DEVICE_USER_ID = "8264c5e8-96b5-41e1-9eff-ecc05f928cd3";

export default function App() {
  // --- ESTADOS DA APLICAÇÃO ---
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Sistema de Monitoramento Ativo');
  const [permissionGranted, setPermissionGranted] = useState(false);

  // --- CICLO DE VIDA: INICIALIZAÇÃO ---
  useEffect(() => {
    (async () => {
      // Solicita permissão de uso do GPS
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setStatusMsg('ERRO CRÍTICO: Permissão de GPS negada.');
        return;
      }
      setPermissionGranted(true);
    })();
  }, []);

  // --- FUNÇÃO: DISPARAR ALERTA DE PÂNICO ---
  const sendPanicAlert = async () => {
    if (!permissionGranted) {
      Alert.alert("ERRO", "Sem permissão de GPS.");
      return;
    }

    setLoading(true);
    setStatusMsg('Obtendo coordenadas de satélite...');

    try {
      // 1. Obtém Lat/Long atual com alta precisão
      let location = await Location.getCurrentPositionAsync({});
      
      // 2. Monta o Payload (Pacote de Dados)
      const payload = {
        userId: DEVICE_USER_ID,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        batteryLevel: 15, // Simulação de leitura de hardware
        resolved: false
      };

      setStatusMsg('Enviando pacote de emergência...');
      
      // 3. Envia para o Backend (Torre de Controle)
      // O timeout evita que o app fique travado se a rede cair
      await axios.post(API_URL, payload, { timeout: 5000 });

      // 4. Feedback de Sucesso
      Alert.alert("ALERTA ENVIADO", "A Torre de Controle recebeu seu pedido de socorro.");
      setStatusMsg('SOCORRO SOLICITADO COM SUCESSO');

    } catch (error) {
      console.error("Falha no envio:", error);
      Alert.alert("FALHA DE CONEXÃO", "Não foi possível contatar a Torre. Verifique sua internet ou o IP configurado.");
      setStatusMsg('Falha na comunicação.');
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERIZAÇÃO DA INTERFACE (UI) ---
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>SOS VIDA</Text>
        <Text style={styles.patientName}>ID: João da Silva</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>MONITORAMENTO ONLINE</Text>
        </View>
      </View>

      {/* ÁREA CENTRAL (BOTÃO) */}
      <View style={styles.centerAction}>
        <TouchableOpacity 
          style={styles.panicButton} 
          onPress={sendPanicAlert}
          activeOpacity={0.7}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#FFF" />
          ) : (
            <View style={styles.buttonContent}>
              <Text style={styles.sosText}>SOS</Text>
              <Text style={styles.pressText}>PRESSIONAR</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* RODAPÉ (STATUS) */}
      <View style={styles.footer}>
        <Text style={styles.statusLabel}>STATUS DO SISTEMA:</Text>
        <Text style={[
          styles.statusText, 
          statusMsg.includes('ERRO') || statusMsg.includes('Falha') ? styles.textError : styles.textOk
        ]}>
          {statusMsg}
        </Text>
      </View>
    </View>
  );
}

// --- FOLHA DE ESTILOS (STYLESHEET) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Slate 900 (Dark)
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#f87171', // Red 400
    letterSpacing: 2,
  },
  patientName: {
    color: '#94a3b8', // Slate 400
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'monospace', // Estilo técnico
  },
  badge: {
    marginTop: 10,
    backgroundColor: '#064e3b', // Green 900
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#34d399', // Green 400
  },
  badgeText: {
    color: '#34d399',
    fontSize: 10,
    fontWeight: 'bold',
  },
  centerAction: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  panicButton: {
    width: 220,
    height: 220,
    backgroundColor: '#dc2626', // Red 600
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: '#7f1d1d', // Red 900
    elevation: 20, // Sombra Android
    shadowColor: '#ef4444', // Sombra iOS
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  buttonContent: {
    alignItems: 'center',
  },
  sosText: {
    fontSize: 56,
    fontWeight: '900',
    color: '#ffffff',
  },
  pressText: {
    fontSize: 12,
    color: '#fca5a5', // Red 300
    marginTop: -5,
  },
  footer: {
    width: '100%',
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  statusLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  textOk: {
    color: '#cbd5e1', // Slate 300
  },
  textError: {
    color: '#f87171', // Red 400
    fontWeight: 'bold',
  },
});