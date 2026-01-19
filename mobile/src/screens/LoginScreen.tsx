// -------------------------------------------------------------------------
// TELA: LOGIN (VERSÃO FINAL - LOGO NO TOPO)
// AJUSTE: LogoApp posicionado no topo com margem de segurança (Safe Area)
// -------------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { 
  View, TextInput, TouchableOpacity, Image, StatusBar, 
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PanicButtonSmall from '../components/PanicButtonSmall';
import api from '../services/api';
import { styles as globalStyles, COLORS } from '../styles/global';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('joao.pai@email.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkHistory();
  }, []);

  const checkHistory = async () => {
    const registered = await AsyncStorage.getItem('@SCV:hasLogged');
    if (registered === 'true') setHasAccess(true);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      await AsyncStorage.setItem('@SCV:hasLogged', 'true');
      const { user, access_token } = response.data;
      navigation.replace('Home', { user, token: access_token });
    } catch (error) {
      Alert.alert('Erro de Acesso', 'Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.content}
      >
        
        {/* 1. LOGO PRINCIPAL (Agora no topo) */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/LogoApp.png')} 
            style={styles.logo} // W:170, H:250
          />
        </View>

        {/* 2. FORMULÁRIO */}
        <View style={styles.formContainer}>
          <TextInput 
            style={globalStyles.input} 
            placeholder="E-mail ou CPF"
            placeholderTextColor="#6b7280" 
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
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
            {loading ? <ActivityIndicator color="#000" /> : <Text style={globalStyles.loginButtonText}>ENTER</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 20 }}>
            <Text style={styles.linkText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 30 }}>
            <Text style={styles.linkText}>Ainda não tem conta? Cadastre-se</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>

      {/* 3. BOTÃO SOS (Flutuante Canto Inferior Direito) */}
      <PanicButtonSmall 
        onPress={() => navigation.navigate('Panic', { user: { id: 'anon', name: 'Anonimo' } })} 
        disabled={!hasAccess} 
      />

    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    // MUDANÇA CRÍTICA 1: Trocamos 'center' por 'flex-start' para jogar tudo pro topo
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingHorizontal: 30,
    width: '100%',
    // MUDANÇA CRÍTICA 2: Adicionamos padding no topo para o "Respiro"
    paddingTop: Platform.OS === 'android' ? 50 : 70, 
  },
  logoContainer: {
    // Ajuste fino: Pequena margem do topo e espaço embaixo para os inputs
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
    // Opcional: Se quiser descer um pouco só o formulário, aumente aqui
    marginTop: 10, 
  },
  linkText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  }
});