// ARQUIVO: mobile/src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import api from '../services/api';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha email e senha.');
      return;
    }

    setLoading(true);

    try {
      // 1. Tenta fazer login
      const response = await api.post('/auth/login', {
        email: email,
        password: password
      });

      setLoading(false);
      
      // 2. SUCESSO! (Aqui mudamos o comportamento)
      // Antes: Mostrava Alert.
      // Agora: Navega para a Home imediatamente.
      navigation.replace('Home', { userId: response.data.user.id }); 

    } catch (error: any) {
      setLoading(false);
      // Tratamento de erros continua igual
      if (error.response) {
        Alert.alert('Erro', error.response.data.message || 'Falha no login');
      } else {
        Alert.alert('Erro de Conexão', 'Verifique o IP e se o Backend está rodando.');
      }
    }
  };

  // ... (O restante do visual visual (return) continua igual)
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Saúde Ciclo da Vida</Text>
        <Text style={styles.subtitle}>Acesso Seguro</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="exemplo@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>ENTRAR</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#FFFFFF', padding: 25, borderRadius: 15, elevation: 5 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 5, marginTop: 10 },
  input: { backgroundColor: '#F5F6FA', borderWidth: 1, borderColor: '#E1E1E1', borderRadius: 8, padding: 12, fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginTop: 25, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});