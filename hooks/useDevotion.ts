import { DEVOTIONS, Devotion } from '@/constants/devotions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const KEY_DEVOTION = 'TODAY_DEVOTION';
const KEY_EXPIRY = 'DEVOTION_EXPIRY';

export const useDevotion = () => {
  const [devotion, setDevotion] = useState<Devotion>(DEVOTIONS[0]);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    initDevotion();
  }, []);

  const initDevotion = async () => {
    const saved = await AsyncStorage.getItem(KEY_DEVOTION);
    const expiry = await AsyncStorage.getItem(KEY_EXPIRY);
    const now = Date.now();

    if (saved && expiry && now < Number(expiry)) {
      setDevotion(JSON.parse(saved));
      setTimeLeft(Number(expiry) - now);
    } else {
      const random = DEVOTIONS[Math.floor(Math.random() * DEVOTIONS.length)];
      const next24h = now + 24 * 60 * 60 * 1000;

      await AsyncStorage.setItem(KEY_DEVOTION, JSON.stringify(random));
      await AsyncStorage.setItem(KEY_EXPIRY, String(next24h));

      setDevotion(random);
      setTimeLeft(24 * 60 * 60 * 1000);
    }
  };

  return { devotion, timeLeft };
};
