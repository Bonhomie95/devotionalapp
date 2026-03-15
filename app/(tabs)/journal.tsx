import { useTheme } from '@/context/ThemeContext';
import { useDevotion } from '@/hooks/useDevotion';
import { useJournal } from '@/hooks/useJournal';
import { showInterstitialIfReady } from '@/hooks/useAds';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function JournalTab() {
  const { theme } = useTheme();
  const { devotion, loading } = useDevotion();
  const { entry, saveEntry } = useJournal(devotion?.id ?? '');
  const [draft, setDraft] = useState('');
  const [saved, setSaved] = useState(false);

  const styles = useMemo(() => makeStyles(theme), [theme]);

  useFocusEffect(
    useCallback(() => {
      showInterstitialIfReady();
    }, []),
  );

  useEffect(() => {
    setDraft(entry);
  }, [entry]);

  const handleSave = async () => {
    await saveEntry(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading || !devotion) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerLabel}>MY JOURNAL</Text>
          <Text style={styles.headerTitle}>Reflection</Text>
        </View>

        <View style={styles.verseRef}>
          <View style={styles.verseRefBar} />
          <View style={styles.verseRefContent}>
            <Text style={styles.verseRefText} numberOfLines={2}>
              "{devotion.verse}"
            </Text>
            <Text style={styles.verseRefBook}>{devotion.reference}</Text>
          </View>
        </View>

        <Text style={styles.prompt}>What does this verse mean to you today?</Text>

        <TextInput
          style={styles.input}
          multiline
          placeholder="Write your prayer, thoughts, or response to today's devotion…"
          placeholderTextColor={theme.subtext + '80'}
          value={draft}
          onChangeText={(t) => { setDraft(t); setSaved(false); }}
          textAlignVertical="top"
          autoCorrect
        />

        <Text style={styles.charCount}>{draft.length} characters</Text>

        <TouchableOpacity
          style={[styles.saveBtn, saved && styles.saveBtnDone]}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Ionicons name={saved ? 'checkmark-circle' : 'save-outline'} size={18} color="#fff" />
          <Text style={styles.saveBtnText}>{saved ? 'Saved!' : 'Save Reflection'}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
    header: { marginBottom: 24 },
    headerLabel: {
      color: theme.primary, fontSize: 11, fontWeight: '700',
      letterSpacing: 2, marginBottom: 4,
    },
    headerTitle: { color: theme.text, fontSize: 28, fontWeight: '800' },
    verseRef: {
      flexDirection: 'row', backgroundColor: theme.card,
      borderRadius: 16, marginBottom: 24, overflow: 'hidden',
    },
    verseRefBar: { width: 4, backgroundColor: theme.primary, borderRadius: 2 },
    verseRefContent: { flex: 1, padding: 16 },
    verseRefText: {
      color: theme.text, fontSize: 14, lineHeight: 22,
      fontStyle: 'italic',
      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
      marginBottom: 6,
    },
    verseRefBook: { color: theme.primary, fontSize: 12, fontWeight: '600' },
    prompt: { color: theme.subtext, fontSize: 13, marginBottom: 12, fontWeight: '500' },
    input: {
      backgroundColor: theme.card, color: theme.text, borderRadius: 16,
      padding: 18, fontSize: 15, lineHeight: 24, minHeight: 200,
      borderWidth: 1, borderColor: theme.divider,
    },
    charCount: {
      color: theme.subtext, fontSize: 12, textAlign: 'right',
      marginTop: 8, marginBottom: 20, opacity: 0.5,
    },
    saveBtn: {
      backgroundColor: theme.primary, flexDirection: 'row',
      alignItems: 'center', justifyContent: 'center',
      gap: 8, paddingVertical: 16, borderRadius: 16,
    },
    saveBtnDone: { backgroundColor: '#16a34a' },
    saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  });
