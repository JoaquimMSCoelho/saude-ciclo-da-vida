// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// MÓDULO: TELA PRINCIPAL (HOME)
// VERSÃO: DOCK TRIPLO (Localização | Chat | SOS) - 60x60px Simétrico
// -------------------------------------------------------------------------

import React, { useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, Image, StatusBar, 
  ScrollView, Alert, StyleSheet, Platform 
} from 'react-native';
import { Pill, Apple, CalendarDays, Activity, MessageCircle, AlertTriangle, MapPin } from 'lucide-react-native';

import LogoutButton from '../components/LogoutButton'; 
import { styles as globalStyles, COLORS } from '../styles/global';
import { StorageService } from '../services/storage';
import { LocationService } from '../services/LocationService';

export default function HomeScreen({ route, navigation }: any) {
  const { user, token } = route.params || { user: { name: 'Visitante' } };
  
  const formatName = (fullName: string) => {
    if (!fullName) return 'Usuário';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0]; 
    return `${parts[0]} ${parts[parts.length - 1]}`;
  };
  
  const displayName = formatName(user.name);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const initGuardianMode = async () => {
      const hasPermission = await LocationService.requestPermissions();
      if (!hasPermission) return;

      const performTracking = async () => {
        const location = await LocationService.getCurrentPosition();
        
        if (location && user.id) {
            await LocationService.sendLocationLog(
                user.id, 
                location.coords.latitude, 
                location.coords.longitude
            );
        }
      };

      performTracking();
      intervalId = setInterval(performTracking, 30000);
    };

    const persistUser = async () => {
      if (user && user.name !== 'Visitante') {
        await StorageService.saveUser({
          name: user.name,
          email: user.email || 'user@email.com',
          id: user.id
        });
        
        if (token) await StorageService.saveToken(token);
      }
    };

    initGuardianMode();
    persistUser();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user]);

  const handleLogout = () => {
    Alert.alert('Encerrar Sessão', 'Deseja realmente sair do sistema?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: async () => {
          await StorageService.clearAll();
          navigation.replace('Login');
      }}
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
      
      <View style={styles.headerTop}>
        <View style={{ flex: 1, marginRight: 10 }}> 
          <Text style={styles.welcomeLabel}>Bem-vindo(a),</Text>
          <Text style={styles.userName} numberOfLines={1}>{displayName}</Text>
        </View>
        <View style={{ marginBottom: 2 }}> 
            <LogoutButton onPress={handleLogout} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.brandingContainer}>
          <Image 
            source={require('../../assets/LogoApp.png')} 
            style={styles.universalLogo} 
          />
          <View style={styles.divider} />
        </View>

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

      <View style={styles.navigationDock}>
        
        <TouchableOpacity 
          style={[styles.dockButton, { backgroundColor: '#374151' }]}
          onPress={() => Alert.alert('Localização', 'Visualização de Mapa em Breve')}
          activeOpacity={0.8}
        >
          <MapPin color="#FFF" size={28} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.dockButton, { backgroundColor: COLORS.primary }]}
          onPress={() => navigation.navigate('Chat', { user, token })}
          activeOpacity={0.8}
        >
          <MessageCircle color="#FFF" size={28} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.dockButton, { backgroundColor: COLORS.danger }]}
          onPress={() => navigation.navigate('Panic', { user, token })}
          activeOpacity={0.8}
        >
          <AlertTriangle color="#FFF" size={28} />
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
    paddingBottom: 160, 
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
  
  navigationDock: {
    position: 'absolute',
    bottom: 30, 
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    height: 70, 
  },
  
  dockButton: {
    width: 60,
    height: 60,
    borderRadius: 30, 
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  }
});