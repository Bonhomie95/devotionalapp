import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const KEY_PREFIX = 'JOURNAL_';

export const useJournal = (devotionId: string) => {
  const [entry, setEntry] = useState('');
  const [hasEntry, setHasEntry] = useState(false);

  useEffect(() => {
    if (devotionId) loadEntry();
  }, [devotionId]);

  const loadEntry = async () => {
    const saved = await AsyncStorage.getItem(KEY_PREFIX + devotionId);
    if (saved) {
      setEntry(saved);
      setHasEntry(true);
    } else {
      setEntry('');
      setHasEntry(false);
    }
  };

  const saveEntry = async (text: string) => {
    const trimmed = text.trim();
    setEntry(trimmed);
    setHasEntry(trimmed.length > 0);
    if (trimmed.length > 0) {
      await AsyncStorage.setItem(KEY_PREFIX + devotionId, trimmed);
    } else {
      await AsyncStorage.removeItem(KEY_PREFIX + devotionId);
    }
  };

  return { entry, hasEntry, saveEntry };
};
