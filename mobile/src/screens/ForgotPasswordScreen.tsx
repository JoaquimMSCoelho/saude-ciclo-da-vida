// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// MÓDULO: RECUPERAÇÃO DE SENHA
// VERSÃO: ROLLBACK STABLE (Design Clean 120px - Fluxo Natural)
// -------------------------------------------------------------------------

import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Image, StatusBar, KeyboardAvoidingView, Platform, Alert, ScrollView 
} from 'react-native';
import { styles as globalStyles } from '../styles/global';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');

  const handleRecover = () => {
    if (!email) {
      Alert.alert('Atenção', 'Digite seu e-mail para continuar.');
      return;
    }
    // Lógica original mantida
    Alert.alert(
      'Solicitação Enviada', 
      `Se o e-mail ${email} estiver cadastrado, você receberá um link de recuperação em instantes.`,
      [{ text: 'Voltar ao Login', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* 1. CABEÇALHO (PADRÃO UNIVERSAL 120px) */}
            <View style={styles.header}>
              <Image 
                source={require('../../assets/LogoApp.png')} 
                style={styles.universalLogo} 
              />
              <Text style={styles.title}>Recuperar Acesso</Text>
              <Text style={styles.subtitle}>
                 Digite seu e-mail para redefinir a senha.
              </Text>
            </View>

            {/* 2. FORMULÁRIO COMPACTO */}
            <View style={styles.formArea}>
              
              <View style={styles.inputGroup}>
                 <TextInput 
                    style={styles.input} 
                    placeholder="E-mail Cadastrado"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                 />
              </View>

              {/* BOTÃO PRIMÁRIO (AZUL REAL) */}
              <TouchableOpacity 
                style={styles.primaryButton} 
                onPress={handleRecover}
              >
                <Text style={styles.primaryButtonText}>ENVIAR LINK</Text>
              </TouchableOpacity>

              {/* BOTÃO CANCELAR (Discreto) */}
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

            </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: Platform.OS === 'android' ? 50 : 60,
  },
  
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  // PADRÃO 120px
  universalLogo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 10,
    lineHeight: 20,
  },

  formArea: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F9FAFB', 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    borderRadius: 12, 
    padding: 16, 
    fontSize: 16, 
    color: '#1F2937',
  },

  primaryButton: {
    backgroundColor: '#2563EB', 
    paddingVertical: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    shadowColor: '#2563EB', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 8, 
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    fontSize: 16, 
    letterSpacing: 0.5,
  },

  cancelButton: {
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
  },
  cancelText: {
    color: '#6B7280', 
    fontSize: 14, 
    fontWeight: '500',
  }
});