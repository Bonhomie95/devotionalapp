import { DEVOTIONS } from '@/constants/devotions';

export const getRandomDevotion = () => {
  const index = Math.floor(Math.random() * DEVOTIONS.length);
  return DEVOTIONS[index];
};
