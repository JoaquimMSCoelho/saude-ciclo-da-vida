// -------------------------------------------------------------------------
// COMPONENTE: BOTÃO DE PÂNICO FLUTUANTE (FAB)
// POSIÇÃO: Canto Inferior Direito (Conforme Imagens img02 e img04)
// -------------------------------------------------------------------------
import React from 'react';
import { TouchableOpacity, StyleSheet, Alert, Text, View } from 'react-native';

interface PanicButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export default function PanicButtonSmall({ onPress, disabled = false }: PanicButtonProps) {
  
  const handlePress = () => {
    if (disabled) {
      Alert.alert(
        "Ainda não disponível", 
        "O Botão SOS será ativado após o seu login."
      );
    } else {
      onPress();
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, disabled ? styles.disabled : styles.active]} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>SOS</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 60,   // Um pouco maior para ser tocável com facilidade
    height: 60,
    borderRadius: 30, // Redondo
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,  // FLUTUANDO NO RODAPÉ
    right: 30,   // CANTO DIREITO
    zIndex: 9999,
    elevation: 8, // Sombra forte para destacar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  active: {
    backgroundColor: '#dc2626', // Vermelho Vivo
    borderWidth: 2,
    borderColor: '#FFF',
  },
  disabled: {
    backgroundColor: '#9ca3af', // Cinza
    borderColor: '#e5e7eb',
  },
  text: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  }
});