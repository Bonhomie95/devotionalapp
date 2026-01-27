import { COLORS } from '@/constants/colors';
import { Devotion } from '@/constants/devotions';
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
  devotion: Devotion;
}) {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const saved = isBookmarked(devotion.id);

  const toggleBookmark = () => {
    if (saved) {
      removeBookmark(devotion.id);
    } else {
      addBookmark(devotion);
    }
  };

  return (
    <View style={styles.box}>
      <TouchableOpacity style={styles.bookmark} onPress={toggleBookmark}>
        <Ionicons
          name={saved ? 'bookmark' : 'bookmark-outline'}
          size={32}
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
  verse: {
    color: COLORS.text,
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 15,
  },
  ref: { color: COLORS.primary, marginTop: 8, textAlign: 'center' },
  bookmark: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
});
