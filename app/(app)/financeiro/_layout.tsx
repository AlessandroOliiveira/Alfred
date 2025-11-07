import { Stack } from 'expo-router';

export default function FinanceiroLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Financeiro' }} />
    </Stack>
  );
}
