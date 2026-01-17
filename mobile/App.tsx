/*
-------------------------------------------------------------------------
PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
ARQUITETURA: MOBILE (React Native / Expo)
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
-------------------------------------------------------------------------
MÓDULO: APP ENTRY POINT (INTERFACE HÍBRIDA V2-TÁTICA)
DESCRIÇÃO: Visual Cyberpunk de Alta Fidelidade com Acionamento Rápido.
FUNCIONALIDADE: Monitoramento V2 + Botão de Pânico Instantâneo.
-------------------------------------------------------------------------
*/

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, StatusBar, Animated, Vibration } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { Heart, Activity, ShieldCheck, ShieldAlert, MapPin } from 'lucide-react-native';

// --- CONFIGURAÇÃO DE REDE ---
// ✅ IP CORRIGIDO CONFORME SEUS DADOS DE REDE
const API_URL = 'http://192.168.15.8:3000/alerts'; 

const DEVICE_USER_ID = "8264c5e8-96b5-41e1-9eff-ecc05f928cd3";

export default function App() {
  // --- ESTADOS ---
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('SISTEMA ONLINE');
  const [bpm, setBpm] = useState(72);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // --- ANIMAÇÕES ---
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // --- CICLO DE VIDA ---
  useEffect(() => {
    setupSystem();
    startHeartbeat();
  }, []);

  const setupSystem = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setStatusMsg('ERRO: GPS BLOQUEADO');
      return;
    }
    setPermissionGranted(true);
  };

  // Simulação de Batimentos (Visual V2)
  const startHeartbeat = () => {
    setInterval(() => {
      setBpm(Math.floor(Math.random() * (85 - 68 + 1) + 68));
    }, 2000);

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.delay(800)
      ])
    ).start();
  };

  // --- LÓGICA TÁTICA (TOQUE ÚNICO) ---
  const handlePanicPress = async () => {
    if (!permissionGranted) {
      Alert.alert("ERRO", "Sem GPS.");
      return;
    }

    // 1. Feedback Físico Imediato (Vibração Tática)
    Vibration.vibrate(150); 
    setLoading(true);
    setStatusMsg('⚠️ ENVIANDO EMERGÊNCIA...');

    try {
      // 2. Coleta de Dados
      let location = await Location.getCurrentPositionAsync({});
      
      const payload = {
        userId: DEVICE_USER_ID,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        batteryLevel: 15,
        resolved: false
      };

      // 3. Envio para a Torre (Com Timeout de 8s)
      await axios.post(API_URL, payload, { timeout: 8000 });
      
      // 4. Sucesso
      Vibration.vibrate([0, 200, 100, 200]); // Vibração dupla confirmando
      setStatusMsg('🚨 SOCORRO SOLICITADO');
      Alert.alert("CONFIRMADO", "A Torre recebeu seu alerta de pânico.");

    } catch (error: any) {
      console.error(error);
      let errorText = "Falha de conexão.";
      
      // Diagnóstico Inteligente de Erro
      if (error.message && error.message.includes('404')) {
        errorText = "Erro 404: Porta Errada (Backend desligado?)";
      } else if (error.message && error.message.includes('Network')) {
        errorText = "Erro de Rede: IP Inacessível";
      }

      setStatusMsg(errorText);
      Alert.alert("ERRO", errorText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* --- CABEÇALHO (ORIGINAL V2) --- */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <ShieldCheck color="#22c55e" size={20} />
          <Text style={styles.systemStatus}>SISTEMA SEGURO</Text>
        </View>
        <Text style={styles.patientName}>JOÃO DA SILVA</Text>
        <Text style={styles.idLabel}>ID: 8264...CD3</Text>
      </View>

      {/* --- MONITOR DE SINAIS VITAIS (ORIGINAL V2) --- */}
      <View style={styles.monitorContainer}>
        <View style={styles.monitorRow}>
          <View>
            <Text style={styles.monitorLabel}>BATIMENTOS</Text>
            <View style={styles.bpmContainer}>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Heart color="#ef4444" fill="#ef4444" size={32} />
              </Animated.View>
              <Text style={styles.bpmValue}>{bpm}</Text>
              <Text style={styles.bpmUnit}>BPM</Text>
            </View>
          </View>
          <View>
            <Text style={styles.monitorLabel}>CONEXÃO</Text>
            <View style={styles.statusBadge}>
              <Activity color="#22c55e" size={20} />
              <Text style={styles.statusText}>4G LTE</Text>
            </View>
          </View>
        </View>
        
        {/* Gráfico Fake */}
        <View style={styles.graphLine}>
          <View style={[styles.graphSegment, { height: 10 }]} />
          <View style={[styles.graphSegment, { height: 30 }]} />
          <View style={[styles.graphSegment, { height: 15 }]} />
          <View style={[styles.graphSegment, { height: 40, backgroundColor: '#ef4444' }]} />
          <View style={[styles.graphSegment, { height: 20 }]} />
          <View style={[styles.graphSegment, { height: 10 }]} />
        </View>
      </View>

      {/* --- BOTÃO DE AÇÃO (MODIFICADO: TOQUE IMEDIATO) --- */}
      <View style={styles.actionArea}>
        {/* Texto solicitado acima do botão */}
        <Text style={styles.emergencyLabel}>EMERGÊNCIA</Text>
        <Text style={styles.instructionText}>
          {loading ? 'ENVIANDO SINAL...' : 'TOQUE PARA ACIONAR'}
        </Text>
        
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handlePanicPress} // Acionamento direto
          disabled={loading}
        >
          {/* Visual V2 Mantido (Botão Grande Vermelho) */}
          <View style={[styles.panicButton, loading && { borderColor: '#ef4444' }]}>
            <View style={styles.innerRing}>
              {loading ? (
                <ActivityIndicator size="large" color="#FFF" />
              ) : (
                <ShieldAlert color="#FFF" size={64} />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* --- RODAPÉ (ORIGINAL V2) --- */}
      <View style={styles.footer}>
        <MapPin color="#64748b" size={16} />
        <Text style={styles.footerText}>Localização em Tempo Real Ativa</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Slate 900
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  systemStatus: {
    color: '#22c55e',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 6,
    letterSpacing: 1,
  },
  patientName: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
  },
  idLabel: {
    color: '#64748b',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  monitorContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  monitorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  monitorLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bpmContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bpmValue: {
    color: '#f8fafc',
    fontSize: 36,
    fontWeight: 'bold',
    marginHorizontal: 8,
    lineHeight: 36,
  },
  bpmUnit: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  statusText: {
    color: '#22c55e',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  graphLine: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 40,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  graphSegment: {
    width: 6,
    backgroundColor: '#334155',
    borderRadius: 2,
  },
  actionArea: {
    alignItems: 'center',
  },
  emergencyLabel: {
    color: '#ef4444',
    fontSize: 32, // Texto Grande
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 5,
  },
  instructionText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 20,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  panicButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4, // Borda V2
    borderColor: '#ef4444', // Vermelho fixo
    backgroundColor: '#dc2626', // Fundo vermelho
    elevation: 20,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  innerRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#64748b',
    marginLeft: 8,
    fontSize: 12,
  },
});