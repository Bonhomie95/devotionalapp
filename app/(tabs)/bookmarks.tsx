import { useTheme } from '@/context/ThemeContext';
import { Devotion } from '@/constants/devotions';
import { useBookmarks } from '@/hooks/useBookmarks';
import { showInterstitialIfReady } from '@/hooks/useAds';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function BookmarkItem({
  item,
  onDelete,
  onPress,
  theme,
  styles,
}: {
  item: Devotion;
  onDelete: () => void;
  onPress: () => void;
  theme: any;
  styles: any;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardVerse} numberOfLines={2}>"{item.verse}"</Text>
        <Text style={styles.cardRef}>{item.reference}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={onDelete}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name="trash-outline" size={18} color={theme.subtext} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function BookmarksTab() {
  const { theme } = useTheme();
  const { bookmarks, removeBookmark } = useBookmarks();
  const router = useRouter();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  useFocusEffect(
    useCallback(() => {
      showInterstitialIfReady();
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>LIBRARY</Text>
        <Text style={styles.headerTitle}>Saved Verses</Text>
      </View>

      {bookmarks.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bookmark-outline" size={48} color={theme.divider} />
          <Text style={styles.emptyTitle}>Nothing saved yet</Text>
          <Text style={styles.emptySub}>
            Tap the bookmark icon on today's verse to save it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => (
            <BookmarkItem
              item={item}
              theme={theme}
              styles={styles}
              onDelete={() => removeBookmark(item.id)}
              onPress={() => router.push(`/devotional/${item.id}`)}
            />
          )}
        />
      )}
    </View>
  );
}

const makeStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flex: 1, backgroundColor: theme.bg,
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
    },
    header: { marginBottom: 24 },
    headerLabel: {
      color: theme.primary, fontSize: 11, fontWeight: '700',
      letterSpacing: 2, marginBottom: 4,
    },
    headerTitle: { color: theme.text, fontSize: 28, fontWeight: '800' },
    card: {
      backgroundColor: theme.card, borderRadius: 18, padding: 18,
      flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    },
    cardContent: { flex: 1 },
    cardTitle: {
      color: theme.primary, fontSize: 13, fontWeight: '700',
      letterSpacing: 0.3, marginBottom: 6,
    },
    cardVerse: {
      color: theme.text, fontSize: 14, lineHeight: 22,
      fontStyle: 'italic',
      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
      marginBottom: 8,
    },
    cardRef: { color: theme.subtext, fontSize: 12, fontWeight: '600' },
    deleteBtn: { paddingTop: 2 },
    emptyState: {
      flex: 1, alignItems: 'center', justifyContent: 'center',
      paddingBottom: 80, gap: 12,
    },
    emptyTitle: { color: theme.text, fontSize: 18, fontWeight: '700', marginTop: 8 },
    emptySub: {
      color: theme.subtext, fontSize: 14, textAlign: 'center',
      lineHeight: 22, maxWidth: 260,
    },
  });
