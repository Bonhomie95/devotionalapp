import * as Notifications from 'expo-notifications';
import { getRandomDevotion } from './useRandomDevotion';

export const scheduleDailyDevotions = async () => {
  await Notifications.requestPermissionsAsync();

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
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 7,
      minute: 0,
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
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 21,
      minute: 0,
    },
  });
};
