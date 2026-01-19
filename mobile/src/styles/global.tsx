// -------------------------------------------------------------------------
// ARQUIVO: styles/global.tsx
// TEMA: CLEAN MEDICAL V2 (BORDAS DEFINIDAS + TEXTO CENTRALIZADO)
// -------------------------------------------------------------------------
import { StyleSheet } from 'react-native';

export const COLORS = {
  background: '#FFFFFF',
  primary: '#000000',    // Preto para textos principais
  textDark: '#000000',
  textLight: '#4b5563',
  inputBackground: '#f3f4f6', // Cinza muito suave (quase branco)
  borderColor: '#1f2937',     // Borda escura para contraste (conforme imagem)
  danger: '#dc2626',
  white: '#FFFFFF',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // -- NOVOS INPUTS (Estilo "Caixa com Borda") --
  input: {
    width: '100%',
    height: 55,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 10,       // Cantos arredondados
    borderWidth: 1,         // Borda fina
    borderColor: '#333',    // Cor da borda
    fontSize: 18,
    color: '#000',
    marginBottom: 15,
    paddingHorizontal: 15,
    textAlign: 'center',    // TEXTO CENTRALIZADO (Conforme sua imagem)
    fontWeight: '600',      // Texto levemente negrito
  },

  // -- BOTÃO ENTER (Cinza Sólido) --
  loginButton: {
    width: '100%',
    height: 55,
    backgroundColor: '#d1d5db', // Cinza médio
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    elevation: 2, // Sombra leve Android
    shadowColor: '#000', // Sombra leve iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: '#000',     // Texto Preto
    fontSize: 20,
    fontWeight: '900', // Extra Negrito ("ENTER")
    letterSpacing: 1,
  },

  // -- CARDS (Manteremos para uso futuro) --
  cardFigma: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    width: '48%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  }
});