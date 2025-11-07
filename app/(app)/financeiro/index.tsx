import { View } from 'react-native';
import { EmptyState } from '@/components/common/EmptyState';

export default function FinanceiroScreen() {
  return (
    <View className="flex-1 bg-background">
      <EmptyState
        title="Financeiro em construção"
        message="Esta tela permitirá gerenciar suas receitas e despesas"
      />
    </View>
  );
}
