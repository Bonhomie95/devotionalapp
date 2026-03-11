import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const KEY_STREAK = 'STREAK_COUNT';
const KEY_LAST_OPEN = 'STREAK_LAST_OPEN';

export const useStreak = () => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    updateStreak();
  }, []);

  const updateStreak = async () => {
    const today = dayjs().format('YYYY-MM-DD');
    const lastOpen = await AsyncStorage.getItem(KEY_LAST_OPEN);
    const savedStreak = await AsyncStorage.getItem(KEY_STREAK);
    const current = savedStreak ? Number(savedStreak) : 0;

    let next = current;

    if (!lastOpen) {
      // First ever open
      next = 1;
    } else if (lastOpen === today) {
      // Already counted today — no change
      next = current;
    } else if (dayjs(today).diff(dayjs(lastOpen), 'day') === 1) {
      // Opened yesterday → keep the streak going
      next = current + 1;
    } else {
      // Missed one or more days → reset
      next = 1;
    }

    await AsyncStorage.setItem(KEY_STREAK, String(next));
    await AsyncStorage.setItem(KEY_LAST_OPEN, today);
    setStreak(next);
  };

  return { streak };
};
