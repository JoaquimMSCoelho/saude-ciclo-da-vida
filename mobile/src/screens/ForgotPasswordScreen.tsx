// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// MÓDULO: RECUPERAÇÃO DE SENHA
// TIPO: FRONTEND MOBILE
// DESCRIÇÃO: Fluxo de solicitação de reset de senha
// -------------------------------------------------------------------------

import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Image, StatusBar, KeyboardAvoidingView, Platform, Alert 
} from 'react-native';
import { styles as globalStyles } from '../styles/global';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');

  const handleRecover = () => {
    if (!email) {
      Alert.alert('Atenção', 'Digite seu e-mail para continuar.');
      return;
    }
    // TODO: Conectar com endpoint de envio de e-mail futuramente
    Alert.alert(
      'Solicitação Enviada', 
      `Se o e-mail ${email} estiver cadastrado, você receberá um link de recuperação em instantes.`,
      [{ text: 'Voltar ao Login', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={globalStyles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.content}
      >
          {/* CABEÇALHO */}
          <View style={styles.header}>
            <Image 
              source={require('../../assets/LogoAppGeral.png')} 
              style={styles.logoSmall} 
            />
            <Text style={styles.title}>Recuperar Acesso</Text>
            <Text style={styles.subtitle}>
               Digite seu e-mail para receber as instruções de redefinição.
            </Text>
          </View>

          {/* FORMULÁRIO */}
          <View style={styles.form}>
            <Text style={styles.label}>E-mail Cadastrado</Text>
            <TextInput 
              style={globalStyles.input} 
              placeholder="seu@email.com"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TouchableOpacity 
              style={[globalStyles.loginButton, styles.sendButton]} 
              onPress={handleRecover}
            >
              <Text style={globalStyles.loginButtonText}>ENVIAR LINK</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: Platform.OS === 'android' ? 60 : 70, // Safe Area
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoSmall: {
    width: 70,
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
    marginTop: 10,
    paddingHorizontal: 10,
    lineHeight: 20,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  sendButton: {
    marginTop: 20,
  },
  cancelButton: {
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
  },
  cancelText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  }
});