// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// MÓDULO: TELA DE AUTENTICAÇÃO (LOGIN)
// VERSÃO: COMPACT ENTERPRISE (Placeholders Internos + Espaçamento Otimizado)
// -------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Image, StatusBar, 
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, ScrollView 
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons'; 

// --- IMPORTAÇÕES ORIGINAIS ---
import PanicButtonSmall from '../components/PanicButtonSmall';

// --- CONFIGURAÇÃO DE REDE (IP FIXO) ---
const API_URL = 'http://192.168.15.11:4000'; 

export default function LoginScreen({ navigation }: any) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('maria@teste.com');
  const [password, setPassword] = useState('123456');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [offlineUser, setOfflineUser] = useState<any>(null);

  // --- EFEITO: CHECAGEM DE SEGURANÇA (SOS OFFLINE) ---
  useEffect(() => {
    const checkSavedSession = async () => {
      try {
        const savedUserJSON = await SecureStore.getItemAsync('user');
        const savedToken = await SecureStore.getItemAsync('token');

        if (savedUserJSON && savedToken) {
          console.log('🛡️ Sessão anterior encontrada: Botão SOS ARMADO.');
          setOfflineUser(JSON.parse(savedUserJSON));
        }
      } catch (error) {
        console.log('Nenhuma sessão salva.');
      }
    };
    checkSavedSession();
  }, []);

  // --- LÓGICA DE LOGIN/CADASTRO ---
  const handleSubmit = async () => {
    // Validação Básica
    if (!email || !password) return Alert.alert('Atenção', 'Preencha os campos obrigatórios.');
    
    // Validação extra para Cadastro
    if (!isLoginTab) {
        if (!name) return Alert.alert('Atenção', 'Digite seu nome completo.');
        if (password !== confirmPassword) return Alert.alert('Erro', 'As senhas não coincidem.');
    }

    setLoading(true);
    const endpoint = isLoginTab ? '/auth/login' : '/auth/register'; 

    try {
      console.log(`📡 Conectando em: ${API_URL}${endpoint}`);
      
      const payload = isLoginTab 
        ? { email, password } 
        : { name, email, password };

      const response = await axios.post(`${API_URL}${endpoint}`, payload);
      
      // Cenário 1: Cadastro realizado
      if (!isLoginTab) {
          Alert.alert('Sucesso', 'Conta criada! Faça login para continuar.');
          setIsLoginTab(true);
          setLoading(false);
          return;
      }

      // Cenário 2: Login realizado
      const { user, access_token } = response.data;
      
      await SecureStore.setItemAsync('token', access_token);
      await SecureStore.setItemAsync('user', JSON.stringify(user));

      console.log('✅ Acesso Autorizado!');
      navigation.replace('Home', { user, token: access_token });
      
    } catch (error: any) {
      console.error('Erro Auth:', error);
      const msg = error.response?.data?.message || 'Falha na conexão com o servidor. Verifique o IP.';
      Alert.alert('Ops!', typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
      Alert.alert('Em Breve', `O login com ${provider} será ativado na próxima atualização.`);
  };

  const handleSOSAction = () => {
    if (offlineUser) {
      console.log('🚨 Pânico Acionado via Sessão Offline');
      navigation.navigate('Panic', { user: offlineUser });
    } else {
      Alert.alert(
        'Botão Inativo', 
        'Por segurança, você precisa fazer login ou cadastro pelo menos uma vez neste aparelho para ativar o SOS.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* 1. LOGO (PADRÃO UNIVERSAL 120px) */}
          <View style={styles.header}>
             <Image source={require('../../assets/LogoApp.png')} style={styles.logo} />
          </View>

          {/* 2. ABAS (TABS) */}
          <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tabButton, isLoginTab && styles.activeTab]}
                onPress={() => setIsLoginTab(true)}
              >
                  <Text style={[styles.tabText, isLoginTab && styles.activeTabText]}>Entrar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tabButton, !isLoginTab && styles.activeTab]}
                onPress={() => setIsLoginTab(false)}
              >
                  <Text style={[styles.tabText, !isLoginTab && styles.activeTabText]}>Cadastrar</Text>
              </TouchableOpacity>
          </View>

          {/* 3. FORMULÁRIO COMPACTO (Placeholders Internos) */}
          <View style={styles.formArea}>
            
            {!isLoginTab && (
                <View style={styles.inputGroup}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Nome Completo"
                        placeholderTextColor="#9CA3AF"
                        value={name}
                        onChangeText={setName}
                    />
                </View>
            )}

            <View style={styles.inputGroup}>
                <TextInput 
                    style={styles.input} 
                    placeholder="E-mail"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <View style={styles.inputGroup}>
                <TextInput 
                    style={styles.input} 
                    placeholder="Senha"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            {!isLoginTab && (
                <View style={styles.inputGroup}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Repita a senha"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>
            )}

            {isLoginTab && (
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotLink}>
                    <Text style={styles.forgotText}>Esqueceu a senha?</Text>
                </TouchableOpacity>
            )}

            {/* BOTÃO DE AÇÃO */}
            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={styles.primaryButtonText}>
                        {isLoginTab ? 'ENTRAR' : 'CRIAR CONTA'}
                    </Text>
                )}
            </TouchableOpacity>

            {/* DIVISOR */}
            <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Ou continue com</Text>
                <View style={styles.dividerLine} />
            </View>

            {/* BOTÕES SOCIAIS */}
            <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('Google')}>
                    <FontAwesome name="google" size={24} color="#EA4335" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('Apple')}>
                    <FontAwesome name="apple" size={24} color="#000" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('Facebook')}>
                    <FontAwesome name="facebook" size={24} color="#1877F2" />
                </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <PanicButtonSmall onPress={handleSOSAction} disabled={!offlineUser} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { 
    flexGrow: 1, 
    paddingHorizontal: 30, 
    paddingBottom: 100, 
    paddingTop: Platform.OS === 'android' ? 50 : 60,
  },
  
  // Header Compacto
  header: { 
    alignItems: 'center', 
    marginBottom: 20 // 2 Linhas de respiro
  },
  logo: { width: 120, height: 120, resizeMode: 'contain' },
  
  // Abas
  tabContainer: { flexDirection: 'row', marginBottom: 25, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tabButton: { flex: 1, paddingVertical: 15, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#2563EB' },
  tabText: { fontSize: 16, fontWeight: '500', color: '#9CA3AF' },
  activeTabText: { color: '#2563EB', fontWeight: 'bold' },

  formArea: { flex: 1 },
  // Espaçamento Otimizado (Não grudado, mas compacto)
  inputGroup: { marginBottom: 15 },
  input: { 
    backgroundColor: '#F9FAFB', 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    borderRadius: 12, 
    padding: 16, 
    fontSize: 16, 
    color: '#1F2937' 
  },
  
  forgotLink: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText: { color: '#2563EB', fontWeight: '600', fontSize: 14 },
  
  primaryButton: { backgroundColor: '#2563EB', paddingVertical: 18, borderRadius: 12, alignItems: 'center', shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5 },
  
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { marginHorizontal: 15, color: '#6B7280', fontSize: 14 },
  
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 20 },
  socialButton: { width: 60, height: 60, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }
});