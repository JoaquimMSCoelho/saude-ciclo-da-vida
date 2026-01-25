// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// MÓDULO: ROOT COMPONENT (ROTEAMENTO)
// VERSÃO: CLEAN (Correção de Erro de Renderização)
// -------------------------------------------------------------------------

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// 1. Autenticação
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

// 2. Funcionalidades do App
import HomeScreen from './src/screens/HomeScreen';
import MedicationScreen from './src/screens/MedicationScreen';
import ChatScreen from './src/screens/ChatScreen';

// 3. Emergência
import PanicScreen from './src/screens/PanicScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Medication" component={MedicationScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Panic" component={PanicScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}