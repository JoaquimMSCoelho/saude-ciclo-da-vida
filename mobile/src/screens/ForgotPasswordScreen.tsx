// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// MÓDULO: RECUPERAÇÃO DE SENHA
// VERSÃO: HYBRID LAYOUT (Logo Topo Padrão + Corpo Centralizado)
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
        <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
        >
            
            {/* 1. ÁREA DO LOGO (FIXA NO TOPO - PADRÃO UNIVERSAL) */}
            <View style={styles.topHeader}>
              <Image 
                source={require('../../assets/LogoApp.png')} 
                style={styles.universalLogo} 
              />
            </View>

            {/* 2. ÁREA CENTRAL (OCUPA O ESPAÇO RESTANTE) */}
            <View style={styles.centerBody}>
                
                <View style={styles.textBlock}>
                    <Text style={styles.title}>Recuperar Acesso</Text>
                    <Text style={styles.subtitle}>
                        Digite seu e-mail para redefinir a senha.
                    </Text>
                </View>

                {/* FORMULÁRIO */}
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

                    {/* BOTÃO PRIMÁRIO (ENVIAR) */}
                    <TouchableOpacity 
                        style={styles.primaryButton} 
                        onPress={handleRecover}
                    >
                        <Text style={styles.primaryButtonText}>ENVIAR LINK</Text>
                    </TouchableOpacity>

                    {/* BOTÃO SECUNDÁRIO (CANCELAR EM BLOCO) */}
                    <TouchableOpacity 
                        style={styles.cancelBlockButton} 
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.cancelBlockText}>CANCELAR</Text>
                    </TouchableOpacity>
                </View>
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
    paddingBottom: 40,
  },
  
  // LOGO FIXO NO TOPO
  topHeader: {
    alignItems: 'center',
    marginBottom: 10, // Pequeno espaço antes de começar o bloco central
  },
  universalLogo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },

  // CORPO CENTRALIZADO
  // flex: 1 faz este bloco ocupar todo o espaço vertical disponível abaixo do logo
  // justifyContent: 'center' alinha o conteúdo no meio desse espaço
  centerBody: {
    flex: 1,
    justifyContent: 'center', 
    marginBottom: 60, // Ajuste para elevar um pouco visualmente
  },

  textBlock: {
    alignItems: 'center',
    marginBottom: 30,
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
    width: '100%',
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
    marginBottom: 15, 
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

  // ESTILO OUTLINE PARA O BOTÃO CANCELAR
  cancelBlockButton: {
    backgroundColor: '#FFFFFF', 
    paddingVertical: 18, 
    borderRadius: 12, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444', // Borda Vermelha
  },
  cancelBlockText: {
    color: '#EF4444', // Texto Vermelho
    fontWeight: 'bold', 
    fontSize: 16, 
    letterSpacing: 0.5,
  }
});