import ButtonPrimary from '@/components/ButtonPrimary';
import DevotionCard from '@/components/DevotionCard';
import Header from '@/components/Header';
import VerseBox from '@/components/VerseBox';
import { COLORS } from '@/constants/colors';
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
        label="View Bookmarks"
        onPress={() => router.push('/bookmarks')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 20 },
});
