// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// MÓDULO: TELA DE LOGIN
// VERSÃO: HÍBRIDA (Design Original + Conexão IP Fixa + SecureStore)
// -------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { 
  View, TextInput, TouchableOpacity, Image, StatusBar, 
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text 
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

// --- IMPORTAÇÕES DE ESTILO E COMPONENTES ORIGINAIS ---
import PanicButtonSmall from '../components/PanicButtonSmall';
import { styles as globalStyles } from '../styles/global';

// --- CONFIGURAÇÃO DE REDE (IP FIXO) ---
const API_URL = 'http://192.168.15.11:4000'; 

export default function LoginScreen({ navigation }: any) {
  // Alterei para maria@teste.com para garantir que o login funcione com os dados que temos no banco
  const [email, setEmail] = useState('maria@teste.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  
  // Login: Lógica Nova (Axios Direto + SecureStore)
  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Atenção', 'Preencha e-mail e senha.');

    setLoading(true);
    try {
      console.log(`📡 Conectando em: ${API_URL}/auth/login`);
      
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { user, access_token } = response.data;
      
      // SALVAMENTO SEGURO (Essencial para o GPS na próxima tela)
      await SecureStore.setItemAsync('token', access_token);
      await SecureStore.setItemAsync('user', JSON.stringify(user));

      console.log('✅ Login Autorizado!');
      // Navega enviando os dados, mantendo compatibilidade com seu código original
      navigation.replace('Home', { user, token: access_token });
      
    } catch (error) {
      console.error('Erro Login:', error);
      Alert.alert(
        'Falha na Conexão', 
        'Não foi possível conectar ao servidor. Verifique se o Backend está rodando e o IP está correto.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSOSAction = () => {
    Alert.alert('Segurança', 'Faça login para ativar o sistema de emergência.');
  };

  return (
    <View style={globalStyles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.content}
      >
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/LogoApp.png')} style={styles.logo} />
        </View>

        <View style={styles.formContainer}>
          <TextInput 
            style={globalStyles.input} 
            placeholder="E-mail ou CPF"
            placeholderTextColor="#6b7280" 
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <TextInput 
            style={globalStyles.input} 
            placeholder="Senha" 
            placeholderTextColor="#6b7280"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          
          <TouchableOpacity style={globalStyles.loginButton} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#000" /> : <Text style={globalStyles.loginButtonText}>ENTRAR</Text>}
          </TouchableOpacity>

          {/* --- SEUS LINKS ORIGINAIS RESTAURADOS --- */}
          <TouchableOpacity 
            style={{ marginTop: 20 }} 
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.linkText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ marginTop: 30 }}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.linkText}>Ainda não tem conta? <Text style={{fontWeight: 'bold', color: '#0891b2'}}>Cadastre-se</Text></Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Botão SOS mantido (desativado antes do login) */}
      <PanicButtonSmall onPress={handleSOSAction} disabled={true} />
    </View>
  );
}

// --- SEUS ESTILOS ORIGINAIS ---
const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingHorizontal: 30,
    width: '100%',
    paddingTop: Platform.OS === 'android' ? 50 : 70, 
  },
  logoContainer: {
    marginTop: 10, 
    marginBottom: 40, 
    alignItems: 'center',
  },
  logo: {
    width: 170,  
    height: 250, 
    resizeMode: 'contain',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10, 
  },
  linkText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  }
});