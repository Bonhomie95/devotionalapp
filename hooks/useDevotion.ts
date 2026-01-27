import { DEVOTIONS } from '@/constants/devotions';

export const useDevotion = () => {
  const index = new Date().getDate() % DEVOTIONS.length;
  return DEVOTIONS[index];
};
