import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

export default function RootLayout() {
  // NOTE: Notifications disabled for Expo Go
  // For production, use a development build and uncomment:
  // useEffect(() => {
  //   const setupNotifications = async () => {
  //     const notificationService = getNotificationService();
  //     await notificationService.requestPermissions();
  //   };
  //   setupNotifications();
  // }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
