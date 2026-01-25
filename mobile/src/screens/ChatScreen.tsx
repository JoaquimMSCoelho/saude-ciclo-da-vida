// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA
// CAMINHO: mobile/src/screens/ChatScreen.tsx
// OBJETIVO: Interface de Chat em Tempo Real (Socket.io)
// -------------------------------------------------------------------------

import React, { useEffect, useState, useRef } from 'react';
import { 
  View, Text, TextInput, FlatList, TouchableOpacity, 
  SafeAreaView, KeyboardAvoidingView, Platform, StyleSheet 
} from 'react-native';
import { Send, AlertTriangle } from 'lucide-react-native'; // Ícones
import { ChatService } from '../services/ChatService'; // O serviço que criamos
import { styles as globalStyles, COLORS } from '../styles/global';

interface Message {
  id: string;
  text: string;
  userId: string;
  timestamp: string;
  type: 'TEXT' | 'ALERT';
}

export default function ChatScreen({ route, navigation }: any) {
  const { user } = route.params; // Usuário logado
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  
  // ID da Sala (Ex: Sala única de emergência ou grupo da família)
  // Por simplificação, vamos usar uma sala fixa "global_room" para teste inicial
  const ROOM_ID = 'global_room'; 

  useEffect(() => {
    // 1. Conecta ao WebSocket
    ChatService.connect();
    
    // 2. Entra na Sala
    ChatService.joinRoom(ROOM_ID);

    // 3. Escuta novas mensagens chegando
    ChatService.onMessageReceived((newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    // Cleanup: Desconecta ao sair da tela
    return () => {
      ChatService.disconnect();
    };
  }, []);

  const handleSend = () => {
    if (inputText.trim() === '') return;

    // Envia via Serviço
    ChatService.sendMessage(ROOM_ID, user.id, inputText, 'TEXT');
    
    setInputText(''); // Limpa campo
  };

  const handleSOS = () => {
    // Exemplo de botão rápido de alerta dentro do chat
    ChatService.sendMessage(ROOM_ID, user.id, '🚨 PRECISO DE AJUDA!', 'ALERT');
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.userId === user.id;
    const isAlert = item.type === 'ALERT';

    return (
      <View style={[
        styles.msgContainer, 
        isMe ? styles.msgMe : styles.msgOther,
        isAlert && styles.msgAlert
      ]}>
        {!isMe && <Text style={styles.msgUser}>{item.userId.substring(0, 5)}...</Text>}
        <Text style={[styles.msgText, isMe ? { color: '#FFF' } : { color: '#000' }]}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        {/* CABEÇALHO SIMPLES */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Chat de Apoio</Text>
          <TouchableOpacity onPress={handleSOS}>
             <AlertTriangle color={COLORS.danger} size={24} />
          </TouchableOpacity>
        </View>

        {/* LISTA DE MENSAGENS */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 15 }}
        />

        {/* ÁREA DE INPUT */}
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
            <Send color="#FFF" size={20} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#EEE'
  },
  backButton: { color: COLORS.primary, fontWeight: 'bold' },
  title: { fontWeight: 'bold', fontSize: 16 },
  msgContainer: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  msgMe: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
  },
  msgOther: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  msgAlert: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: COLORS.danger,
    width: '100%'
  },
  msgUser: { fontSize: 10, color: '#666', marginBottom: 2 },
  msgText: { fontSize: 16 },
  inputArea: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFF',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    color: '#000'
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 50
  }
});