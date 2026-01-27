import DevotionCard from '@/components/DevotionCard';
import Header from '@/components/Header';
import { COLORS } from '@/constants/colors';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useRouter } from 'expo-router';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function BookmarksScreen() {
  const { bookmarks } = useBookmarks();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="Bookmarks" />

      {bookmarks.length === 0 ? (
        <Text style={styles.empty}>No bookmarks yet.</Text>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/devotional/${item.id}`)}
            >
              <DevotionCard title={item.title} message={item.message} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 20 },
  empty: { color: COLORS.subtext, marginTop: 40, textAlign: 'center' },
});
