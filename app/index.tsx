import ButtonPrimary from '@/components/ButtonPrimary';
import DevotionCard from '@/components/DevotionCard';
import Header from '@/components/Header';
import ShareVerseCard from '@/components/ShareVerseCard';
import VerseBox from '@/components/VerseBox';
import { COLORS } from '@/constants/colors';
import {
  BannerAd,
  BannerAdSize,
  bannerUnitId,
  loadInterstitial,
  showInterstitialIfReady,
} from '@/hooks/useAds';
import { useDevotion } from '@/hooks/useDevotion';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import ViewShot, { captureRef } from 'react-native-view-shot';

export default function Home() {
  const devotionState = useDevotion();
  const devotion = devotionState.devotion;
  const timeLeft = devotionState.timeLeft;

  const router = useRouter();
  const shotRef = useRef<ViewShot>(null);

  useEffect(() => {
    loadInterstitial();
    showInterstitialIfReady();
  }, []);

  const shareVerse = async () => {
    if (!shotRef.current) return;
    const uri = await captureRef(shotRef, { format: 'png', quality: 1 });
    if (uri) await Sharing.shareAsync(uri);
  };

  const hours = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);

  return (
    <ScrollView style={styles.container}>
      <Header title="Daily Devotion" />

      <VerseBox
        verse={devotion.verse}
        reference={devotion.reference}
        devotion={devotion}
      />

      <DevotionCard title={devotion.title} message={devotion.message} />

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

      <View style={{ marginBottom: 50 }} />

      <BannerAd
        unitId={bannerUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 20 },
  countdown: {
    color: COLORS.subtext,
    marginBottom: 10,
    textAlign: 'center',
  },
});
