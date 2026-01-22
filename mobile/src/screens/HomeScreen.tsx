// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// MÓDULO: TELA PRINCIPAL (HOME)
// VERSÃO: FINAL REFINADA (Alinhamento Perfeito do Logo e Botão Sair)
// -------------------------------------------------------------------------

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, ScrollView, Alert, StyleSheet, Platform } from 'react-native';
// Ícones Técnicos
import { Pill, Apple, CalendarDays, Activity } from 'lucide-react-native';
// Lógica GPS e Rede
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

// Componentes Personalizados
import PanicButtonSmall from '../components/PanicButtonSmall';
import LogoutButton from '../components/LogoutButton'; 
import { styles as globalStyles } from '../styles/global';
import { StorageService } from '../services/storage';

// --- CONFIGURAÇÃO DE REDE (IP FIXO) ---
const API_URL = 'http://192.168.15.11:4000';

export default function HomeScreen({ route, navigation }: any) {
  // Recebe dados do Login
  const { user, token } = route.params || { user: { name: 'Visitante' } };
  
  // LÓGICA 1: FILTRO INTELIGENTE DE NOME (Primeiro + Último)
  const formatName = (fullName: string) => {
    if (!fullName) return 'Usuário';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0]; 
    return `${parts[0]} ${parts[parts.length - 1]}`;
  };
  
  const displayName = formatName(user.name);

  // LÓGICA 2: MODO GUARDIÃO (GPS Silencioso)
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const startGuardianMode = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const sendLocation = async () => {
        try {
          let loc = await Location.getCurrentPositionAsync({});
          await axios.patch(
            `${API_URL}/users/location`,
            { lat: loc.coords.latitude, lng: loc.coords.longitude },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          // Silencioso
        }
      };

      sendLocation();
      intervalId = setInterval(sendLocation, 30000);
    };

    const persistUser = async () => {
      if (user && user.name !== 'Visitante') {
        await StorageService.saveUser({
          name: user.name,
          email: user.email || 'user@email.com',
        });
      }
    };

    startGuardianMode();
    persistUser();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user, token]);

  // Função de Logout
  const handleLogout = () => {
    Alert.alert('Encerrar Sessão', 'Deseja realmente sair do sistema?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => navigation.replace('Login') }
    ]);
  };

  const menuItems = [
    { title: 'MEDICAMENTOS', icon: <Pill size={32} color="#000" strokeWidth={1.5} />, route: 'Medication' },
    { title: 'NUTRIÇÃO', icon: <Apple size={32} color="#000" strokeWidth={1.5} />, route: null }, 
    { title: 'AGENDA MÉDICA', icon: <CalendarDays size={32} color="#000" strokeWidth={1.5} />, route: null },
    { title: 'SINAIS VITAIS', icon: <Activity size={32} color="#000" strokeWidth={1.5} />, route: null },
  ];

  return (
    <View style={globalStyles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* === ÁREA 1: CABEÇALHO FIXO (TOPO ABSOLUTO) === */}
      <View style={styles.headerTop}>
        
        {/* Bloco de Boas-vindas */}
        <View style={{ flex: 1, marginRight: 10 }}> 
          <Text style={styles.welcomeLabel}>Bem-vindo(a),</Text>
          <Text style={styles.userName} numberOfLines={1}>
            {displayName}
          </Text>
        </View>
        
        {/* Botão Sair (Alinhado na base do nome) */}
        <View style={{ marginBottom: 2 }}> 
            <LogoutButton onPress={handleLogout} />
        </View>
      </View>

      {/* === ÁREA 2: CONTEÚDO ROLÁVEL === */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* BRANDING (Ajustado para não cortar) */}
        <View style={styles.brandingContainer}>
          <Image 
            source={require('../../assets/LogoAppGeral.png')} 
            style={styles.logoGeral} 
          />
          <Text style={styles.appTitle}>Saúde Ciclo da Vida</Text>
          <View style={styles.divider} />
        </View>

        {/* GRID DE BOTÕES */}
        <View style={styles.gridContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.cardTech}
              onPress={() => item.route && navigation.navigate(item.route, { user, token })}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                {item.icon}
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* === BOTÃO PÂNICO (RODAPÉ) === */}
      <PanicButtonSmall 
        onPress={() => navigation.navigate('Panic', { user, token })} 
        disabled={false} 
      />
    </View>
  );
}

// --- ESTILOS DEFINITIVOS ---
const styles = StyleSheet.create({
  // Cabeçalho Fixo no Topo
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', // Alinha na base
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'android' ? 50 : 60, 
    paddingBottom: 0, 
    backgroundColor: '#f8fafc',
  },
  welcomeLabel: {
    fontSize: 14,
    color: '#6b7280', 
    marginBottom: 0, 
    fontWeight: '500',
  },
  userName: {
    fontSize: 18, 
    color: '#000000',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    lineHeight: 24, 
  },

  // Área de Conteúdo
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 120, 
  },
  
  // Área da Marca (Ajuste Fino)
  brandingContainer: {
    alignItems: 'center',
    // AJUSTE FINAL: Margem positiva pequena para dar respiro sem descer muito
    marginTop: 5, 
    marginBottom: 30, 
  },
  logoGeral: {
    width: 170,  
    height: 100, 
    resizeMode: 'contain',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginTop: 5,
    letterSpacing: 0.5,
  },
  divider: {
    width: 40,
    height: 3,
    backgroundColor: '#000000',
    marginTop: 15, 
    borderRadius: 2,
  },

  // Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardTech: {
    backgroundColor: '#FFFFFF',
    width: '48%', 
    aspectRatio: 1.1, 
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  iconContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f3f4f6', 
    borderRadius: 50,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    letterSpacing: 0.5,
  }
});