// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// MÓDULO: TELA DE LOGIN
// VERSÃO: FINAL STABLE (Com Links de Navegação Ativos)
// -------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { 
  View, TextInput, TouchableOpacity, Image, StatusBar, 
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text 
} from 'react-native';

import { StorageService, UserProfile } from '../services/storage';
import PanicButtonSmall from '../components/PanicButtonSmall';
import api from '../services/api';
import { styles as globalStyles } from '../styles/global';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('joao.pai@email.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [localUser, setLocalUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const checkHistory = async () => {
      const user = await StorageService.getUser();
      if (user) setLocalUser(user);
    };
    checkHistory();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, access_token } = response.data;
      navigation.replace('Home', { user, token: access_token });
    } catch (error) {
      Alert.alert('Erro de Acesso', 'Verifique suas credenciais ou conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleSOSAction = () => {
    if (localUser) {
      navigation.navigate('Panic', { user: localUser });
    } else {
      Alert.alert(
        'Função Indisponível', 
        'Para sua segurança, o botão SOS só é ativado após o primeiro login neste aparelho.'
      );
    }
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

          {/* --- LINKS DE NAVEGAÇÃO ATIVOS --- */}
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
          {/* ---------------------------------- */}
        </View>
      </KeyboardAvoidingView>

      <PanicButtonSmall onPress={handleSOSAction} disabled={!localUser} />
    </View>
  );
}

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