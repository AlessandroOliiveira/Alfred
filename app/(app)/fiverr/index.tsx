import { View } from 'react-native';
import { EmptyState } from '@/components/common/EmptyState';

export default function FiverrScreen() {
  return (
    <View className="flex-1 bg-background">
      <EmptyState
        title="Fiverr em construção"
        message="Esta tela permitirá gerenciar suas tarefas e clientes do Fiverr"
      />
    </View>
  );
}
