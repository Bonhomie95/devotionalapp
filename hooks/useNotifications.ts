import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { getRandomDevotion } from './useRandomDevotion';

const KEY_IDS = 'SCHEDULED_NOTIFICATION_IDS';

export const scheduleDailyDevotions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return false;

  // Prevent duplicates
  const existing = await AsyncStorage.getItem(KEY_IDS);
  if (existing) return true;

  const morning = getRandomDevotion();
  const night = getRandomDevotion();

  const id1 = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Morning Devotion 🌅',
      body: `${morning.verse} — ${morning.reference}`,
      data: { devotion: morning },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: 7,
      minute: 0,
      repeats: true,
    },
  });

  const id2 = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Evening Reflection 🌙',
      body: `${night.verse} — ${night.reference}`,
      data: { devotion: night },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: 21,
      minute: 0,
      repeats: true,
    },
  });

  await AsyncStorage.setItem(KEY_IDS, JSON.stringify([id1, id2]));
  return true;
};

export const disableNotifications = async () => {
  const ids = await AsyncStorage.getItem(KEY_IDS);
  if (ids) {
    const parsed = JSON.parse(ids);
    await Promise.all(
      parsed.map((id: string) =>
        Notifications.cancelScheduledNotificationAsync(id),
      ),
    );
    await AsyncStorage.removeItem(KEY_IDS);
  }
};
