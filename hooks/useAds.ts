import { ADMOB_BANNER_ID, ADMOB_INTERSTITIAL_ID } from '@env';
import mobileAds, {
    BannerAd,
    BannerAdSize,
    InterstitialAd,
    TestIds,
} from 'react-native-google-mobile-ads';

mobileAds().initialize();

export const bannerUnitId = __DEV__ ? TestIds.BANNER : ADMOB_BANNER_ID;

const interstitial = InterstitialAd.createForAdRequest(
  __DEV__ ? TestIds.INTERSTITIAL : ADMOB_INTERSTITIAL_ID,
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

