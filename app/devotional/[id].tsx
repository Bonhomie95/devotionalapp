import DevotionCard from '@/components/DevotionCard';
import Header from '@/components/Header';
import VerseBox from '@/components/VerseBox';
import { COLORS } from '@/constants/colors';
import { DEVOTIONS } from '@/constants/devotions';
import { useLocalSearchParams } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';

import ButtonPrimary from '@/components/ButtonPrimary';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

export default function DevotionDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const devotion = DEVOTIONS.find((d) => d.id === id);

  if (!devotion) {
    return null;
  }

  const shareVerse = async () => {
    try {
      const text = `${devotion.verse}\n— ${devotion.reference}`;
      const fileUri = FileSystem.cacheDirectory + 'verse.txt';

      await FileSystem.writeAsStringAsync(fileUri, text);
      await Sharing.shareAsync(fileUri);
    } catch (err) {
      Alert.alert('Error', 'Unable to share verse');
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

      <ButtonPrimary label="Share Verse" onPress={shareVerse} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 20 },
});
