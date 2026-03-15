export type Theme = {
  id: string;
  name: string;
  emoji: string;
  /** Main screen background */
  bg: string;
  /** Card / surface background */
  card: string;
  /** Accent / primary colour (buttons, labels, active tab) */
  primary: string;
  /** Primary body text */
  text: string;
  /** Secondary / muted text */
  subtext: string;
  /** Tab bar background — usually slightly different from bg */
  tabBar: string;
  /** Verse card background — slightly offset from card */
  verseCard: string;
  /** Large decorative quote-mark colour */
  quoteMark: string;
  /** Divider lines */
  divider: string;
  /** 'light' | 'dark' — controls status-bar icon colour */
  statusBar: 'light' | 'dark';
};

export const THEMES: Theme[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    emoji: '🌌',
    bg: '#0F172A',
    card: '#1E293B',
    primary: '#6366F1',
    text: '#F1F5F9',
    subtext: '#94A3B8',
    tabBar: '#111827',
    verseCard: '#1a2540',
    quoteMark: 'rgba(99,102,241,0.15)',
    divider: 'rgba(255,255,255,0.06)',
    statusBar: 'light',
  },
  {
    id: 'ember',
    name: 'Ember',
    emoji: '🔥',
    bg: '#1C0F07',
    card: '#2D1810',
    primary: '#F97316',
    text: '#FEF3C7',
    subtext: '#D97706',
    tabBar: '#150B04',
    verseCard: '#3B1F0E',
    quoteMark: 'rgba(249,115,22,0.15)',
    divider: 'rgba(255,255,255,0.06)',
    statusBar: 'light',
  },
  {
    id: 'forest',
    name: 'Forest',
    emoji: '🌿',
    bg: '#071A0C',
    card: '#0F2916',
    primary: '#22C55E',
    text: '#DCFCE7',
    subtext: '#86EFAC',
    tabBar: '#040F07',
    verseCard: '#163823',
    quoteMark: 'rgba(34,197,94,0.15)',
    divider: 'rgba(255,255,255,0.06)',
    statusBar: 'light',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    emoji: '🌊',
    bg: '#071520',
    card: '#0F2233',
    primary: '#0EA5E9',
    text: '#E0F2FE',
    subtext: '#7DD3FC',
    tabBar: '#040E18',
    verseCard: '#163045',
    quoteMark: 'rgba(14,165,233,0.15)',
    divider: 'rgba(255,255,255,0.06)',
    statusBar: 'light',
  },
  {
    id: 'rose',
    name: 'Rose',
    emoji: '🌸',
    bg: '#1A0B10',
    card: '#2D1020',
    primary: '#EC4899',
    text: '#FCE7F3',
    subtext: '#F9A8D4',
    tabBar: '#110008',
    verseCard: '#3B1429',
    quoteMark: 'rgba(236,72,153,0.15)',
    divider: 'rgba(255,255,255,0.06)',
    statusBar: 'light',
  },
  {
    id: 'parchment',
    name: 'Parchment',
    emoji: '📜',
    bg: '#F5EDD8',
    card: '#EDE0C4',
    primary: '#92400E',
    text: '#1C1410',
    subtext: '#78604A',
    tabBar: '#EDE0C4',
    verseCard: '#E8D9B8',
    quoteMark: 'rgba(146,64,14,0.12)',
    divider: 'rgba(0,0,0,0.08)',
    statusBar: 'dark',
  },
];

export const DEFAULT_THEME_ID = 'midnight';
