import { View } from 'react-native';
import { EmptyState } from '@/components/common/EmptyState';

export default function ChatScreen() {
  return (
    <View className="flex-1 bg-background">
      <EmptyState
        title="Chat com IA em construção"
        message="Esta tela permitirá conversar com sua secretária virtual"
      />
    </View>
  );
}
