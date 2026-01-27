import { seedDevotions } from '@/scripts/seedDevotions';

export interface Devotion {
  id: string;
  title: string;
  verse: string;
  reference: string;
  message: string;
}

export const DEVOTIONS: Devotion[] = seedDevotions();
