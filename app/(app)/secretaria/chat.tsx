import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Redirect } from 'expo-router';
import { Card } from '@/components/common/Card';
import { useUserStore } from '@/store/useUserStore';
import { useRoutineStore } from '@/store/useRoutineStore';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useStudyStore } from '@/store/useStudyStore';
import { useFiverrStore } from '@/store/useFiverrStore';
import { formatCurrency } from '@/utils/formatters';
import clsx from 'clsx';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatScreen() {
  const user = useUserStore((state) => state.user);
  const routine = useRoutineStore((state) => state.routine);
  const transactions = useFinanceStore((state) => state.transactions);
  const sessions = useStudyStore((state) => state.sessions);
  const tasks = useFiverrStore((state) => state.tasks);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Olá, ${user?.name}! 👋 Sou sua secretária virtual Alfred. Posso te ajudar com informações sobre sua rotina, estudos, finanças e tarefas do Fiverr. O que você gostaria de saber?`,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Rotina
    if (lowerMessage.includes('rotina')) {
      const completed = routine.filter((r) => r.completed).length;
      const total = routine.length;
      const progress = total > 0 ? ((completed / total) * 100).toFixed(0) : '0';
      return `Sua rotina hoje está ${progress}% completa! Você concluiu ${completed} de ${total} atividades. ${
        completed < total ? 'Continue assim!' : 'Parabéns, você completou tudo! 🎉'
      }`;
    }

    // Finanças
    if (lowerMessage.includes('finan') || lowerMessage.includes('dinheiro') || lowerMessage.includes('saldo')) {
      const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const balance = income - expenses;

      return `Seu saldo atual é de ${formatCurrency(balance)}. Você teve ${formatCurrency(income)} em receitas e ${formatCurrency(expenses)} em despesas. ${
        balance >= 0 ? 'Está indo bem! 💰' : 'Cuidado com os gastos! 📉'
      }`;
    }

    // Estudos
    if (lowerMessage.includes('estudo') || lowerMessage.includes('estudar')) {
      const englishMin = sessions.filter((s) => s.type === 'ingles').reduce((sum, s) => sum + s.duration, 0);
      const concursoMin = sessions.filter((s) => s.type === 'concurso').reduce((sum, s) => sum + s.duration, 0);
      const englishH = (englishMin / 60).toFixed(1);
      const concursoH = (concursoMin / 60).toFixed(1);

      return `Você já estudou ${englishH}h de Inglês e ${concursoH}h para o Concurso MP. Continue dedicado! 📚`;
    }

    // Fiverr
    if (lowerMessage.includes('fiverr') || lowerMessage.includes('tarefa') || lowerMessage.includes('trabalho')) {
      const pending = tasks.filter((t) => !t.completed).length;
      const completed = tasks.filter((t) => t.completed).length;

      if (pending === 0) {
        return `Você está em dia! Não tem tarefas pendentes no Fiverr. ${completed > 0 ? `Já completou ${completed} tarefas!` : ''} 🎯`;
      }

      const highPriority = tasks.filter((t) => !t.completed && t.priority === 'high').length;
      return `Você tem ${pending} tarefas pendentes no Fiverr${
        highPriority > 0 ? `, sendo ${highPriority} de alta prioridade` : ''
      }. Vamos lá! 💼`;
    }

    // Resumo geral
    if (lowerMessage.includes('resumo') || lowerMessage.includes('geral') || lowerMessage.includes('tudo')) {
      const routineProgress = routine.length > 0 ? ((routine.filter((r) => r.completed).length / routine.length) * 100).toFixed(0) : '0';
      const balance = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) -
        transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const studyHours = (sessions.reduce((sum, s) => sum + s.duration, 0) / 60).toFixed(1);
      const pendingTasks = tasks.filter((t) => !t.completed).length;

      return `📊 Resumo do dia:\n\n• Rotina: ${routineProgress}% completa\n• Saldo: ${formatCurrency(balance)}\n• Estudos: ${studyHours}h acumuladas\n• Fiverr: ${pendingTasks} tarefas pendentes\n\nContinue assim!`;
    }

    // Motivação
    if (lowerMessage.includes('motiv') || lowerMessage.includes('ânimo') || lowerMessage.includes('desanima')) {
      const motivations = [
        'Você é capaz de alcançar seus objetivos! Continue firme! 💪',
        'Cada pequeno passo conta. Você está no caminho certo! 🚀',
        'Acredite em você! Grandes coisas estão por vir! ⭐',
        'Não desista! O sucesso está logo ali! 🏆',
        'Você está fazendo um ótimo trabalho! Continue assim! 👏',
      ];
      return motivations[Math.floor(Math.random() * motivations.length)];
    }

    // Saudações
    if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('hey')) {
      return `Olá! Como posso ajudar você hoje? Pergunte sobre sua rotina, finanças, estudos ou tarefas! 😊`;
    }

    if (lowerMessage.includes('obrigad') || lowerMessage.includes('valeu')) {
      return `Por nada! Estou aqui para ajudar sempre que precisar! 🤗`;
    }

    // Default
    return `Entendi! Posso te ajudar com informações sobre:\n\n• Rotina diária\n• Finanças e saldo\n• Progresso de estudos\n• Tarefas do Fiverr\n• Resumo geral\n\nO que você gostaria de saber?`;
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(inputText),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 500);
  };

  const quickActions = [
    { label: 'Como está minha rotina?', query: 'Como está minha rotina?' },
    { label: 'Resumo do dia', query: 'Me dá um resumo geral' },
    { label: 'Meu saldo', query: 'Qual é meu saldo financeiro?' },
    { label: 'Tarefas Fiverr', query: 'Quais são minhas tarefas do Fiverr?' },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
      keyboardVerticalOffset={100}
    >
      <View className="flex-1">
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 p-4"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              className={clsx(
                'mb-3',
                message.role === 'user' ? 'items-end' : 'items-start'
              )}
            >
              <View
                className={clsx(
                  'max-w-[80%] rounded-2xl p-4',
                  message.role === 'user'
                    ? 'bg-primary'
                    : 'bg-white border border-border'
                )}
              >
                <Text
                  className={clsx(
                    'text-base',
                    message.role === 'user' ? 'text-white' : 'text-text-primary'
                  )}
                >
                  {message.content}
                </Text>
                <Text
                  className={clsx(
                    'text-xs mt-1',
                    message.role === 'user' ? 'text-white/70' : 'text-text-secondary'
                  )}
                >
                  {message.timestamp.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4 mb-2"
          >
            <View className="flex-row gap-2">
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.label}
                  onPress={() => {
                    setInputText(action.query);
                    setTimeout(handleSend, 100);
                  }}
                  className="bg-white border border-border rounded-full px-4 py-2"
                >
                  <Text className="text-text-primary text-sm">{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {/* Input */}
        <View className="p-4 bg-white border-t border-border">
          <View className="flex-row items-center gap-2">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Digite sua mensagem..."
              placeholderTextColor="#6B7280"
              className="flex-1 bg-background border border-border rounded-full px-4 py-3 text-text-primary"
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputText.trim()}
              className={clsx(
                'w-12 h-12 rounded-full items-center justify-center',
                inputText.trim() ? 'bg-primary' : 'bg-gray-300'
              )}
            >
              <Text className="text-white text-xl">➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
