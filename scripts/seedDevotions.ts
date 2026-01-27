import { Devotion } from '@/constants/devotions';

export const seedDevotions = (): Devotion[] => [
  {
    id: '1',
    title: 'Strength for Today',
    verse: 'I can do all things through Christ who strengthens me.',
    reference: 'Philippians 4:13',
    message:
      'Whatever challenge stands before you today, remember your strength does not come from yourself alone.',
  },
  {
    id: '2',
    title: 'Peace Over Fear',
    verse: 'For God has not given us a spirit of fear...',
    reference: '2 Timothy 1:7',
    message: 'Fear tries to steal your peace, but faith restores your mind.',
  },
  {
    id: '3',
    title: 'Trust the Process',
    verse: 'Trust in the Lord with all your heart.',
    reference: 'Proverbs 3:5',
    message:
      'Even when you don’t understand, God is working behind the scenes.',
  },
];
