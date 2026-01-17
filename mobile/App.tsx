/*
-------------------------------------------------------------------------
PROJETO: SAÚDE CICLO DA VIDA
VERSÃO: V5.1 - GOLD (VISUAL V2 + LOGIN + BOTÃO SAIR COM TEXTO)
DESCRIÇÃO: Ajuste final de UI no botão de logout.
-------------------------------------------------------------------------
*/

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, StatusBar, Animated, Vibration, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { Heart, Activity, ShieldCheck, ShieldAlert, MapPin, User, KeyRound, LogIn, LogOut } from 'lucide-react-native';

// --- CONFIGURAÇÃO ---
const BASE_URL = 'http://192.168.15.8:3000'; 
const API_ALERTS = `${BASE_URL}/alerts`;
const API_LOGIN = `${BASE_URL}/auth/login`;
const DEVICE_USER_ID = "8264c5e8-96b5-41e1-9eff-ecc05f928cd3";

export default function App() {
  const [authToken, setAuthToken] = useState<string | null>(null);

  // 1. A LÓGICA DE PROTEÇÃO (LOGIN)
  if (!authToken) {
    return <LoginScreen onLoginSuccess={(token) => setAuthToken(token)} />;
  }

  // 2. SE PASSOU, MOSTRA O VISUAL DA IMAGEM 03
  return <PanicScreen authToken={authToken} onLogout={() => setAuthToken(null)} />;
}

// =====================================================================
// TELA DE LOGIN (MANTIDA IGUAL)
// =====================================================================
function LoginScreen({ onLoginSuccess }: { onLoginSuccess: (token: string) => void }) {
  const [email, setEmail] = useState('joao@teste.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(API_LOGIN, { email, password }, { timeout: 5000 });
      Vibration.vibrate(50);
      onLoginSuccess(response.data.access_token);
    } catch (error) {
      Alert.alert("ERRO", "Login falhou. Verifique IP e Backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.loginContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <View style={{alignItems: 'center', marginBottom: 50}}>
        <ShieldCheck color="#22c55e" size={80} />
        <Text style={styles.appTitle}>SAÚDE CICLO DA VIDA</Text>
      </View>
      
      <View style={styles.inputGroup}>
        <User color="#ccc" size={20} style={{marginRight: 10}}/>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="E-mail" placeholderTextColor="#666"/>
      </View>
      <View style={styles.inputGroup}>
        <KeyRound color="#ccc" size={20} style={{marginRight: 10}}/>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Senha" placeholderTextColor="#666"/>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF"/> : <Text style={styles.loginButtonText}>ENTRAR</Text>}
      </TouchableOpacity>
    </View>
  );
}

// =====================================================================
// TELA DE PÂNICO (VISUAL V2 + BOTÃO SAIR COM TEXTO)
// =====================================================================
function PanicScreen({ authToken, onLogout }: { authToken: string, onLogout: () => void }) {
  const [loading, setLoading] = useState(false);
  const [bpm, setBpm] = useState(72);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Location.requestForegroundPermissionsAsync();
    const interval = setInterval(() => setBpm(Math.floor(Math.random() * (85 - 68 + 1) + 68)), 2000);
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.delay(800)
    ])).start();
    return () => clearInterval(interval);
  }, []);

  const handlePanic = async () => {
    setLoading(true);
    Vibration.vibrate(100);
    try {
      let loc = await Location.getCurrentPositionAsync({});
      await axios.post(API_ALERTS, { userId: DEVICE_USER_ID, latitude: loc.coords.latitude, longitude: loc.coords.longitude, resolved: false }, { headers: { Authorization: `Bearer ${authToken}` }, timeout: 8000 });
      Alert.alert("SUCESSO", "Alerta Recebido na Torre.");
      Vibration.vibrate([0, 200, 100, 200]);
    } catch (e) { Alert.alert("ERRO", "Falha de conexão."); } 
    finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <ShieldCheck color="#22c55e" size={20} />
          <Text style={styles.systemStatus}>SISTEMA SEGURO</Text>
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <View>
                <Text style={styles.patientName}>JOÃO DA SILVA</Text>
                <Text style={styles.idLabel}>ID: 8264...CD3</Text>
            </View>
            
            {/* --- A ÚNICA MUDANÇA: BOTÃO SAIR COM TEXTO --- */}
            <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
                <LogOut color="#ef4444" size={18} />
                <Text style={styles.logoutText}>SAIR</Text>
            </TouchableOpacity>
            {/* --------------------------------------------- */}
        </View>
      </View>

      {/* MONITOR (MANTIDO) */}
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
        <View style={styles.graphLine}>
          <View style={[styles.graphSegment, { height: 10 }]} />
          <View style={[styles.graphSegment, { height: 30 }]} />
          <View style={[styles.graphSegment, { height: 15 }]} />
          <View style={[styles.graphSegment, { height: 40, backgroundColor: '#ef4444' }]} />
          <View style={[styles.graphSegment, { height: 20 }]} />
          <View style={[styles.graphSegment, { height: 10 }]} />
        </View>
      </View>

      {/* BOTÃO PÂNICO (MANTIDO) */}
      <View style={styles.actionArea}>
        <Text style={styles.emergencyLabel}>EMERGÊNCIA</Text>
        <Text style={styles.instructionText}>TOQUE PARA ACIONAR</Text>
        
        <TouchableOpacity activeOpacity={0.7} onPress={handlePanic} disabled={loading}>
          <View style={[styles.panicButton, loading && { borderColor: '#ef4444' }]}>
            <View style={styles.innerRing}>
              {loading ? <ActivityIndicator size="large" color="#FFF" /> : <ShieldAlert color="#FFF" size={64} />}
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <MapPin color="#64748b" size={16} />
        <Text style={styles.footerText}>Localização em Tempo Real Ativa</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 24, justifyContent: 'space-between' },
  
  // LOGIN
  loginContainer: { flex: 1, backgroundColor: '#0f172a', padding: 30, justifyContent: 'center' },
  appTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginTop: 20 },
  inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 8, padding: 15, marginBottom: 15, borderWidth:1, borderColor:'#333' },
  input: { flex: 1, color: '#FFF' },
  loginButton: { backgroundColor: '#2563eb', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  loginButtonText: { color: '#FFF', fontWeight: 'bold' },

  // HEADER V2
  header: { marginTop: 20, borderBottomWidth: 1, borderBottomColor: '#1e293b', paddingBottom: 20 },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: 'rgba(34, 197, 94, 0.1)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  systemStatus: { color: '#22c55e', fontWeight: 'bold', fontSize: 12, marginLeft: 6, letterSpacing: 1 },
  patientName: { color: '#f8fafc', fontSize: 28, fontWeight: '900', letterSpacing: 1 },
  idLabel: { color: '#64748b', fontSize: 12, fontFamily: 'monospace' },

  // NOVO ESTILO DO BOTÃO SAIR
  logoutButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(239, 68, 68, 0.1)', // Fundo vermelho bem suave
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6 // Espaço entre ícone e texto
  },

  // MONITOR V2
  monitorContainer: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#334155' },
  monitorRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  monitorLabel: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  bpmContainer: { flexDirection: 'row', alignItems: 'flex-end' },
  bpmValue: { color: '#f8fafc', fontSize: 36, fontWeight: 'bold', marginHorizontal: 8, lineHeight: 36 },
  bpmUnit: { color: '#ef4444', fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#22c55e' },
  statusText: { color: '#22c55e', fontWeight: 'bold', marginLeft: 8 },
  graphLine: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 40, marginTop: 10, paddingHorizontal: 10 },
  graphSegment: { width: 6, backgroundColor: '#334155', borderRadius: 2 },

  // BOTÃO PÂNICO V2
  actionArea: { alignItems: 'center' },
  emergencyLabel: { color: '#ef4444', fontSize: 32, fontWeight: '900', letterSpacing: 2, marginBottom: 5 },
  instructionText: { color: '#cbd5e1', fontSize: 14, fontWeight: '600', marginBottom: 20, letterSpacing: 2, textTransform: 'uppercase' },
  panicButton: { width: 200, height: 200, borderRadius: 100, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#ef4444', backgroundColor: '#dc2626', elevation: 20, shadowColor: '#ef4444', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20 },
  innerRing: { width: 160, height: 160, borderRadius: 80, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', justifyContent: 'center', alignItems: 'center' },
  
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: '#64748b', marginLeft: 8, fontSize: 12 },
});