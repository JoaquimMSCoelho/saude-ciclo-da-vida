// -------------------------------------------------------------------------
// COMPONENTE: BOTÃO SAIR PADRONIZADO
// REFERÊNCIA: Imagem 'BotaoSairGeral.jpg'
// -------------------------------------------------------------------------
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LogOut } from 'lucide-react-native'; // Ícone de saída

interface LogoutButtonProps {
  onPress: () => void;
}

export default function LogoutButton({ onPress }: LogoutButtonProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <LogOut size={16} color="#b91c1c" style={{ marginRight: 6 }} />
      <Text style={styles.text}>SAIR</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#b91c1c', // Vermelho Escuro da borda
    borderRadius: 8,        // Cantos levemente arredondados
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#fef2f2', // Fundo levemente avermelhado (quase branco)
  },
  text: {
    color: '#b91c1c',       // Texto Vermelho
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 0.5,
  }
});