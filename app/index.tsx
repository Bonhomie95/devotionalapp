import ButtonPrimary from '@/components/ButtonPrimary';
import DevotionCard from '@/components/DevotionCard';
import Header from '@/components/Header';
import VerseBox from '@/components/VerseBox';
import { COLORS } from '@/constants/colors';
import { BannerAd, BannerAdSize, bannerUnitId } from '@/hooks/useAds';
import { useDevotion } from '@/hooks/useDevotion';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function Home() {
  const devotion = useDevotion();
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Header title="Daily Devotion" />

      <VerseBox
        verse={devotion.verse}
        reference={devotion.reference}
        devotion={devotion}
      />

      <TouchableOpacity
        onPress={() => router.push(`/devotional/${devotion.id}`)}
      >
        <DevotionCard title={devotion.title} message={devotion.message} />
      </TouchableOpacity>

      <ButtonPrimary
        label="Settings"
        onPress={() => router.push('/settings')}
      />

      <BannerAd
        unitId={bannerUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 20 },
});
