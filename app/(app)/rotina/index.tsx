import { View, Text } from 'react-native';
import { EmptyState } from '@/components/common/EmptyState';
import { useRoutineStore } from '@/store/useRoutineStore';

export default function RotinaScreen() {
  const routine = useRoutineStore((state) => state.routine);

  return (
    <View className="flex-1 bg-background">
      <EmptyState
        title="Rotina em construção"
        message="Esta tela permitirá visualizar e gerenciar sua rotina diária"
        actionLabel="Voltar"
        onAction={() => {}}
      />
    </View>
  );
}
