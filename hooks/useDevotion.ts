import { DEVOTIONS, Devotion } from '@/constants/devotions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { getNextDailyDevotion } from './useRandomDevotion';

const KEY_DEVOTION = 'TODAY_DEVOTION';
const KEY_EXPIRY = 'DEVOTION_EXPIRY';
const KEY_OVERRIDE = 'OVERRIDE_DEVOTION';

export const useDevotion = () => {
  const [devotion, setDevotion] = useState<Devotion>(DEVOTIONS[0]);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    initDevotion();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateCountdown = async () => {
    const expiry = await AsyncStorage.getItem(KEY_EXPIRY);
    if (expiry) {
      const left = Number(expiry) - Date.now();
      setTimeLeft(left > 0 ? left : 0);
    }
  };

  const initDevotion = async () => {
    // 1. If app was opened from a notification tap, show that devotion
    const override = await AsyncStorage.getItem(KEY_OVERRIDE);
    if (override) {
      setDevotion(JSON.parse(override));
      await AsyncStorage.removeItem(KEY_OVERRIDE);
      return;
    }

    // 2. Show today's locked devotion if still valid
    const saved = await AsyncStorage.getItem(KEY_DEVOTION);
    const expiry = await AsyncStorage.getItem(KEY_EXPIRY);
    const now = Date.now();

    if (saved && expiry && now < Number(expiry)) {
      setDevotion(JSON.parse(saved));
      setTimeLeft(Number(expiry) - now);
      return;
    }

    // 3. Pick a fresh devotion from the non-repeating pool
    const next = await getNextDailyDevotion();
    const next24h = now + 24 * 60 * 60 * 1000;

    await AsyncStorage.setItem(KEY_DEVOTION, JSON.stringify(next));
    await AsyncStorage.setItem(KEY_EXPIRY, String(next24h));

    setDevotion(next);
    setTimeLeft(24 * 60 * 60 * 1000);
  };

  return { devotion, timeLeft };
};
