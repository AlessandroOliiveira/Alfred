import { View } from 'react-native';
import { EmptyState } from '@/components/common/EmptyState';

export default function EstudosScreen() {
  return (
    <View className="flex-1 bg-background">
      <EmptyState
        title="Estudos em construção"
        message="Esta tela permitirá registrar e acompanhar suas sessões de estudo"
      />
    </View>
  );
}
