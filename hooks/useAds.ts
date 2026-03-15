import mobileAds, {
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';

mobileAds().initialize();

export const bannerUnitId: string = __DEV__
  ? TestIds.BANNER
  : process.env.ADMOB_BANNER_ID || TestIds.BANNER;

const interstitial = InterstitialAd.createForAdRequest(
  __DEV__
    ? TestIds.INTERSTITIAL
    : process.env.ADMOB_INTERSTITIAL_ID || TestIds.INTERSTITIAL,
  { requestNonPersonalizedAdsOnly: true },
);

// ─────────────────────────────────────────────────────────────────────────────
// AD FREQUENCY CONTROL
// Minimum time (in milliseconds) that must pass between two interstitial ads.
//
// Current setting: 2 minutes (2 * 60 * 1000 = 120 000 ms)
//
// To change the interval, edit the number below:
//   5 minutes  →  5 * 60 * 1000
//   10 minutes →  10 * 60 * 1000
//   30 minutes →  30 * 60 * 1000
// ─────────────────────────────────────────────────────────────────────────────
const INTERSTITIAL_COOLDOWN_MS = 2 * 60 * 1000; // ← change this value

let lastShown = 0;

export const loadInterstitial = () => interstitial.load();

/**
 * Call this whenever you want to *offer* to show an interstitial.
 * The ad will only actually display if:
 *   1. An ad has been loaded and is ready
 *   2. At least INTERSTITIAL_COOLDOWN_MS has passed since the last showing
 *
 * Good trigger points: tab focus, after saving a journal entry, after sharing.
 */
export const showInterstitialIfReady = () => {
  const now = Date.now();
  if (interstitial.loaded && now - lastShown > INTERSTITIAL_COOLDOWN_MS) {
    interstitial.show();
    lastShown = now;
    // Pre-load the next ad immediately after showing
    interstitial.load();
  }
};

export { BannerAd, BannerAdSize };
