import { COLORS } from '@/constants/colors';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function VerseBox({
  verse,
  reference,
  devotion,
}: {
  verse: string;
  reference: string;
  devotion: any;
}) {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const saved = isBookmarked(devotion.id);

  const toggle = () =>
    saved ? removeBookmark(devotion.id) : addBookmark(devotion);

  return (
    <View style={styles.box}>
      <TouchableOpacity style={styles.bookmark} onPress={toggle}>
        <Ionicons
          name={saved ? 'bookmark' : 'bookmark-outline'}
          size={24}
          color={COLORS.primary}
        />
      </TouchableOpacity>

      <Text style={styles.verse}>“{verse}”</Text>
      <Text style={styles.ref}>{reference}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 16,
    marginVertical: 15,
  },
  verse: { color: COLORS.text, fontSize: 18, textAlign: 'center' },
  ref: { color: COLORS.primary, marginTop: 8, textAlign: 'center' },
  bookmark: { position: 'absolute', right: 15, top: 15 },
});
