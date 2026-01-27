import * as Notifications from 'expo-notifications';
import { getRandomDevotion } from './useRandomDevotion';

export const scheduleDailyDevotions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return false;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const morning = getRandomDevotion();
  const night = getRandomDevotion();

  // Morning
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Morning Devotion 🌅',
      body: `${morning.verse} — ${morning.reference}`,
      data: { id: morning.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: 7,
      minute: 0,
      repeats: true,
    },
  });

  // Night
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Evening Reflection 🌙',
      body: `${night.verse} — ${night.reference}`,
      data: { id: night.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: 21,
      minute: 0,
      repeats: true,
    },
  });

  return true;
};

export const disableNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
