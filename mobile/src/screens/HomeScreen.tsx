// ARQUIVO: mobile/src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Vibration, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location'; // Biblioteca do GPS
import api from '../services/api'; // Nossa conexão com o Backend

export default function HomeScreen({ navigation, route }: any) {
  const [pressing, setPressing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  // 1. Ao abrir a tela, pede permissão do GPS
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Precisamos da permissão de localização para o botão funcionar!');
        return;
      }

      // Tenta pegar uma localização rápida só para ligar o sensor
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  const handlePanic = async () => {
    // Feedback Físico (Vibração)
    Vibration.vibrate(500);
    setLoading(true);

    try {
      // 2. Pega a localização EXATA no momento do clique
      const currentLocation = await Location.getCurrentPositionAsync({});
      
      // 3. Pega o ID do usuário que veio do Login
      // Se por acaso vier vazio, usamos um fallback ou avisamos o erro
      const userId = route.params?.userId; 

      if (!userId) {
        Alert.alert('Erro', 'Usuário não identificado. Faça login novamente.');
        setLoading(false);
        return;
      }

      console.log('Enviando para o Backend...', {
        lat: currentLocation.coords.latitude,
        long: currentLocation.coords.longitude,
        user: userId
      });

      // 4. ENVIA PARA O BACKEND REAL
      await api.post('/alerts', {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        userId: userId
      });

      setLoading(false);
      // MENSAGEM NOVA - PROVA DE QUE O CÓDIGO ATUALIZOU
      Alert.alert('SUCESSO', '🚨 SOCORRO SOLICITADO! \nSua localização foi gravada no banco de dados.');

    } catch (error) {
      setLoading(false);
      console.log(error);
      Alert.alert('Falha', 'Não foi possível enviar o alerta. Verifique se o Backend está rodando.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Sistema Ativo</Text>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.instruction}>EMERGÊNCIA</Text>
        <Text style={styles.subInstruction}>
           {location ? 'GPS Calibrado ✅' : 'Buscando Satélites...'}
        </Text>

        <TouchableOpacity 
          style={[styles.panicButton, pressing && styles.panicButtonPressed]}
          onPress={handlePanic}
          onPressIn={() => setPressing(true)}
          onPressOut={() => setPressing(false)}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
             <ActivityIndicator size="large" color="#FFF" />
          ) : (
             <Text style={styles.panicText}>SOS</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 50, backgroundColor: '#FFF' },
  welcomeText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  logoutText: { color: 'red', fontWeight: 'bold' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  instruction: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  subInstruction: { fontSize: 14, color: '#666', marginBottom: 40 },
  panicButton: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#FF3B30', justifyContent: 'center', alignItems: 'center', borderWidth: 5, borderColor: '#FF8A84', elevation: 10 },
  panicButtonPressed: { backgroundColor: '#D32F2F', transform: [{ scale: 0.95 }] },
  panicText: { color: '#FFF', fontSize: 48, fontWeight: 'bold' },
});