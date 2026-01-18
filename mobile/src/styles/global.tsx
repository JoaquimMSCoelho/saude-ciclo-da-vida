import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const COLORS = {
  primary: '#97FFFF',    // Ciano Figma (Brand Primary)
  background: '#0f172a', // Azul Marinho Profundo (Imagem 5)
  surface: '#1e293b',    // Fundo de Monitoramento
  white: '#FFFFFF',      // Cards do Dashboard (Imagem 4)
  danger: '#ef4444',     // SOS
  gray: '#94a3b8',
  textDark: '#333333'
};

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  
  // LOGIN PROPORCIONAL (Imagem 1)
  loginHeader: { 
    height: height * 0.38, 
    backgroundColor: COLORS.primary, 
    borderBottomLeftRadius: 45, 
    borderBottomRightRadius: 45, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  loginLogo: { width: 130, height: 130, resizeMode: 'contain' },
  loginContent: { flex: 1, padding: 30, justifyContent: 'center' },
  inputGroup: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#e2e8f0', 
    borderRadius: 15, padding: 18, marginBottom: 15 
  },
  input: { flex: 1, color: '#333', fontSize: 16 },
  loginButton: { backgroundColor: '#cbd5e1', padding: 18, borderRadius: 15, alignItems: 'center' },
  linkText: { color: '#333', textAlign: 'center', marginTop: 12, fontSize: 14, fontWeight: '500' },

  // DASHBOARD (Imagem 3)
  dashHeader: { 
    backgroundColor: COLORS.primary, padding: 30, paddingTop: 60,
    borderBottomLeftRadius: 40, borderBottomRightRadius: 40, alignItems: 'center'
  },
  cardFigma: { 
    backgroundColor: COLORS.white, width: '46%', height: 150, borderRadius: 25, 
    justifyContent: 'center', alignItems: 'center', marginBottom: 18, elevation: 6
  },

  // SOS CENTRALIZADO (Imagem 5)
  panicButtonV2: { 
    width: 230, height: 230, borderRadius: 115, backgroundColor: '#dc2626', 
    borderWidth: 6, borderColor: '#ef4444', justifyContent: 'center', alignItems: 'center',
    elevation: 20, shadowColor: '#ef4444', shadowOpacity: 0.6, shadowRadius: 15
  },
  monitorFooter: { 
    width: '92%', backgroundColor: COLORS.surface, borderRadius: 22, 
    padding: 22, position: 'absolute', bottom: 35, alignSelf: 'center',
    borderWidth: 1, borderColor: '#334155'
  },

  // BOTÃO SAIR (Imagem 7)
  logoutBtn: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.15)', 
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 
  }
});