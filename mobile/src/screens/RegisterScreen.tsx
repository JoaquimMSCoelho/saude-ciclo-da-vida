// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// MÓDULO: TELA DE CADASTRO
// TIPO: FRONTEND MOBILE
// DESCRIÇÃO: Formulário de registro com validação e feedback visual
// -------------------------------------------------------------------------

import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Image, StatusBar, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import { styles as globalStyles } from '../styles/global';
import api from '../services/api';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Campos Obrigatórios', 'Por favor, preencha todos os dados.');
      return;
    }

    setLoading(true);
    try {
      // Envia para o Backend (Porta 4000)
      const response = await api.post('/auth/register', { 
        name, 
        email, 
        password 
      });

      // Sucesso
      Alert.alert(
        'Cadastro Realizado', 
        'Sua conta foi criada com sucesso! Faça login para ativar o sistema.',
        [{ text: 'Ir para Login', onPress: () => navigation.navigate('Login') }]
      );

    } catch (error: any) {
      console.log(error);
      const msg = error.response?.data?.message || 'Verifique sua conexão e tente novamente.';
      Alert.alert('Erro no Cadastro', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* CABEÇALHO PADRÃO INTERNO */}
          <View style={styles.header}>
            <Image 
              source={require('../../assets/LogoAppGeral.png')} 
              style={styles.logoSmall} 
            />
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Inicie seu monitoramento inteligente.</Text>
          </View>

          {/* FORMULÁRIO */}
          <View style={styles.form}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput 
              style={globalStyles.input} 
              placeholder="Ex: Maria Silva"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput 
              style={globalStyles.input} 
              placeholder="seu@email.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput 
              style={globalStyles.input} 
              placeholder="Crie uma senha forte"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity 
              style={[globalStyles.loginButton, styles.registerButton]} 
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={globalStyles.loginButtonText}>FINALIZAR CADASTRO</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backText}>Já possui cadastro? <Text style={styles.linkText}>Entrar</Text></Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: Platform.OS === 'android' ? 60 : 70, // Safe Area conforme DESIGN_SYSTEM
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoSmall: {
    width: 70, // Ajustado para DESIGN_SYSTEM
    height: 70,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 5,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 15,
  },
  registerButton: {
    marginTop: 30,
  },
  backButton: {
    marginTop: 25,
    alignItems: 'center',
    padding: 10,
  },
  backText: {
    color: '#4b5563',
    fontSize: 14,
  },
  linkText: {
    color: '#0891b2', // Cyan padrão
    fontWeight: 'bold',
  }
});