// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// MÓDULO: TELA PRINCIPAL (HOME)
// VERSÃO: DUAL ACTION (Chat & SOS - Botões Gêmeos Simétricos)
// -------------------------------------------------------------------------

import React, { useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, Image, StatusBar, 
  ScrollView, Alert, StyleSheet, Platform 
} from 'react-native';
// Ícones (Lucide)
import { Pill, Apple, CalendarDays, Activity, MessageCircle, AlertTriangle } from 'lucide-react-native';

// Serviços e Componentes
import LogoutButton from '../components/LogoutButton'; 
import { styles as globalStyles, COLORS } from '../styles/global';
import { StorageService } from '../services/storage';
import { LocationService } from '../services/LocationService';

export default function HomeScreen({ route, navigation }: any) {
  // Recebe dados do Login
  const { user, token } = route.params || { user: { name: 'Visitante' } };
  
  // LÓGICA 1: FILTRO INTELIGENTE DE NOME
  const formatName = (fullName: string) => {
    if (!fullName) return 'Usuário';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0]; 
    return `${parts[0]} ${parts[parts.length - 1]}`;
  };
  
  const displayName = formatName(user.name);

  // LÓGICA 2: MODO GUARDIÃO (GPS em Background)
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const initGuardianMode = async () => {
      // 1. Solicita Permissão
      const hasPermission = await LocationService.requestPermissions();
      if (!hasPermission) return;

      // 2. Função de Disparo (Ciclo de Vida)
      const performTracking = async () => {
        const location = await LocationService.getCurrentPosition();
        
        if (location && user.id) {
            // Envia para o endpoint de alta performance
            await LocationService.sendLocationLog(
                user.id, 
                location.coords.latitude, 
                location.coords.longitude
            );
        }
      };

      // Disparo Imediato + Loop de 30s
      performTracking();
      intervalId = setInterval(performTracking, 30000);
    };

    const persistUser = async () => {
      if (user && user.name !== 'Visitante') {
        // Salva ID para o Chat usar Offline/Reconnect
        await StorageService.saveUser({
          name: user.name,
          email: user.email || 'user@email.com',
          id: user.id
        });
        
        // Salva Token se existir
        if (token) await StorageService.saveToken(token);
      }
    };

    initGuardianMode();
    persistUser();

    return () => {
      if (intervalId) clearInterval(intervalId); // Limpeza de memória
    };
  }, [user]);

  // Função de Logout
  const handleLogout = () => {
    Alert.alert('Encerrar Sessão', 'Deseja realmente sair do sistema?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: async () => {
          await StorageService.clearAll(); // Limpa dados locais e token
          navigation.replace('Login');
      }}
    ]);
  };

  // --- CONFIGURAÇÃO DO MENU (GRID) ---
  // Nota: O Chat saiu do grid pois agora tem destaque no rodapé
  const menuItems = [
    { title: 'MEDICAMENTOS', icon: <Pill size={32} color="#000" strokeWidth={1.5} />, route: 'Medication' },
    { title: 'NUTRIÇÃO', icon: <Apple size={32} color="#000" strokeWidth={1.5} />, route: null }, 
    { title: 'AGENDA MÉDICA', icon: <CalendarDays size={32} color="#000" strokeWidth={1.5} />, route: null },
    { title: 'SINAIS VITAIS', icon: <Activity size={32} color="#000" strokeWidth={1.5} />, route: null },
  ];

  return (
    <View style={globalStyles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* === ÁREA 1: CABEÇALHO FIXO === */}
      <View style={styles.headerTop}>
        <View style={{ flex: 1, marginRight: 10 }}> 
          <Text style={styles.welcomeLabel}>Bem-vindo(a),</Text>
          <Text style={styles.userName} numberOfLines={1}>
            {displayName}
          </Text>
        </View>
        <View style={{ marginBottom: 2 }}> 
            <LogoutButton onPress={handleLogout} />
        </View>
      </View>

      {/* === ÁREA 2: CONTEÚDO (GRID) === */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* BRANDING (PADRÃO UNIVERSAL 120px) */}
        <View style={styles.brandingContainer}>
          <Image 
            source={require('../../assets/LogoApp.png')} 
            style={styles.universalLogo} 
          />
          <View style={styles.divider} />
        </View>

        {/* GRID DE BOTÕES */}
        <View style={styles.gridContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.cardTech}
              onPress={() => item.route ? navigation.navigate(item.route, { user, token }) : Alert.alert('Em Breve', 'Módulo em desenvolvimento.')}
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

      {/* === ÁREA 3: RODAPÉ DE AÇÃO DUPLA (CHAT + SOS) === */}
      {/* Botões Gêmeos: Mesma altura, mesma largura, simetria total */}
      <View style={styles.twinFooter}>
        
        {/* BOTÃO 1: CHAT (Azul - Enter) */}
        <TouchableOpacity 
          style={[styles.twinButton, { backgroundColor: COLORS.primary }]}
          onPress={() => navigation.navigate('Chat', { user, token })}
          activeOpacity={0.8}
        >
          <MessageCircle color="#FFF" size={28} style={{ marginRight: 8 }} />
          <Text style={styles.twinButtonText}>CHAT</Text>
        </TouchableOpacity>

        <View style={{ width: 15 }} /> {/* Espaçamento Central */}

        {/* BOTÃO 2: SOS (Vermelho - Alerta) */}
        <TouchableOpacity 
          style={[styles.twinButton, { backgroundColor: COLORS.danger }]}
          onPress={() => navigation.navigate('Panic', { user, token })}
          activeOpacity={0.8}
        >
          <AlertTriangle color="#FFF" size={28} style={{ marginRight: 8 }} />
          <Text style={styles.twinButtonText}>SOS</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', 
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'android' ? 50 : 60, 
    paddingBottom: 10, 
    backgroundColor: '#f8fafc',
  },
  welcomeLabel: { fontSize: 14, color: '#6b7280', marginBottom: 0, fontWeight: '500' },
  userName: { fontSize: 18, color: '#000000', fontWeight: 'bold', textTransform: 'capitalize', lineHeight: 24 },
  
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 160, // Margem extra para o rodapé não cobrir o conteúdo
  },
  brandingContainer: { alignItems: 'center', marginTop: 10, marginBottom: 30 },
  universalLogo: { width: 120, height: 120, resizeMode: 'contain' },
  divider: { width: 40, height: 3, backgroundColor: '#000000', marginTop: 15, borderRadius: 2 },
  
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
  iconContainer: { marginBottom: 10, padding: 10, backgroundColor: '#f3f4f6', borderRadius: 50 },
  cardTitle: { fontSize: 12, fontWeight: 'bold', color: '#1f2937', textAlign: 'center', letterSpacing: 0.5 },
  
  // --- ESTILOS DOS BOTÕES GÊMEOS (SIMETRIA) ---
  twinFooter: {
    position: 'absolute',
    bottom: 30,
    left: 25,
    right: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 70, // Altura robusta e igual para ambos
  },
  twinButton: {
    flex: 1, // 50% do espaço para cada
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16, // Layout moderno
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  twinButtonText: {
    color: '#FFFFFF',
    fontWeight: '900', // Fonte grossa (Bold)
    fontSize: 20,
    letterSpacing: 1,
  }
});