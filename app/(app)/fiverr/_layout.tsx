import { Stack } from 'expo-router';

export default function FiverrLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Fiverr' }} />
    </Stack>
  );
}
