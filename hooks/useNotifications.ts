import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import {
  getNextEveningDevotion,
  getNextMorningDevotion,
} from './useRandomDevotion';

const KEY_MORNING_TIME = 'NOTIFICATION_MORNING_TIME';
const KEY_EVENING_TIME = 'NOTIFICATION_EVENING_TIME';

export const DEFAULT_MORNING = { hour: 7, minute: 0 };
export const DEFAULT_EVENING = { hour: 21, minute: 0 };

export const getNotificationTimes = async () => {
  const morningRaw = await AsyncStorage.getItem(KEY_MORNING_TIME);
  const eveningRaw = await AsyncStorage.getItem(KEY_EVENING_TIME);
  return {
    morning: morningRaw ? JSON.parse(morningRaw) : DEFAULT_MORNING,
    evening: eveningRaw ? JSON.parse(eveningRaw) : DEFAULT_EVENING,
  };
};

export const saveNotificationTimes = async (
  morning: { hour: number; minute: number },
  evening: { hour: number; minute: number },
) => {
  await AsyncStorage.setItem(KEY_MORNING_TIME, JSON.stringify(morning));
  await AsyncStorage.setItem(KEY_EVENING_TIME, JSON.stringify(evening));
};

export const scheduleDailyDevotions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return false;

  // ✅ Always wipe ALL scheduled notifications before re-scheduling.
  // This is the fix for the x6 bug — the old key-based guard failed on toggle.
  await Notifications.cancelAllScheduledNotificationsAsync();

  const { morning, evening } = await getNotificationTimes();

  // Pick two different verses
  const morningDevotion = await getNextMorningDevotion();
  const eveningDevotion = await getNextEveningDevotion(morningDevotion.id);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Morning Devotion 🌅',
      body: `${morningDevotion.verse} — ${morningDevotion.reference}`,
      data: { devotion: morningDevotion },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: morning.hour,
      minute: morning.minute,
      repeats: true,
    },
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Evening Reflection 🌙',
      body: `${eveningDevotion.verse} — ${eveningDevotion.reference}`,
      data: { devotion: eveningDevotion },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: evening.hour,
      minute: evening.minute,
      repeats: true,
    },
  });

  return true;
};

export const disableNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
