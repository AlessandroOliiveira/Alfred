import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { Redirect } from 'expo-router';
import { Card } from '@/components/common/Card';
import { FAB } from '@/components/common/FAB';
import { useUserStore } from '@/store/useUserStore';
import { usePlanningStore } from '@/store/usePlanningStore';
import { generateId, getCurrentDate } from '@/utils/helpers';
import clsx from 'clsx';

export default function PlanejamentoScreen() {
  const user = useUserStore((state) => state.user);
  const checklists = usePlanningStore((state) => state.checklists);
  const addChecklist = usePlanningStore((state) => state.addChecklist);
  const updateChecklist = usePlanningStore((state) => state.updateChecklist);

  const [todayChecklist, setTodayChecklist] = useState<any>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    let existing = checklists.find((c) => c.date.startsWith(today));
    
    if (!existing && user) {
      existing = {
        id: generateId(),
        date: getCurrentDate(),
        salesCount: 0,
        buyerRequestsResponded: 0,
        clientMessagesAnswered: false,
        projectsTested: false,
        readmeUpdated: false,
        reviewRequested: false,
        userId: user.id,
        createdAt: getCurrentDate(),
        updatedAt: getCurrentDate(),
      };
      addChecklist(existing);
    }
    setTodayChecklist(existing);
  }, [checklists, user]);

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  const weekDays = [
    { day: 'Segunda', emoji: '☀️', tasks: ['Planejamento semanal', 'Buyer requests', 'Projeto dummy'] },
    { day: 'Terça', emoji: '🎯', tasks: ['Buyer requests', 'Criar gigs Fiverr', 'Vídeo + prints'] },
    { day: 'Quarta', emoji: '💼', tasks: ['Responder mensagens', 'Dashboard/Admin', 'LinkedIn'] },
    { day: 'Quinta', emoji: '🚀', tasks: ['Prospectar leads', 'Entregas Fiverr', 'Portfolio'] },
    { day: 'Sexta', emoji: '💰', tasks: ['Buyer requests', 'SEO Fiverr', 'Cursos IA'] },
    { day: 'Sábado', emoji: '🔨', tasks: ['Projeto próprio', 'Deploy', 'Networking'] },
    { day: 'Domingo', emoji: '🎉', tasks: ['Revisar conquistas', 'Descanso', 'Planejar'] },
  ];

  const currentDayIndex = new Date().getDay();
  const todayWeek = weekDays[currentDayIndex === 0 ? 6 : currentDayIndex - 1];

  const weeklyGoals = [
    { week: 1, title: 'Portfolio Express', gigs: 0, sales: '0', color: 'bg-blue-500' },
    { week: 2, title: 'Fiverr Setup', gigs: 3, sales: '0', color: 'bg-purple-500' },
    { week: 3, title: 'Primeiras Vendas', gigs: 3, sales: '3-5', color: 'bg-green-500' },
    { week: 4, title: 'Consolidação', gigs: 3, sales: '8-10', color: 'bg-yellow-500' },
  ];

  const toggleCheck = (field: string) => {
    if (todayChecklist) {
      updateChecklist(todayChecklist.id, {
        [field]: !todayChecklist[field],
        updatedAt: getCurrentDate(),
      });
    }
  };

  const incrementCount = (field: string) => {
    if (todayChecklist) {
      updateChecklist(todayChecklist.id, {
        [field]: (todayChecklist[field] || 0) + 1,
        updatedAt: getCurrentDate(),
      });
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="p-5">
          {/* Header */}
          <View className="mb-6 mt-2">
            <Text className="text-3xl font-bold text-text-primary">
              Plano 4 Semanas 🚀
            </Text>
            <Text className="text-text-secondary mt-1 text-base">
              Web Dev Freelancer • Fiverr + IA
            </Text>
          </View>

          {/* Today's Focus */}
          <Card className="mb-5 bg-gradient-to-br from-primary to-primary-dark">
            <View className="flex-row items-center mb-3">
              <Text className="text-4xl mr-3">{todayWeek.emoji}</Text>
              <View className="flex-1">
                <Text className="text-white text-xs font-semibold uppercase tracking-wide opacity-80">
                  Foco de Hoje
                </Text>
                <Text className="text-white text-2xl font-bold">
                  {todayWeek.day}
                </Text>
              </View>
            </View>
            <View className="mt-2 space-y-1">
              {todayWeek.tasks.map((task, idx) => (
                <View key={idx} className="flex-row items-center">
                  <Text className="text-white opacity-90 text-sm">• {task}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Daily Checklist - Interactive */}
          <View className="mb-5">
            <Text className="text-xl font-bold text-text-primary mb-3">
              ✅ Checklist Diário
            </Text>

            <Card className="mb-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-text-primary font-semibold">Vendas hoje</Text>
                  <Text className="text-text-secondary text-sm">Quantas vendas fechou?</Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl font-bold text-primary">
                    {todayChecklist?.salesCount || 0}
                  </Text>
                  <TouchableOpacity
                    onPress={() => incrementCount('salesCount')}
                    className="bg-primary rounded-full w-8 h-8 items-center justify-center"
                  >
                    <Text className="text-white font-bold">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>

            <Card className="mb-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-text-primary font-semibold">Buyer Requests</Text>
                  <Text className="text-text-secondary text-sm">Respondidas hoje</Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl font-bold text-accent">
                    {todayChecklist?.buyerRequestsResponded || 0}
                  </Text>
                  <TouchableOpacity
                    onPress={() => incrementCount('buyerRequestsResponded')}
                    className="bg-accent rounded-full w-8 h-8 items-center justify-center"
                  >
                    <Text className="text-white font-bold">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>

            {[
              { key: 'clientMessagesAnswered', label: 'Mensagens respondidas', icon: '💬' },
              { key: 'projectsTested', label: 'Projetos testados (mobile/desktop)', icon: '📱' },
              { key: 'readmeUpdated', label: 'README atualizado', icon: '📝' },
              { key: 'reviewRequested', label: 'Review solicitado', icon: '⭐' },
            ].map((item) => (
              <TouchableOpacity
                key={item.key}
                onPress={() => toggleCheck(item.key)}
                activeOpacity={0.7}
              >
                <Card className="mb-2">
                  <View className="flex-row items-center">
                    <View
                      className={clsx(
                        'w-6 h-6 rounded-lg border-2 mr-3 items-center justify-center',
                        todayChecklist?.[item.key]
                          ? 'bg-secondary border-secondary'
                          : 'border-gray-300'
                      )}
                    >
                      {todayChecklist?.[item.key] && (
                        <Text className="text-white text-xs font-bold">✓</Text>
                      )}
                    </View>
                    <Text className="text-text-primary flex-1">{item.label}</Text>
                    <Text className="text-2xl">{item.icon}</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          {/* Weekly Timeline */}
          <View className="mb-5">
            <Text className="text-xl font-bold text-text-primary mb-3">
              📅 Rotina Semanal
            </Text>
            <View className="space-y-2">
              {weekDays.map((day, idx) => {
                const isToday = idx === (currentDayIndex === 0 ? 6 : currentDayIndex - 1);
                return (
                  <Card
                    key={idx}
                    variant={isToday ? 'default' : 'flat'}
                    className={clsx(isToday && 'border-2 border-primary')}
                  >
                    <View className="flex-row items-center">
                      <Text className="text-3xl mr-3">{day.emoji}</Text>
                      <View className="flex-1">
                        <Text className={clsx(
                          'font-bold',
                          isToday ? 'text-primary text-base' : 'text-text-primary text-sm'
                        )}>
                          {day.day}
                        </Text>
                        <Text className="text-text-secondary text-xs">
                          {day.tasks.join(' • ')}
                        </Text>
                      </View>
                      {isToday && (
                        <View className="bg-primary px-2 py-1 rounded-full">
                          <Text className="text-white text-xs font-bold">HOJE</Text>
                        </View>
                      )}
                    </View>
                  </Card>
                );
              })}
            </View>
          </View>

          {/* 4-Week Goals */}
          <View className="mb-5">
            <Text className="text-xl font-bold text-text-primary mb-3">
              🎯 Metas 4 Semanas
            </Text>
            <View className="space-y-3">
              {weeklyGoals.map((goal) => (
                <Card key={goal.week}>
                  <View className="flex-row items-center mb-2">
                    <View className={clsx('w-10 h-10 rounded-full items-center justify-center mr-3', goal.color)}>
                      <Text className="text-white font-bold text-lg">{goal.week}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-text-primary font-bold">{goal.title}</Text>
                      <Text className="text-text-secondary text-sm">
                        Semana {goal.week} do plano
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row justify-around mt-2 pt-2 border-t border-gray-200">
                    <View className="items-center">
                      <Text className="text-text-secondary text-xs">Gigs</Text>
                      <Text className="text-primary font-bold">{goal.gigs}</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-text-secondary text-xs">Vendas</Text>
                      <Text className="text-secondary font-bold">{goal.sales}</Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </View>

          {/* Golden Rules */}
          <Card variant="outlined" className="border-accent">
            <Text className="text-lg font-bold text-text-primary mb-3">
              🚨 Regras de Ouro
            </Text>
            {[
              'IA acelera, mas você revisa tudo',
              'Lighthouse > 90 sempre',
              'Responda em < 2h',
              'Teste mobile + desktop',
            ].map((rule, idx) => (
              <View key={idx} className="flex-row items-start mb-2">
                <Text className="text-accent mr-2">•</Text>
                <Text className="text-text-primary flex-1">{rule}</Text>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>

      <FAB />
    </View>
  );
}
