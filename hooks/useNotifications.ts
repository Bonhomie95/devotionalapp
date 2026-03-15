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

/**
 * How many days of notifications to keep scheduled ahead.
 * 28 days × 2 slots = 56 notifications — safely under iOS's 64-notification limit.
 */
const DAYS_AHEAD = 28;

/** Refill when fewer than this many DAYS of future notifications remain. */
const REFILL_THRESHOLD_DAYS = 7;

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

/**
 * Schedule one morning + one evening notification for a given calendar date.
 * Each gets a unique verse from the non-repeating pools.
 */
const scheduleDay = async (
  date: Date,
  morning: { hour: number; minute: number },
  evening: { hour: number; minute: number },
  now: number,
) => {
  const morningDate = new Date(date);
  morningDate.setHours(morning.hour, morning.minute, 0, 0);

  const eveningDate = new Date(date);
  eveningDate.setHours(evening.hour, evening.minute, 0, 0);

  // Pick a unique verse for each slot
  const morningDevotion = await getNextMorningDevotion();
  const eveningDevotion = await getNextEveningDevotion(morningDevotion.id);

  // Only schedule future times (skip today's slots that have already passed)
  if (morningDate.getTime() > now) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Morning Devotion 🌅',
        body: `${morningDevotion.verse} — ${morningDevotion.reference}`,
        data: { devotion: morningDevotion },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: morningDate,
      },
    });
  }

  if (eveningDate.getTime() > now) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Evening Reflection 🌙',
        body: `${eveningDevotion.verse} — ${eveningDevotion.reference}`,
        data: { devotion: eveningDevotion },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: eveningDate,
      },
    });
  }
};

/**
 * Cancel everything and schedule fresh one-off notifications for the next
 * DAYS_AHEAD days. Each slot gets a unique verse — no repeats.
 *
 * Uses date-based (non-repeating) triggers so the OS fires each notification
 * exactly once, eliminating the old "×6" duplication bug caused by stacked
 * `repeats: true` CALENDAR triggers.
 */
export const scheduleDailyDevotions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return false;

  // Wipe everything before rebuilding to avoid duplicates
  await Notifications.cancelAllScheduledNotificationsAsync();

  const { morning, evening } = await getNotificationTimes();
  const now = Date.now();
  const today = new Date();

  for (let day = 0; day < DAYS_AHEAD; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    await scheduleDay(date, morning, evening, now);
  }

  return true;
};

/**
 * Call this on every app open. If fewer than REFILL_THRESHOLD_DAYS worth of
 * notifications remain, rebuild the full DAYS_AHEAD window so the user is
 * never left without upcoming reminders.
 */
export const topUpNotificationsIfNeeded = async () => {
  // Only run if notifications are enabled
  const enabled = await AsyncStorage.getItem('NOTIFICATIONS_ENABLED');
  if (enabled !== 'true') return;

  const existing = await Notifications.getAllScheduledNotificationsAsync();
  const now = Date.now();

  // Count future notifications (2 per day, morning + evening)
  const futureCount = existing.filter((n) => {
    const trigger = n.trigger as any;
    const ts = trigger?.value
      ? trigger.value * 1000          // seconds → ms (iOS)
      : trigger?.date
        ? new Date(trigger.date).getTime()
        : Infinity;
    return ts > now;
  }).length;

  if (futureCount < REFILL_THRESHOLD_DAYS * 2) {
    await scheduleDailyDevotions();
  }
};

export const disableNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
