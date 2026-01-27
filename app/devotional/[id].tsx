import ButtonPrimary from '@/components/ButtonPrimary';
import DevotionCard from '@/components/DevotionCard';
import Header from '@/components/Header';
import ShareVerseCard from '@/components/ShareVerseCard';
import VerseBox from '@/components/VerseBox';
import { COLORS } from '@/constants/colors';
import { DEVOTIONS } from '@/constants/devotions';
import {
  BannerAd,
  BannerAdSize,
  bannerUnitId,
  loadInterstitial,
  showInterstitialIfReady,
} from '@/hooks/useAds';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import ViewShot, { captureRef } from 'react-native-view-shot';

export default function DevotionDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const devotion = DEVOTIONS.find((d) => d.id === id);
  const { addBookmark, isBookmarked } = useBookmarks();
  const shotRef = useRef<ViewShot>(null);

  // Show interstitial
  useEffect(() => {
    loadInterstitial();
    showInterstitialIfReady();
  }, []);

  // Auto-bookmark
  useEffect(() => {
    if (devotion && !isBookmarked(devotion.id)) {
      addBookmark(devotion);
    }
  }, [devotion]);

  if (!devotion) return null;

  const shareVerse = async () => {
    if (!shotRef.current) return;

    const uri = await captureRef(shotRef, {
      format: 'png',
      quality: 1,
    });

    if (uri) {
      await Sharing.shareAsync(uri);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Devotion" />

      <VerseBox
        verse={devotion.verse}
        reference={devotion.reference}
        devotion={devotion}
      />

      <DevotionCard title={devotion.title} message={devotion.message} />

      {/* Hidden render for image capture */}
      <View style={{ position: 'absolute', left: -9999 }}>
        <ViewShot ref={shotRef}>
          <ShareVerseCard
            verse={devotion.verse}
            reference={devotion.reference}
          />
        </ViewShot>
      </View>

      <ButtonPrimary label="Share as Image" onPress={shareVerse} />

      <ButtonPrimary
        label="View Bookmarks"
        onPress={() => router.push('/bookmarks')}
      />
      <ButtonPrimary
        label="Settings"
        onPress={() => router.push('/settings')}
      />

      <BannerAd
        unitId={bannerUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 20 },
});
