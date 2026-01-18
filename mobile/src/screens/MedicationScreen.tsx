import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, StatusBar, Alert, TouchableOpacity, Image } from 'react-native';
import api from '../services/api';
import { styles, COLORS } from '../styles/global';

export default function MedicationScreen({ route, navigation }) {
  const { user } = route.params;
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    const fetchMeds = async () => {
      try {
        const response = await api.get(`/users/${user.id}/medications`);
        setMeds(response.data);
      } catch (error) {
        Alert.alert("ERRO", "Falha na sincronização.");
      }
    };
    fetchMeds();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { paddingHorizontal: 25 }]}>
      <StatusBar barStyle="light-content" />
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 30 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={require('../../assets/LogoApp.png')} style={{ width: 40, height: 40, marginRight: 15 }} />
          <Text style={{ color: COLORS.primary, fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace' }}>
            // PROTOCOLO
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.logoutBtn}>
          <Text style={{ color: COLORS.danger, fontWeight: 'bold' }}>SAIR</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={meds}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ 
            backgroundColor: COLORS.surface, 
            padding: 25, 
            borderRadius: 20, 
            marginBottom: 20, 
            borderLeftWidth: 6, 
            borderLeftColor: COLORS.primary,
            elevation: 5
          }}>
            <Text style={{ color: '#FFF', fontSize: 22, fontWeight: 'bold' }}>{item.name}</Text>
            <Text style={{ color: COLORS.primary, fontSize: 15, fontWeight: 'bold', marginTop: 4 }}>{item.dosage}</Text>
            
            {item.schedules?.map((s, i) => (
              <View key={i} style={{ marginTop: 15, padding: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
                <Text style={{ color: '#cbd5e1', fontSize: 15, fontWeight: '600' }}>⏰ {s.time} - {s.instructions}</Text>
              </View>
            ))}
          </View>
        )}
      />
    </SafeAreaView>
  );
}