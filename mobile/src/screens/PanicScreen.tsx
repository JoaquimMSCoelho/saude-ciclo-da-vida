import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image } from 'react-native';
import { ShieldAlert, Heart, Activity } from 'lucide-react-native';
import { styles, COLORS } from '../styles/global';

export default function PanicScreen({ route, navigation }) {
  const { user } = route.params;

  return (
    <View style={[styles.container, { justifyContent: 'center' }]}>
      <StatusBar barStyle="light-content" />
      
      <View style={{ position: 'absolute', top: 60, left: 30, right: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
           <Image source={require('../../assets/LogoApp.png')} style={{ width: 40, height: 40, marginBottom: 5 }} />
           <Text style={{ color: '#FFF', fontSize: 26, fontWeight: 'bold' }}>{user.name}</Text>
           <Text style={{ color: COLORS.gray, fontSize: 13, letterSpacing: 1 }}>SISTEMA ATIVO</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.logoutBtn}>
           <Text style={{ color: COLORS.danger, fontWeight: 'bold', fontSize: 15 }}>SAIR</Text>
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: 'center' }}>
        <Text style={{ color: COLORS.danger, fontSize: 38, fontWeight: '900', letterSpacing: 2 }}>EMERGÊNCIA</Text>
        <Text style={{ color: COLORS.gray, fontSize: 16, marginBottom: 40, fontWeight: 'bold' }}>TOQUE PARA ACIONAR</Text>
        
        <TouchableOpacity style={styles.panicButtonV2} activeOpacity={0.8}>
          <View style={styles.innerRing}>
            <ShieldAlert color="#FFF" size={100} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.monitorFooter}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: COLORS.gray, fontSize: 11, fontWeight: 'bold' }}>BATIMENTOS</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
              <Heart color={COLORS.danger} fill={COLORS.danger} size={30} />
              <Text style={{ color: '#FFF', fontSize: 40, fontWeight: 'bold', marginLeft: 12 }}>82</Text>
              <Text style={{ color: COLORS.danger, fontWeight: 'bold', fontSize: 14 }}> BPM</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: COLORS.gray, fontSize: 11, fontWeight: 'bold' }}>CONEXÃO</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#22c55e', padding: 12, borderRadius: 15, marginTop: 5 }}>
              <Activity color="#22c55e" size={22} />
              <Text style={{ color: '#22c55e', fontWeight: 'bold', marginLeft: 8 }}>4G LTE</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}