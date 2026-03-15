import ShareVerseCard from '@/components/ShareVerseCard';
import { useTheme } from '@/context/ThemeContext';
import { BannerAd, BannerAdSize, bannerUnitId, showInterstitialIfReady } from '@/hooks/useAds';
import { useDevotion } from '@/hooks/useDevotion';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useCallback, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { useStreak } from '../../hooks/useStreak';

export default function Home() {
  const { theme } = useTheme();
  const { devotion, timeLeft, loading } = useDevotion();
  const { streak } = useStreak();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const shotRef = useRef<ViewShot>(null);

  // Show an interstitial ad each time the user focuses this tab,
  // respecting the cooldown defined in useAds.ts.
  useFocusEffect(
    useCallback(() => {
      showInterstitialIfReady();
    }, []),
  );

  const styles = useMemo(() => makeStyles(theme), [theme]);

  if (loading || !devotion) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

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

  const hours = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header row */}
        <View style={styles.topRow}>
          <View>
            <Text style={styles.dayLabel}>DAILY DEVOTION</Text>
            <Text style={styles.dateLabel}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          {streak > 0 && (
            <View style={styles.streakPill}>
              <Ionicons name="flame" size={14} color="#FF6B35" />
              <Text style={styles.streakText}>{streak}</Text>
            </View>
          )}
        </View>

        {/* Verse card */}
        <View style={styles.verseCard}>
          <Text style={styles.quoteDecor}>"</Text>
          <Text style={styles.verseText}>{devotion.verse}</Text>
          <Text style={styles.referenceText}>— {devotion.reference}</Text>

          <View style={styles.verseActions}>
            <TouchableOpacity onPress={toggleBookmark} style={styles.iconBtn}>
              <Ionicons
                name={saved ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={saved ? theme.primary : theme.subtext}
              />
              <Text style={[styles.iconBtnLabel, saved && { color: theme.primary }]}>
                {saved ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={shareVerse} style={styles.iconBtn}>
              <Ionicons name="share-outline" size={22} color={theme.subtext} />
              <Text style={styles.iconBtnLabel}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Devotion message */}
        <View style={styles.messageCard}>
          <Text style={styles.messageTitle}>{devotion.title}</Text>
          <View style={styles.divider} />
          <Text style={styles.messageBody}>{devotion.message}</Text>
        </View>

        {timeLeft > 0 && (
          <Text style={styles.countdown}>
            Next devotion in {hours}h {String(minutes).padStart(2, '0')}m
          </Text>
        )}

        <View style={{ position: 'absolute', left: -9999 }}>
          <ViewShot ref={shotRef}>
            <ShareVerseCard verse={devotion.verse} reference={devotion.reference} />
          </ViewShot>
        </View>
      </ScrollView>

      <View style={styles.adContainer}>
        <BannerAd unitId={bannerUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      </View>
    </View>
  );
}

const makeStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.bg },
    loadingContainer: {
      flex: 1, backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center',
    },
    container: { flex: 1 },
    content: {
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
      paddingBottom: 20,
    },
    topRow: {
      flexDirection: 'row', justifyContent: 'space-between',
      alignItems: 'flex-start', marginBottom: 28,
    },
    dayLabel: {
      color: theme.primary, fontSize: 11, fontWeight: '700',
      letterSpacing: 2, marginBottom: 4,
    },
    dateLabel: { color: theme.text, fontSize: 20, fontWeight: '700' },
    streakPill: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: 'rgba(255,107,53,0.15)',
      paddingHorizontal: 12, paddingVertical: 6,
      borderRadius: 20, gap: 5, marginTop: 4,
    },
    streakText: { color: '#FF6B35', fontWeight: '800', fontSize: 14 },
    verseCard: {
      backgroundColor: theme.verseCard, borderRadius: 24, padding: 28,
      marginBottom: 16, borderWidth: 1,
      borderColor: theme.primary + '33', overflow: 'hidden',
    },
    quoteDecor: {
      fontSize: 100, lineHeight: 80, color: theme.quoteMark,
      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
      marginBottom: -10, marginLeft: -8,
    },
    verseText: {
      color: theme.text, fontSize: 22, lineHeight: 34,
      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
      fontStyle: 'italic', textAlign: 'center',
      paddingHorizontal: 8, marginBottom: 16,
    },
    referenceText: {
      color: theme.primary, fontSize: 14, fontWeight: '600',
      textAlign: 'center', letterSpacing: 0.5, marginBottom: 20,
    },
    verseActions: {
      flexDirection: 'row', justifyContent: 'center', gap: 32,
      paddingTop: 16, borderTopWidth: 1, borderTopColor: theme.divider,
    },
    iconBtn: { alignItems: 'center', gap: 4 },
    iconBtnLabel: {
      color: theme.subtext, fontSize: 11, fontWeight: '600', letterSpacing: 0.5,
    },
    messageCard: {
      backgroundColor: theme.card, borderRadius: 20, padding: 24, marginBottom: 16,
    },
    messageTitle: {
      color: theme.primary, fontSize: 16, fontWeight: '700',
      letterSpacing: 0.3, marginBottom: 14,
    },
    divider: { height: 1, backgroundColor: theme.divider, marginBottom: 14 },
    messageBody: { color: theme.text, fontSize: 15, lineHeight: 26, opacity: 0.85 },
    countdown: {
      color: theme.subtext, fontSize: 12, textAlign: 'center',
      marginTop: 4, opacity: 0.5,
    },
    adContainer: { alignItems: 'center' },
  });
