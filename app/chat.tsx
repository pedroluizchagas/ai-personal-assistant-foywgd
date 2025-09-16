
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import BottomTabBar from '../components/BottomTabBar';
import ChatBubble from '../components/ChatBubble';
import Icon from '../components/Icon';
import { ChatMessage } from '../types';

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Olá! Sou seu assistente pessoal com IA. Como posso ajudá-lo hoje? Posso criar tarefas, registrar gastos, agendar compromissos, criar notas e muito mais!',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const processAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Expense tracking
    if (message.includes('gasto') || message.includes('gastei') || message.includes('r$')) {
      const amountMatch = message.match(/r?\$?\s?(\d+(?:,\d{2})?)/);
      if (amountMatch) {
        const amount = amountMatch[1].replace(',', '.');
        return `✅ Gasto de R$ ${amount} registrado com sucesso! Categorizado automaticamente. Você pode ver o resumo na aba Finanças.`;
      }
      return 'Por favor, me informe o valor do gasto. Por exemplo: "Registre um gasto de R$ 50,00"';
    }
    
    // Task creation
    if (message.includes('tarefa') || message.includes('lembrar') || message.includes('fazer')) {
      return '✅ Tarefa criada com sucesso! Adicionei à sua lista de tarefas com prioridade média. Você pode visualizar e editar na aba Tarefas.';
    }
    
    // Workout routine
    if (message.includes('treino') || message.includes('exercício') || message.includes('academia')) {
      return '🏋️ Rotina de treinos criada! Agendei treinos às 09:00 da manhã de segunda a sábado (exceto domingo). Você receberá lembretes automáticos.';
    }
    
    // Goal creation
    if (message.includes('meta') || message.includes('objetivo')) {
      return '🎯 Meta criada com sucesso! Configurei o acompanhamento automático do progresso. Você pode ver o status no Dashboard e na aba Metas.';
    }
    
    // Note creation
    if (message.includes('nota') || message.includes('ideia') || message.includes('anotar')) {
      return `📝 Nota criada e estruturada com insights! 

**Principais pontos organizados:**
• Conceito principal identificado e destacado
• Análise de mercado adicionada
• Próximos passos sugeridos
• Tags relevantes aplicadas

A nota foi salva na aba Notas com estruturação inteligente e insights de negócio.`;
    }
    
    // Appointment scheduling
    if (message.includes('agendar') || message.includes('compromisso') || message.includes('reunião')) {
      return '📅 Compromisso agendado com sucesso! Configurei lembrete automático 15 minutos antes. Você pode ver na agenda do Dashboard.';
    }
    
    // Financial summary
    if (message.includes('financeiro') || message.includes('dinheiro') || message.includes('saldo')) {
      return '💰 Resumo financeiro atualizado! Receita total: R$ 3.500,00 | Gastos: R$ 170,00 | Saldo: R$ 3.330,00. Suas principais categorias de gasto são Alimentação e Utilidades.';
    }
    
    // Default response
    return 'Entendi! Posso ajudá-lo com:\n\n• 📝 Criar e organizar tarefas\n• 💰 Registrar gastos e receitas\n• 🎯 Definir e acompanhar metas\n• 📋 Criar notas estruturadas\n• 📅 Agendar compromissos\n• 🏋️ Criar rotinas de exercícios\n\nO que gostaria de fazer?';
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: processAIResponse(inputText),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>Assistente IA</Text>
        <TouchableOpacity style={styles.clearButton}>
          <Icon name="refresh-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Digite sua mensagem..."
              placeholderTextColor={colors.textSecondary}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: inputText.trim() ? colors.primary : colors.border }
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <Icon 
                name="send" 
                size={20} 
                color={inputText.trim() ? colors.background : colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  clearButton: {
    padding: 8,
    borderRadius: 8,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 120,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
