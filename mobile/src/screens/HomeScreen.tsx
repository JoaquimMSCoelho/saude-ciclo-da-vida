// -------------------------------------------------------------------------
// TELA: HOME (VERSÃO FINAL - LOGO GERAL + NOME USUÁRIO ESQUERDA)
// -------------------------------------------------------------------------
import React from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, ScrollView, Alert, StyleSheet } from 'react-native';
import { LogOut } from 'lucide-react-native'; 
import PanicButtonSmall from '../components/PanicButtonSmall';
import { styles as globalStyles, COLORS } from '../styles/global';

export default function HomeScreen({ route, navigation }: any) {
  const { user, token } = route.params || { user: { name: 'Visitante' } };
  const firstName = user.name ? user.name.split(' ')[0] : 'Usuário';

  const handleLogout = () => {
    Alert.alert('Sair', 'Encerrar sessão?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim, Sair', style: 'destructive', onPress: () => navigation.replace('Login') }
    ]);
  };

  const menuItems = [
    { title: 'Medicamentos', icon: '💊', route: 'Medication' },
    { title: 'Plano Alimentar', icon: '🍎', route: null }, 
    { title: 'Agenda Médica', icon: '📅', route: null },
    { title: 'Dados Vitais', icon: '❤️', route: null },
  ];

  return (
    <View style={globalStyles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* 1. HEADER (Nome na esquerda, Sair discreto) */}
      <View style={styles.headerTop}>
        <Text style={styles.greetingText}>Olá, {firstName}</Text>
        
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LogOut size={20} color="#dc2626" />
          <Text style={styles.logoutText}>SAIR</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0 }}>
        
        {/* 2. ÁREA DA MARCA (Logo Geral + Texto) */}
        <View style={styles.brandArea}>
          <Image 
            source={require('../../assets/LogoAppGeral.png')} 
            style={styles.logoGeral} // W:100, H:100
          />
          <Text style={styles.appTitle}>Saúde Ciclo da Vida</Text>
        </View>

        {/* 3. GRID DE MENU */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 30 }}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={globalStyles.cardFigma}
              onPress={() => item.route && navigation.navigate(item.route, { user, token })}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 32, marginBottom: 10 }}>{item.icon}</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#000', textAlign: 'center' }}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* 4. BOTÃO SOS (Fixo no Rodapé) */}
      <PanicButtonSmall 
        onPress={() => navigation.navigate('Panic', { user, token })} 
        disabled={false} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20, // Distância do topo
  },
  greetingText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    padding: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#dc2626',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 5,
  },
  brandArea: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  logoGeral: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 15,
  }
});