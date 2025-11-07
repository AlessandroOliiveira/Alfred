import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6366F1',
      });
    }

    return true;
  }

  async scheduleRoutineNotification(
    routineId: string,
    title: string,
    time: string
  ): Promise<string> {
    const [hours, minutes] = time.split(':').map(Number);
    const trigger = new Date();
    trigger.setHours(hours);
    trigger.setMinutes(minutes - 15); // 15 minutes before
    trigger.setSeconds(0);

    // If time has passed today, schedule for tomorrow
    if (trigger < new Date()) {
      trigger.setDate(trigger.getDate() + 1);
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Lembrete de Rotina',
        body: `${title} começa em 15 minutos`,
        data: { routineId },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: trigger,
      },
    });

    return notificationId;
  }

  async scheduleFiverrDeadlineNotification(
    taskId: string,
    title: string,
    deadline: string
  ): Promise<string> {
    const deadlineDate = new Date(deadline);
    const notificationTime = new Date(
      deadlineDate.getTime() - 24 * 60 * 60 * 1000
    ); // 1 day before

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Prazo do Fiverr se aproximando!',
        body: `"${title}" vence amanhã`,
        data: { taskId },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: notificationTime,
      },
    });

    return notificationId;
  }

  async scheduleStudyReminder(hour: number): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hora de estudar!',
        body: 'Não esqueça da sua meta diária de estudos',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute: 0,
      },
    });

    return notificationId;
  }

  async sendImmediateNotification(title: string, body: string): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null,
    });
  }

  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async getAllScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }
}

// Singleton instance
let notificationService: NotificationService | null = null;

export function getNotificationService(): NotificationService {
  if (!notificationService) {
    notificationService = new NotificationService();
  }
  return notificationService;
}
