// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// MÓDULO: TELA DE EMERGÊNCIA
// VERSÃO: FUSÃO FINAL (Visual Rico + Correção de Vibração Prioritária)
// -------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  Alert, 
  Vibration 
} from 'react-native';
import * as Haptics from 'expo-haptics'; 
import { MapPin, Phone, XCircle, Siren, Heart, Signal } from 'lucide-react-native'; 
import { styles as globalStyles } from '../styles/global';
import api from '../services/api'; 

export default function PanicScreen({ navigation, route }: any) {
  const { user } = route.params || { user: { name: 'Usuário' } };
  const [status, setStatus] = useState('AGUARDANDO AÇÃO');

  useEffect(() => {
    // Vibração de entrada: alerta sensorial ao abrir a tela
    Vibration.vibrate([0, 500, 200, 500]); 
  }, []);

  const handleCancel = () => {
    Alert.alert('Cancelar', 'Deseja abortar o pedido de socorro?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim, Abortar', onPress: () => navigation.goBack() }
    ]);
  };

  const handleSOSAction = async () => {
    // --- CORREÇÃO DE PRIORIDADE: FÍSICO PRIMEIRO ---
    // O comando de vibração executa antes de qualquer lógica de React ou Rede.
    Vibration.vibrate(1000); 

    // Feedback tátil secundário
    try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (e) {
        // Ignora erro de Haptics em dispositivos não compatíveis
    }

    setStatus('CONECTANDO PROTEÇÃO...'); 

    try {
      await api.post('/sos', {
        userName: user.name,
        location: '-22.7348, -47.6476 (Piracicaba/SP)', // Simulado ou vindo do LocationService
        bpm: '82',
        battery: '85',
        connection: '4G LTE'
      });

      setStatus('PROTEÇÃO ATIVADA!'); 
      
      Alert.alert(
        'SOCORRO SOLICITADO', 
        'A Central de Monitoramento confirmou o recebimento do seu alerta.',
        [{ text: 'Entendido', onPress: () => navigation.goBack() }]
      );

    } catch (error) {
      console.log('❌ ERRO AO ENVIAR SOS:', error);
      setStatus('ERRO NO ENVIO');
      
      Alert.alert(
        'FALHA DE CONEXÃO', 
        'Não foi possível contatar a central automaticamente. Ligue para 192.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={globalStyles.container}>
      <StatusBar backgroundColor="#dc2626" barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerIconArea}>
           <Siren size={32} color="#dc2626" />
        </View>
        <Text style={styles.title}>MODO DE EMERGÊNCIA</Text>
        <Text style={styles.subtitle}>O sistema está monitorando você</Text>
      </View>

      <View style={styles.telemetryContainer}>
        
        <View style={styles.telemetryBox}>
            <Text style={styles.telemetryLabel}>BATIMENTOS</Text>
            <View style={styles.telemetryValueRow}>
                <Heart size={24} color="#dc2626" fill="#dc2626" />
                <Text style={styles.telemetryNumber}>82</Text>
                <Text style={styles.telemetryUnit}>BPM</Text>
            </View>
        </View>

        <View style={[styles.telemetryBox, { borderLeftWidth: 1, borderLeftColor: '#e5e7eb' }]}>
            <Text style={styles.telemetryLabel}>CONEXÃO</Text>
            <View style={styles.telemetryValueRow}>
                <Signal size={24} color="#16a34a" />
                <Text style={[styles.telemetryNumber, { color: '#16a34a' }]}>4G</Text>
                <Text style={styles.telemetryUnit}>LTE</Text>
            </View>
        </View>

      </View>

      <View style={styles.centerArea}>
        <TouchableOpacity 
          style={styles.sosBigButton} 
          onPress={handleSOSAction}
          activeOpacity={0.8}
        >
          <View style={styles.sosInnerCircle}>
            <Text style={styles.sosText}>SOS</Text>
            <Text style={styles.pushText}>PRESSIONE</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <MapPin size={20} color="#6b7280" />
          <Text style={styles.infoText}>Av. Paulista, 1578 - SP</Text>
        </View>
        <View style={[styles.infoRow, { marginTop: 10 }]}>
          <Phone size={20} color="#6b7280" />
          <Text style={styles.infoText}>Notificando: Dr. Silva e João</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <XCircle size={24} color="#dc2626" style={{ marginRight: 10 }} />
          <Text style={styles.cancelText}>CANCELAR OPERAÇÃO</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  headerIconArea: {
    padding: 10,
    backgroundColor: '#fef2f2',
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#dc2626',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  telemetryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    marginHorizontal: 40,
    backgroundColor: '#f9fafb', 
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  telemetryBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  telemetryLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  telemetryValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  telemetryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 6,
    lineHeight: 28,
  },
  telemetryUnit: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: 'bold',
    marginLeft: 4,
    marginBottom: 4,
  },
  centerArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  sosBigButton: {
    width: 180, 
    height: 180,
    borderRadius: 90,
    backgroundColor: '#fca5a5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  sosInnerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  sosText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pushText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 0,
  },
  statusText: {
    marginTop: 15,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc2626',
    letterSpacing: 1,
  },
  infoContainer: {
    paddingHorizontal: 50,
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 10,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#dc2626',
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  cancelText: {
    color: '#dc2626',
    fontWeight: 'bold',
    fontSize: 14,
  }
});