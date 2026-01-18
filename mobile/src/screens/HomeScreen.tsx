/**
 * -------------------------------------------------------------------------
 * PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
 * MÓDULO: DASHBOARD PRINCIPAL (HOME)
 * GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO) - PADRÃO FIGMA
 * -------------------------------------------------------------------------
 */

import React from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar } from 'react-native';
import { styles, COLORS } from '../styles/global';

export default function HomeScreen({ route, navigation }) {
  const { user } = route.params;
  const nameParts = user.name.split(' ');
  const displayName = `${nameParts[0]} ${nameParts[1] || ''}`;

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.dashHeader}>
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#003366' }}>Olá, {displayName}.</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Panic', { user })} 
            style={{ backgroundColor: COLORS.danger, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25, elevation: 5 }}>
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 13 }}>SOS</Text>
          </TouchableOpacity>
        </View>
        
        {/* CORREÇÃO DO CAMINHO DA LOGO (IMAGEM 8) */}
        <Image source={require('../../assets/LogoApp.png')} style={{ width: 100, height: 100, marginTop: 15 }} />
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10, color: '#003366' }}>Saúde Ciclo da Vida</Text>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', padding: 20, marginTop: 20 }}>
        {['Medicamentos', 'Consulta', 'Dieta', 'Perfil'].map((item) => (
          <TouchableOpacity 
            key={item} 
            style={styles.cardFigma} 
            onPress={() => item === 'Medicamentos' && navigation.navigate('Medication', { user })}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: COLORS.textDark }}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={{ position: 'absolute', bottom: 30, alignSelf: 'center', width: '92%', flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#FFF', padding: 18, borderRadius: 30, elevation: 10 }}>
        {['Home', 'Agenda', 'Config'].map(tab => (
          <View key={tab} style={{ alignItems: 'center' }}>
            <View style={{ width: 50, height: 25, backgroundColor: COLORS.primary, borderRadius: 8 }} />
            <Text style={{ fontSize: 13, marginTop: 5, color: '#666', fontWeight: 'bold' }}>{tab}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}