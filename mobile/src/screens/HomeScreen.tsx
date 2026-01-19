// -------------------------------------------------------------------------
// TELA: HOME / DASHBOARD
// VERSÃO: FINAL ENTERPRISE (PGT-01)
// CHECKLIST:
// [x] Nome Completo (Sem split)
// [x] Botão Sair Padronizado (Componente Externo)
// [x] Margens de Segurança (Topo e Rodapé)
// [x] Ícones Técnicos (Lucide)
// [x] Logo Geral (Gota) + Texto "Saúde Ciclo da Vida"
// -------------------------------------------------------------------------

import React from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, ScrollView, Alert, StyleSheet, Platform } from 'react-native';
// Ícones Técnicos
import { Pill, Apple, CalendarDays, Activity } from 'lucide-react-native';

// Componentes Personalizados
import PanicButtonSmall from '../components/PanicButtonSmall';
import LogoutButton from '../components/LogoutButton'; 
import { styles as globalStyles } from '../styles/global';

export default function HomeScreen({ route, navigation }: any) {
  // Recebe dados do Login (ou define padrão Visitante)
  const { user, token } = route.params || { user: { name: 'Visitante' } };
  
  // LÓGICA 1: Nome Completo (Prioridade para o nome vindo do banco)
  const fullName = user.name || 'Usuário'; 

  // Função de Logout com confirmação
  const handleLogout = () => {
    Alert.alert('Encerrar Sessão', 'Deseja realmente sair do sistema?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => navigation.replace('Login') }
    ]);
  };

  // Menu de Navegação (Ícones Técnicos)
  const menuItems = [
    { 
      title: 'MEDICAMENTOS', 
      icon: <Pill size={32} color="#000" strokeWidth={1.5} />, 
      route: 'Medication' 
    },
    { 
      title: 'NUTRIÇÃO', 
      icon: <Apple size={32} color="#000" strokeWidth={1.5} />, 
      route: null 
    }, 
    { 
      title: 'AGENDA MÉDICA', 
      icon: <CalendarDays size={32} color="#000" strokeWidth={1.5} />, 
      route: null 
    },
    { 
      title: 'SINAIS VITAIS', 
      icon: <Activity size={32} color="#000" strokeWidth={1.5} />, 
      route: null 
    },
  ];

  return (
    <View style={globalStyles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* --- ÁREA DO CABEÇALHO (SAFE AREA) --- */}
      <View style={styles.headerTop}>
        
        {/* Bloco de Boas-vindas */}
        <View style={{ flex: 1, marginRight: 10 }}> 
          <Text style={styles.welcomeLabel}>Bem-vindo,</Text>
          {/* numberOfLines garante que nomes gigantes não quebrem o layout */}
          <Text style={styles.userName} numberOfLines={2}>
            {fullName}
          </Text>
        </View>
        
        {/* Bloco do Botão Sair (Alinhado à direita) */}
        <View>
            <LogoutButton onPress={handleLogout} />
        </View>
      </View>

      {/* --- CONTEÚDO COM SCROLL --- */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* ÁREA DA MARCA (Logo + Texto) */}
        <View style={styles.brandArea}>
          <Image 
            source={require('../../assets/LogoAppGeral.png')} 
            style={styles.logoGeral} 
          />
          <Text style={styles.appTitle}>Saúde Ciclo da Vida</Text>
          {/* Divisor estético minimalista */}
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

      {/* --- BOTÃO PÂNICO (FIXO NO RODAPÉ) --- */}
      <PanicButtonSmall 
        onPress={() => navigation.navigate('Panic', { user, token })} 
        disabled={false} 
      />
    </View>
  );
}

// --- FOLHA DE ESTILOS DA HOME ---
const styles = StyleSheet.create({
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Alinhamento no topo para suportar 2 linhas de nome
    paddingHorizontal: 25,
    // MARGEM DE SEGURANÇA DO TOPO (Para não colar na bateria)
    paddingTop: Platform.OS === 'android' ? 50 : 60, 
    paddingBottom: 10,
  },
  welcomeLabel: {
    fontSize: 14,
    color: '#6b7280', // Cinza médio
    marginBottom: 2,
    fontWeight: '500',
  },
  userName: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
    textTransform: 'capitalize', // Primeira letra maiúscula
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 120, // Espaço extra no final para o Botão SOS não cobrir nada
  },
  brandArea: {
    alignItems: 'center',
    marginTop: 15, 
    marginBottom: 30,
  },
  logoGeral: {
    width: 80, 
    height: 80,
    resizeMode: 'contain',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginTop: 10,
    letterSpacing: 0.5,
  },
  divider: {
    width: 40,
    height: 3,
    backgroundColor: '#000000',
    marginTop: 8,
    borderRadius: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardTech: {
    backgroundColor: '#FFFFFF',
    width: '48%', // Ocupa metade da tela (menos a margem)
    aspectRatio: 1.1, 
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    // Sombra Suave
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    // Borda Fina
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  iconContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f3f4f6', // Círculo cinza atrás do ícone
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