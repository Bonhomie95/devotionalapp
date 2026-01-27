import mobileAds, {
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';

mobileAds().initialize();

// Always return string
export const bannerUnitId: string = __DEV__
  ? TestIds.BANNER
  : process.env.ADMOB_BANNER_ID || TestIds.BANNER;

const interstitial = InterstitialAd.createForAdRequest(
  __DEV__
    ? TestIds.INTERSTITIAL
    : process.env.ADMOB_INTERSTITIAL_ID || TestIds.INTERSTITIAL,
  { requestNonPersonalizedAdsOnly: true },
);

let lastShown = 0;
const COOLDOWN = 2 * 60 * 1000;

export const loadInterstitial = () => interstitial.load();

export const showInterstitialIfReady = () => {
  const now = Date.now();
  if (interstitial.loaded && now - lastShown > COOLDOWN) {
    interstitial.show();
    lastShown = now;
    interstitial.load();
  }
};

export { BannerAd, BannerAdSize };

