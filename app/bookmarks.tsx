import DevotionCard from '@/components/DevotionCard';
import Header from '@/components/Header';
import { COLORS } from '@/constants/colors';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function BookmarksScreen() {
  const { bookmarks, removeBookmark } = useBookmarks();
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
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => removeBookmark(item.id)}
              >
                <Ionicons name="trash-outline" size={22} color="#ff5c5c" />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push(`/devotional/${item.id}`)}
              >
                <DevotionCard title={item.title} message={item.message} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 20 },

  empty: {
    color: COLORS.subtext,
    marginTop: 40,
    textAlign: 'center',
  },

  itemWrapper: {
    marginBottom: 20,
    position: 'relative',
  },

  deleteBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 2,
  },
});
