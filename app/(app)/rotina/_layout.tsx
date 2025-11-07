import { Stack } from 'expo-router';

export default function RotinaLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Rotina Diária' }} />
    </Stack>
  );
}
