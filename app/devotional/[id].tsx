import ShareVerseCard from '@/components/ShareVerseCard';
import { useTheme } from '@/context/ThemeContext';
import { DEVOTIONS } from '@/constants/devotions';
import { BannerAd, BannerAdSize, bannerUnitId } from '@/hooks/useAds';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useMemo, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ViewShot, { captureRef } from 'react-native-view-shot';
import JournalModal from '../../components/JournalModal';

export default function DevotionDetail() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const devotion = DEVOTIONS.find((d) => d.id === id);
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const shotRef = useRef<ViewShot>(null);
  const [journalVisible, setJournalVisible] = useState(false);

  const styles = useMemo(() => makeStyles(theme), [theme]);

  if (!devotion) return null;

  const saved = isBookmarked(devotion.id);
  const toggleBookmark = () => {
    if (saved) removeBookmark(devotion.id);
    else addBookmark(devotion);
  };

  const shareVerse = async () => {
    if (!shotRef.current) return;
    const uri = await captureRef(shotRef, { format: 'png', quality: 1 });
    if (uri) await Sharing.shareAsync(uri);
  };

  return (
    <View style={styles.root}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={theme.text} />
          <Text style={styles.backText}>Saved</Text>
        </TouchableOpacity>

        <View style={styles.verseCard}>
          <Text style={styles.quoteDecor}>"</Text>
          <Text style={styles.verseText}>{devotion.verse}</Text>
          <Text style={styles.referenceText}>— {devotion.reference}</Text>

          <View style={styles.verseActions}>
            <TouchableOpacity onPress={toggleBookmark} style={styles.iconBtn}>
              <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={22} color={saved ? theme.primary : theme.subtext} />
              <Text style={[styles.iconBtnLabel, saved && { color: theme.primary }]}>{saved ? 'Saved' : 'Save'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={shareVerse} style={styles.iconBtn}>
              <Ionicons name="share-outline" size={22} color={theme.subtext} />
              <Text style={styles.iconBtnLabel}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setJournalVisible(true)} style={styles.iconBtn}>
              <Ionicons name="pencil-outline" size={22} color={theme.subtext} />
              <Text style={styles.iconBtnLabel}>Reflect</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.messageCard}>
          <Text style={styles.messageTitle}>{devotion.title}</Text>
          <View style={styles.divider} />
          <Text style={styles.messageBody}>{devotion.message}</Text>
        </View>

        <View style={{ position: 'absolute', left: -9999 }}>
          <ViewShot ref={shotRef}>
            <ShareVerseCard verse={devotion.verse} reference={devotion.reference} />
          </ViewShot>
        </View>
      </ScrollView>

      <View style={styles.adContainer}>
        <BannerAd unitId={bannerUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      </View>

      <JournalModal visible={journalVisible} devotionId={devotion.id} onClose={() => setJournalVisible(false)} />
    </View>
  );
}

const makeStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.bg },
    container: { flex: 1 },
    content: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20 },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 24, alignSelf: 'flex-start' },
    backText: { color: theme.text, fontSize: 16, fontWeight: '600' },
    verseCard: {
      backgroundColor: theme.verseCard, borderRadius: 24, padding: 28, marginBottom: 16,
      borderWidth: 1, borderColor: theme.primary + '33', overflow: 'hidden',
    },
    quoteDecor: {
      fontSize: 100, lineHeight: 80, color: theme.quoteMark,
      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
      marginBottom: -10, marginLeft: -8,
    },
    verseText: {
      color: theme.text, fontSize: 22, lineHeight: 34,
      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
      fontStyle: 'italic', textAlign: 'center', paddingHorizontal: 8, marginBottom: 16,
    },
    referenceText: { color: theme.primary, fontSize: 14, fontWeight: '600', textAlign: 'center', letterSpacing: 0.5, marginBottom: 20 },
    verseActions: { flexDirection: 'row', justifyContent: 'center', gap: 32, paddingTop: 16, borderTopWidth: 1, borderTopColor: theme.divider },
    iconBtn: { alignItems: 'center', gap: 4 },
    iconBtnLabel: { color: theme.subtext, fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
    messageCard: { backgroundColor: theme.card, borderRadius: 20, padding: 24, marginBottom: 16 },
    messageTitle: { color: theme.primary, fontSize: 16, fontWeight: '700', letterSpacing: 0.3, marginBottom: 14 },
    divider: { height: 1, backgroundColor: theme.divider, marginBottom: 14 },
    messageBody: { color: theme.text, fontSize: 15, lineHeight: 26, opacity: 0.85 },
    adContainer: { alignItems: 'center' },
  });
