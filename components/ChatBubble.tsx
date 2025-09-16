
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { ChatMessage } from '../types';

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.isUser;

  return (
    <View style={[
      commonStyles.chatBubble,
      isUser ? commonStyles.userBubble : commonStyles.aiBubble,
    ]}>
      <Text style={[
        styles.text,
        { color: isUser ? colors.background : colors.text }
      ]}>
        {message.content}
      </Text>
      <Text style={[
        styles.timestamp,
        { color: isUser ? colors.background + '80' : colors.textSecondary }
      ]}>
        {message.timestamp.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
});
