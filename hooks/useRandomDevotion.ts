import { DEVOTIONS } from '@/constants/devotions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_USED_MORNING = 'USED_DEVOTION_IDS_MORNING';
const KEY_USED_EVENING = 'USED_DEVOTION_IDS_EVENING';
const KEY_USED_DAILY = 'USED_DEVOTION_IDS_DAILY';

const allIds = () => DEVOTIONS.map((d) => d.id);

/**
 * Returns remaining unused IDs from the pool for the given key.
 * Resets and returns all IDs once the pool is exhausted.
 */
const getAvailablePool = async (
  key: string,
  exclude?: string,
): Promise<string[]> => {
  const raw = await AsyncStorage.getItem(key);
  const used: string[] = raw ? JSON.parse(raw) : [];
  let remaining = allIds().filter((id) => !used.includes(id));

  // Reset pool when exhausted
  if (remaining.length === 0) {
    await AsyncStorage.removeItem(key);
    remaining = allIds();
  }

  // Exclude a specific ID (e.g. morning verse when picking evening)
  if (exclude) {
    const filtered = remaining.filter((id) => id !== exclude);
    return filtered.length > 0 ? filtered : remaining;
  }

  return remaining;
};

const markUsed = async (key: string, id: string) => {
  const raw = await AsyncStorage.getItem(key);
  const used: string[] = raw ? JSON.parse(raw) : [];
  if (!used.includes(id)) {
    used.push(id);
    await AsyncStorage.setItem(key, JSON.stringify(used));
  }
};

const pickFrom = (pool: string[]) =>
  pool[Math.floor(Math.random() * pool.length)];

export const getNextMorningDevotion = async () => {
  const pool = await getAvailablePool(KEY_USED_MORNING);
  const id = pickFrom(pool);
  await markUsed(KEY_USED_MORNING, id);
  return DEVOTIONS.find((d) => d.id === id)!;
};

export const getNextEveningDevotion = async (excludeId?: string) => {
  const pool = await getAvailablePool(KEY_USED_EVENING, excludeId);
  const id = pickFrom(pool);
  await markUsed(KEY_USED_EVENING, id);
  return DEVOTIONS.find((d) => d.id === id)!;
};

export const getNextDailyDevotion = async () => {
  const pool = await getAvailablePool(KEY_USED_DAILY);
  const id = pickFrom(pool);
  await markUsed(KEY_USED_DAILY, id);
  return DEVOTIONS.find((d) => d.id === id)!;
};

// Kept for legacy sync usage if needed
export const getRandomDevotion = () => {
  return DEVOTIONS[Math.floor(Math.random() * DEVOTIONS.length)];
};
