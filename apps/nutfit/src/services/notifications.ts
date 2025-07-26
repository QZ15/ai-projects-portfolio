import * as Notifications from 'expo-notifications';
import { Reminder } from '../components/scheduler';

export async function scheduleAll(reminders: Reminder[]) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  for (const rem of reminders) {
    await scheduleReminder(rem);
  }
}

export async function scheduleReminder(reminder: Reminder) {
  const [hour, minute] = reminder.time.split(':').map(Number);
  // expo uses 1-7 for weekday where 1 is Sunday
  const trigger = {
    weekday: ((reminder.day + 1) % 7) + 1,
    hour,
    minute,
    repeats: true,
  } as Notifications.WeeklyTriggerInput;

  await Notifications.scheduleNotificationAsync({
    content: { title: reminder.label, body: `Time for your ${reminder.type}!` },
    trigger,
  });
}
