import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StatusBar, ActivityIndicator, Alert } from 'react-native';
import api from '../services/api';
import { styles } from '../styles/global';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('joao.pai@email.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      navigation.replace('Home', { user: response.data.user });
    } catch (error) {
      Alert.alert("ERRO", "Falha na autenticação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#FFF' }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.loginHeader}>
        <Image source={require('../../assets/LogoApp.png')} style={styles.loginLogo} />
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 15, color: '#003366' }}>Saúde Ciclo da Vida</Text>
      </View>

      <View style={styles.loginContent}>
        <View style={styles.inputGroup}>
          <TextInput value={email} onChangeText={setEmail} placeholder="E-mail ou CPF" style={styles.input} placeholderTextColor="#999" />
        </View>
        <View style={styles.inputGroup}>
          <TextInput value={password} onChangeText={setPassword} placeholder="Senha" secureTextEntry style={styles.input} placeholderTextColor="#999" />
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#000" /> : <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#000' }}>ENTER</Text>}
        </TouchableOpacity>
        
        <TouchableOpacity><Text style={styles.linkText}>Esqueci minha senha</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.linkText}>Ainda não tem conta? Cadastre-se</Text></TouchableOpacity>
      </View>
    </View>
  );
}