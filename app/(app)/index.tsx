import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { FAB } from '@/components/common/FAB';
import { useUserStore } from '@/store/useUserStore';
import { useRoutineStore } from '@/store/useRoutineStore';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useStudyStore } from '@/store/useStudyStore';
import { useFiverrStore } from '@/store/useFiverrStore';
import { usePlanningStore } from '@/store/usePlanningStore';
import { formatCurrency } from '@/utils/formatters';
import clsx from 'clsx';

export default function DashboardScreen() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

  // Protect route - redirect to login if not authenticated
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  const routine = useRoutineStore((state) => state.routine);
  const transactions = useFinanceStore((state) => state.transactions);
  const sessions = useStudyStore((state) => state.sessions);
  const tasks = useFiverrStore((state) => state.tasks);
  const checklists = usePlanningStore((state) => state.checklists);
  const updateChecklist = usePlanningStore((state) => state.updateChecklist);
  const addChecklist = usePlanningStore((state) => state.addChecklist);

  // Calculate derived values in the component
  const completedRoutine = routine.filter((r) => r.completed).length;
  const routineProgress = routine.length > 0 ? (completedRoutine / routine.length) * 100 : 0;

  // Financial summary
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const financialSummary = {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
  };

  // Study progress
  const totalEnglishMinutes = sessions
    .filter((s) => s.type === 'ingles')
    .reduce((sum, s) => sum + s.duration, 0);
  const totalMPMinutes = sessions
    .filter((s) => s.type === 'concurso')
    .reduce((sum, s) => sum + s.duration, 0);

  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const currentWeekMinutes = sessions
    .filter((s) => new Date(s.date) >= startOfWeek)
    .reduce((sum, s) => sum + s.duration, 0);

  const studyProgress = {
    totalEnglishHours: totalEnglishMinutes / 60,
    totalMPHours: totalMPMinutes / 60,
    weeklyGoal: 20,
    currentWeekProgress: currentWeekMinutes / 60,
  };

  // Pending tasks
  const pendingTasks = tasks.filter((t) => !t.completed);

  // Today's planning checklist
  const today = new Date().toISOString().split('T')[0];
  let todayChecklist = checklists.find((c) => c.date.startsWith(today));

  if (!todayChecklist && user) {
    const { generateId, getCurrentDate } = require('@/utils/helpers');
    todayChecklist = {
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
    addChecklist(todayChecklist);
  }

  // Weekly focus
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

  const toggleCheck = (field: string) => {
    if (todayChecklist) {
      const { getCurrentDate } = require('@/utils/helpers');
      updateChecklist(todayChecklist.id, {
        [field]: !todayChecklist[field],
        updatedAt: getCurrentDate(),
      });
    }
  };

  const incrementCount = (field: string) => {
    if (todayChecklist) {
      const { getCurrentDate } = require('@/utils/helpers');
      updateChecklist(todayChecklist.id, {
        [field]: (todayChecklist[field] || 0) + 1,
        updatedAt: getCurrentDate(),
      });
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            clearUser();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="p-4">
        {/* Welcome Header */}
        <View className="mb-5">
          <Text className="text-3xl font-bold text-text-primary">
            Olá, {user?.name}! 👋
          </Text>
          <Text className="text-text-secondary mt-1">
            {todayWeek.day} - Seu resumo do dia
          </Text>
        </View>

        {/* Today's Focus */}
        <Card className="mb-4 bg-gradient-to-br from-primary to-primary-dark">
          <View className="flex-row items-center mb-2">
            <Text className="text-4xl mr-3">{todayWeek.emoji}</Text>
            <View className="flex-1">
              <Text className="text-white text-xs font-semibold uppercase tracking-wide opacity-80">
                Foco de Hoje
              </Text>
              <Text className="text-white text-xl font-bold">
                {todayWeek.day}
              </Text>
            </View>
          </View>
          <View className="mt-2">
            {todayWeek.tasks.map((task, idx) => (
              <Text key={idx} className="text-white opacity-90 text-sm">
                • {task}
              </Text>
            ))}
          </View>
        </Card>

        {/* Daily Checklist Mini */}
        <Card className="mb-4">
          <Text className="text-lg font-bold text-text-primary mb-3">
            ✅ Checklist Diário
          </Text>

          <View className="flex-row gap-3 mb-3">
            <View className="flex-1">
              <Text className="text-text-secondary text-xs mb-1">Vendas</Text>
              <View className="flex-row items-center">
                <Text className="text-2xl font-bold text-primary mr-2">
                  {todayChecklist?.salesCount || 0}
                </Text>
                <TouchableOpacity
                  onPress={() => incrementCount('salesCount')}
                  className="bg-primary rounded-full w-7 h-7 items-center justify-center"
                >
                  <Text className="text-white font-bold text-sm">+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-1">
              <Text className="text-text-secondary text-xs mb-1">Buyer Requests</Text>
              <View className="flex-row items-center">
                <Text className="text-2xl font-bold text-accent mr-2">
                  {todayChecklist?.buyerRequestsResponded || 0}
                </Text>
                <TouchableOpacity
                  onPress={() => incrementCount('buyerRequestsResponded')}
                  className="bg-accent rounded-full w-7 h-7 items-center justify-center"
                >
                  <Text className="text-white font-bold text-sm">+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-2">
            {[
              { key: 'clientMessagesAnswered', label: 'Mensagens', icon: '💬' },
              { key: 'projectsTested', label: 'Testes', icon: '📱' },
              { key: 'readmeUpdated', label: 'README', icon: '📝' },
              { key: 'reviewRequested', label: 'Review', icon: '⭐' },
            ].map((item) => (
              <TouchableOpacity
                key={item.key}
                onPress={() => toggleCheck(item.key)}
                className={clsx(
                  'flex-row items-center px-3 py-2 rounded-lg border',
                  todayChecklist?.[item.key]
                    ? 'bg-secondary/10 border-secondary'
                    : 'bg-gray-50 border-gray-200'
                )}
              >
                <Text className="mr-1">{item.icon}</Text>
                <Text
                  className={clsx(
                    'text-xs font-semibold',
                    todayChecklist?.[item.key] ? 'text-secondary' : 'text-text-secondary'
                  )}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Summary Grid */}
        <View className="flex-row gap-3 mb-4">
          {/* Rotina */}
          <Card className="flex-1" onPress={() => router.push('/rotina')}>
            <Text className="text-text-secondary text-xs mb-2">📋 Rotina</Text>
            <Text className="text-2xl font-bold text-primary mb-1">
              {completedRoutine}/{routine.length}
            </Text>
            <View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-primary"
                style={{ width: `${routineProgress}%` }}
              />
            </View>
          </Card>

          {/* Estudos */}
          <Card className="flex-1" onPress={() => router.push('/estudos')}>
            <Text className="text-text-secondary text-xs mb-2">📚 Estudos</Text>
            <Text className="text-2xl font-bold text-secondary mb-1">
              {studyProgress.currentWeekProgress.toFixed(1)}h
            </Text>
            <Text className="text-text-secondary text-xs">
              de {studyProgress.weeklyGoal}h
            </Text>
          </Card>
        </View>

        {/* Financial Card */}
        <Card className="mb-4" onPress={() => router.push('/financeiro')}>
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-lg font-bold text-text-primary">
              💰 Saldo Financeiro
            </Text>
            <Text
              className={clsx(
                'text-2xl font-bold',
                financialSummary.balance >= 0 ? 'text-secondary' : 'text-danger'
              )}
            >
              {formatCurrency(financialSummary.balance)}
            </Text>
          </View>
          <View className="flex-row gap-3">
            <View className="flex-1 bg-secondary/10 rounded-lg p-2">
              <Text className="text-text-secondary text-xs mb-1">Receitas</Text>
              <Text className="text-secondary font-bold">
                {formatCurrency(financialSummary.totalIncome)}
              </Text>
            </View>
            <View className="flex-1 bg-danger/10 rounded-lg p-2">
              <Text className="text-text-secondary text-xs mb-1">Despesas</Text>
              <Text className="text-danger font-bold">
                {formatCurrency(financialSummary.totalExpenses)}
              </Text>
            </View>
          </View>
        </Card>


        {/* Fiverr Tasks Card */}
        <Card className="mb-4" onPress={() => router.push('/fiverr')}>
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-lg font-bold text-text-primary mb-1">
                💼 Tarefas Fiverr
              </Text>
              <Text className="text-text-secondary">
                {pendingTasks.length} pendente{pendingTasks.length !== 1 ? 's' : ''}
              </Text>
            </View>
            {pendingTasks.length > 0 && (
              <View className="bg-accent rounded-full w-12 h-12 items-center justify-center">
                <Text className="text-white font-bold text-xl">
                  {pendingTasks.length}
                </Text>
              </View>
            )}
          </View>
          {pendingTasks.length > 0 && (
            <View className="mt-3 pt-3 border-t border-gray-200">
              {pendingTasks.slice(0, 2).map((task) => (
                <View key={task.id} className="flex-row items-center mb-2">
                  <View
                    className={clsx(
                      'w-2 h-2 rounded-full mr-2',
                      task.priority === 'high'
                        ? 'bg-danger'
                        : task.priority === 'medium'
                        ? 'bg-accent'
                        : 'bg-secondary'
                    )}
                  />
                  <Text className="text-text-primary text-sm flex-1" numberOfLines={1}>
                    {task.title}
                  </Text>
                </View>
              ))}
              {pendingTasks.length > 2 && (
                <Text className="text-text-secondary text-xs mt-1">
                  +{pendingTasks.length - 2} mais...
                </Text>
              )}
            </View>
          )}
        </Card>

        {/* Logout Button */}
        <View className="mt-8 mb-4">
          <Button
            title="Sair"
            onPress={handleLogout}
            variant="outline"
          />
        </View>
        </View>
      </ScrollView>

      <FAB />
    </View>
  );
}
