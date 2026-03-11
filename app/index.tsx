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
} from '@/hooks/useAds';
import { useDevotion } from '@/hooks/useDevotion';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ViewShot, { captureRef } from 'react-native-view-shot';
import JournalModal from '../components/JournalModal';
import StreakBadge from '../components/StreakBadge';
import { useStreak } from '../hooks/useStreak';

export default function Home() {
  const { devotion, timeLeft } = useDevotion();
  const { streak } = useStreak();
  const router = useRouter();
  const shotRef = useRef<ViewShot>(null);
  const [journalVisible, setJournalVisible] = useState(false);

  useEffect(() => {
    // Load the ad in the background — only show it intentionally, not on every open
    loadInterstitial();
  }, []);

  const shareVerse = async () => {
    if (!shotRef.current) return;
    const uri = await captureRef(shotRef, { format: 'png', quality: 1 });
    if (uri) await Sharing.shareAsync(uri);
  };

  const hours = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <Header title="Daily Devotion" />

      <StreakBadge streak={streak} />

      <VerseBox
        verse={devotion.verse}
        reference={devotion.reference}
        devotion={devotion}
      />

      <DevotionCard title={devotion.title} message={devotion.message} />

      {/* Countdown to next devotion */}
      {timeLeft > 0 && (
        <Text style={styles.countdown}>
          Next devotion in {hours}h {String(minutes).padStart(2, '0')}m
        </Text>
      )}

      <View style={{ position: 'absolute', left: -9999 }}>
        <ViewShot ref={shotRef}>
          <ShareVerseCard
            verse={devotion.verse}
            reference={devotion.reference}
          />
        </ViewShot>
      </View>

      <ButtonPrimary
        label="📖 Write Reflection"
        onPress={() => setJournalVisible(true)}
      />
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

      <JournalModal
        visible={journalVisible}
        devotionId={devotion.id}
        onClose={() => setJournalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 20 },
  countdown: {
    color: COLORS.subtext,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
});
