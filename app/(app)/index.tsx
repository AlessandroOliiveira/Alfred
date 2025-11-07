import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/common/Card';
import { useUserStore } from '@/store/useUserStore';
import { useRoutineStore } from '@/store/useRoutineStore';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useStudyStore } from '@/store/useStudyStore';
import { useFiverrStore } from '@/store/useFiverrStore';
import { formatCurrency, formatDuration } from '@/utils/formatters';

export default function DashboardScreen() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const routine = useRoutineStore((state) => state.routine);
  const financialSummary = useFinanceStore((state) => state.getSummary());
  const studyProgress = useStudyStore((state) => state.getProgress());
  const pendingTasks = useFiverrStore((state) => state.getPendingTasks());

  const completedRoutine = routine.filter((r) => r.completed).length;
  const routineProgress = routine.length > 0 ? (completedRoutine / routine.length) * 100 : 0;

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* Welcome Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-text-primary">
            Olá, {user?.name}!
          </Text>
          <Text className="text-text-secondary mt-1">
            Veja como está seu dia
          </Text>
        </View>

        {/* Rotina Card */}
        <Card className="mb-4" onPress={() => router.push('/rotina')}>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold text-text-primary">
              Rotina do Dia
            </Text>
            <Text className="text-primary font-semibold">
              {completedRoutine}/{routine.length}
            </Text>
          </View>
          <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-primary"
              style={{ width: `${routineProgress}%` }}
            />
          </View>
          <Text className="text-text-secondary text-sm mt-2">
            {routineProgress.toFixed(0)}% concluído
          </Text>
        </Card>

        {/* Financial Card */}
        <Card className="mb-4" onPress={() => router.push('/financeiro')}>
          <Text className="text-lg font-bold text-text-primary mb-2">
            Saldo Financeiro
          </Text>
          <Text
            className={`text-3xl font-bold ${
              financialSummary.balance >= 0 ? 'text-secondary' : 'text-danger'
            }`}
          >
            {formatCurrency(financialSummary.balance)}
          </Text>
          <View className="flex-row justify-between mt-3">
            <View>
              <Text className="text-text-secondary text-sm">Receitas</Text>
              <Text className="text-secondary font-semibold">
                {formatCurrency(financialSummary.totalIncome)}
              </Text>
            </View>
            <View>
              <Text className="text-text-secondary text-sm">Despesas</Text>
              <Text className="text-danger font-semibold">
                {formatCurrency(financialSummary.totalExpenses)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Study Progress Card */}
        <Card className="mb-4" onPress={() => router.push('/estudos')}>
          <Text className="text-lg font-bold text-text-primary mb-3">
            Progresso de Estudos
          </Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-text-secondary">Inglês</Text>
            <Text className="text-primary font-semibold">
              {studyProgress.totalEnglishHours.toFixed(1)}h
            </Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-text-secondary">Concurso MP</Text>
            <Text className="text-primary font-semibold">
              {studyProgress.totalMPHours.toFixed(1)}h
            </Text>
          </View>
          <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-secondary"
              style={{
                width: `${Math.min(
                  (studyProgress.currentWeekProgress / studyProgress.weeklyGoal) * 100,
                  100
                )}%`,
              }}
            />
          </View>
          <Text className="text-text-secondary text-sm mt-2">
            Meta semanal: {studyProgress.currentWeekProgress.toFixed(1)}h /
            {studyProgress.weeklyGoal}h
          </Text>
        </Card>

        {/* Fiverr Tasks Card */}
        <Card className="mb-4" onPress={() => router.push('/fiverr')}>
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-lg font-bold text-text-primary">
                Tarefas Fiverr
              </Text>
              <Text className="text-text-secondary mt-1">
                {pendingTasks.length} tarefas pendentes
              </Text>
            </View>
            {pendingTasks.length > 0 && (
              <View className="bg-danger rounded-full w-8 h-8 items-center justify-center">
                <Text className="text-white font-bold">
                  {pendingTasks.length}
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Quick Actions */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-text-primary mb-3">
            Ações Rápidas
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <TouchableOpacity
              className="bg-primary px-4 py-3 rounded-lg flex-1 min-w-[45%]"
              onPress={() => router.push('/(app)/secretaria/chat')}
            >
              <Text className="text-white font-semibold text-center">
                Chat com IA
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-secondary px-4 py-3 rounded-lg flex-1 min-w-[45%]"
              onPress={() => router.push('/(app)/rotina')}
            >
              <Text className="text-white font-semibold text-center">
                Ver Rotina
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-accent px-4 py-3 rounded-lg flex-1 min-w-[45%]"
              onPress={() => router.push('/(app)/financeiro')}
            >
              <Text className="text-white font-semibold text-center">
                Adicionar Gasto
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-primary-dark px-4 py-3 rounded-lg flex-1 min-w-[45%]"
              onPress={() => router.push('/(app)/estudos')}
            >
              <Text className="text-white font-semibold text-center">
                Registrar Estudo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
