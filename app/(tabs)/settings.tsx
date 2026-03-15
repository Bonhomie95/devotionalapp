import { useTheme } from '@/context/ThemeContext';
import { THEMES } from '@/constants/themes';
import {
  DEFAULT_EVENING,
  DEFAULT_MORNING,
  disableNotifications,
  getNotificationTimes,
  saveNotificationTimes,
  scheduleDailyDevotions,
} from '@/hooks/useNotifications';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useStreak } from '../../hooks/useStreak';

const KEY_NOTIFICATIONS_ENABLED = 'NOTIFICATIONS_ENABLED';

function pad(n: number) { return String(n).padStart(2, '0'); }
function formatTime(h: number, m: number) {
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:${pad(m)} ${period}`;
}

function TimePickerModal({
  visible, label, initial, onConfirm, onCancel, theme,
}: {
  visible: boolean; label: string;
  initial: { hour: number; minute: number };
  onConfirm: (t: { hour: number; minute: number }) => void;
  onCancel: () => void;
  theme: any;
}) {
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);

  useEffect(() => { setHour(initial.hour); setMinute(initial.minute); }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modal.overlay}>
        <View style={[modal.box, { backgroundColor: theme.card }]}>
          <Text style={[modal.label, { color: theme.text }]}>{label}</Text>

          <View style={modal.row}>
            {[
              { val: hour, set: setHour, range: 24 },
              { val: minute, set: setMinute, range: 60, step: 5 },
            ].map((col, i) => (
              <View key={i} style={{ alignItems: 'center' }}>
                <TouchableOpacity onPress={() => col.set((v: number) => (v + (col.step ?? 1) + col.range) % col.range)} style={modal.arrow}>
                  <Ionicons name="chevron-up" size={22} color={theme.primary} />
                </TouchableOpacity>
                <Text style={[modal.digit, { color: theme.text }]}>{pad(col.val)}</Text>
                <TouchableOpacity onPress={() => col.set((v: number) => (v - (col.step ?? 1) + col.range) % col.range)} style={modal.arrow}>
                  <Ionicons name="chevron-down" size={22} color={theme.primary} />
                </TouchableOpacity>
                {i === 0 && <Text style={[modal.colon, { color: theme.text }]}>:</Text>}
              </View>
            ))}
            <Text style={[modal.period, { color: theme.subtext }]}>{hour >= 12 ? 'PM' : 'AM'}</Text>
          </View>

          <View style={modal.buttons}>
            <TouchableOpacity style={[modal.cancelBtn, { borderColor: theme.divider }]} onPress={onCancel}>
              <Text style={[modal.cancelText, { color: theme.subtext }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[modal.confirmBtn, { backgroundColor: theme.primary }]} onPress={() => onConfirm({ hour, minute })}>
              <Text style={modal.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function SettingsTab() {
  const { theme, setThemeId } = useTheme();
  const { streak } = useStreak();
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [morningTime, setMorningTime] = useState(DEFAULT_MORNING);
  const [eveningTime, setEveningTime] = useState(DEFAULT_EVENING);
  const [pickerFor, setPickerFor] = useState<'morning' | 'evening' | null>(null);

  const styles = useMemo(() => makeStyles(theme), [theme]);

  useEffect(() => {
    (async () => {
      const enabled = await AsyncStorage.getItem(KEY_NOTIFICATIONS_ENABLED);
      setNotificationsOn(enabled === 'true');
      const times = await getNotificationTimes();
      setMorningTime(times.morning);
      setEveningTime(times.evening);
    })();
  }, []);

  const handleToggle = async (val: boolean) => {
    setNotificationsOn(val);
    await AsyncStorage.setItem(KEY_NOTIFICATIONS_ENABLED, String(val));
    if (val) {
      const success = await scheduleDailyDevotions();
      if (!success) {
        setNotificationsOn(false);
        await AsyncStorage.setItem(KEY_NOTIFICATIONS_ENABLED, 'false');
        Alert.alert('Permission needed', 'Please enable notifications in your device settings.');
      }
    } else {
      await disableNotifications();
    }
  };

  const handleTimeConfirm = async (time: { hour: number; minute: number }) => {
    const isMorning = pickerFor === 'morning';
    const updated = isMorning
      ? { morning: time, evening: eveningTime }
      : { morning: morningTime, evening: time };
    if (isMorning) setMorningTime(time); else setEveningTime(time);
    await saveNotificationTimes(updated.morning, updated.evening);
    if (notificationsOn) await scheduleDailyDevotions();
    setPickerFor(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>PREFERENCES</Text>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* ── Streak ── */}
      <Text style={styles.sectionLabel}>YOUR PROGRESS</Text>
      <View style={styles.streakCard}>
        <Ionicons name="flame" size={36} color="#FF6B35" />
        <View style={{ marginLeft: 16, flex: 1 }}>
          <Text style={styles.streakNumber}>{streak}</Text>
          <Text style={styles.streakSub}>day{streak !== 1 ? 's' : ''} in a row</Text>
        </View>
        {streak >= 7 && (
          <View style={styles.streakBadge}>
            <Text style={styles.streakBadgeText}>🔥 Week streak!</Text>
          </View>
        )}
      </View>

      {/* ── Theme picker ── */}
      <Text style={[styles.sectionLabel, { marginTop: 28 }]}>APPEARANCE</Text>
      <View style={styles.themeGrid}>
        {THEMES.map((t) => {
          const active = t.id === theme.id;
          return (
            <TouchableOpacity
              key={t.id}
              style={[
                styles.themeCard,
                { backgroundColor: t.bg, borderColor: active ? t.primary : 'transparent' },
              ]}
              onPress={() => setThemeId(t.id)}
              activeOpacity={0.8}
            >
              {/* Mini preview bars */}
              <View style={[styles.themePreviewBar, { backgroundColor: t.card }]} />
              <View style={[styles.themePreviewAccent, { backgroundColor: t.primary }]} />

              <Text style={[styles.themeEmoji]}>{t.emoji}</Text>
              <Text style={[styles.themeName, { color: t.text }]}>{t.name}</Text>

              {active && (
                <View style={[styles.themeCheck, { backgroundColor: t.primary }]}>
                  <Ionicons name="checkmark" size={10} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Notifications ── */}
      <Text style={[styles.sectionLabel, { marginTop: 28 }]}>NOTIFICATIONS</Text>
      <View style={styles.group}>
        <View style={styles.row}>
          <View>
            <Text style={styles.rowLabel}>Daily Devotions</Text>
            <Text style={styles.rowSub}>Morning & evening reminders</Text>
          </View>
          <Switch
            value={notificationsOn}
            onValueChange={handleToggle}
            trackColor={{ true: theme.primary, false: theme.card }}
            thumbColor={notificationsOn ? '#fff' : theme.subtext}
          />
        </View>

        {notificationsOn && (
          <>
            <View style={styles.groupDivider} />
            <TouchableOpacity style={styles.row} onPress={() => setPickerFor('morning')}>
              <View style={styles.rowLeft}>
                <View style={[styles.timeIcon, { backgroundColor: 'rgba(251,191,36,0.15)' }]}>
                  <Ionicons name="sunny-outline" size={16} color="#FBBF24" />
                </View>
                <View>
                  <Text style={styles.rowLabel}>Morning</Text>
                  <Text style={styles.rowSub}>{formatTime(morningTime.hour, morningTime.minute)}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.subtext} />
            </TouchableOpacity>

            <View style={styles.groupDivider} />
            <TouchableOpacity style={styles.row} onPress={() => setPickerFor('evening')}>
              <View style={styles.rowLeft}>
                <View style={[styles.timeIcon, { backgroundColor: 'rgba(129,140,248,0.15)' }]}>
                  <Ionicons name="moon-outline" size={16} color="#818CF8" />
                </View>
                <View>
                  <Text style={styles.rowLabel}>Evening</Text>
                  <Text style={styles.rowSub}>{formatTime(eveningTime.hour, eveningTime.minute)}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.subtext} />
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={{ height: 40 }} />

      <TimePickerModal visible={pickerFor === 'morning'} label="Morning Devotion 🌅"
        initial={morningTime} onConfirm={handleTimeConfirm} onCancel={() => setPickerFor(null)} theme={theme} />
      <TimePickerModal visible={pickerFor === 'evening'} label="Evening Reflection 🌙"
        initial={eveningTime} onConfirm={handleTimeConfirm} onCancel={() => setPickerFor(null)} theme={theme} />
    </ScrollView>
  );
}

const makeStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg },
    content: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
    header: { marginBottom: 28 },
    headerLabel: { color: theme.primary, fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 4 },
    headerTitle: { color: theme.text, fontSize: 28, fontWeight: '800' },
    sectionLabel: { color: theme.subtext, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10, opacity: 0.7 },

    streakCard: { backgroundColor: theme.card, borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center' },
    streakNumber: { color: '#FF6B35', fontSize: 32, fontWeight: '800', lineHeight: 34 },
    streakSub: { color: theme.subtext, fontSize: 13 },
    streakBadge: { backgroundColor: 'rgba(255,107,53,0.15)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
    streakBadgeText: { color: '#FF6B35', fontSize: 12, fontWeight: '600' },

    // Theme grid — 3 columns
    themeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    themeCard: {
      width: '30.5%', aspectRatio: 0.85, borderRadius: 16, padding: 12,
      borderWidth: 2, overflow: 'hidden', justifyContent: 'flex-end',
    },
    themePreviewBar: { position: 'absolute', top: 10, left: 10, right: 10, height: 6, borderRadius: 3, opacity: 0.8 },
    themePreviewAccent: { position: 'absolute', top: 22, left: 10, width: '45%', height: 4, borderRadius: 2 },
    themeEmoji: { fontSize: 22, marginBottom: 2 },
    themeName: { fontSize: 12, fontWeight: '700' },
    themeCheck: {
      position: 'absolute', top: 8, right: 8,
      width: 18, height: 18, borderRadius: 9,
      alignItems: 'center', justifyContent: 'center',
    },

    group: { backgroundColor: theme.card, borderRadius: 20, overflow: 'hidden' },
    groupDivider: { height: 1, backgroundColor: theme.divider, marginHorizontal: 16 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
    rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    timeIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    rowLabel: { color: theme.text, fontSize: 15, fontWeight: '500' },
    rowSub: { color: theme.subtext, fontSize: 13, marginTop: 1 },
  });

const modal = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  box: { borderRadius: 24, padding: 28, width: 280, alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '700', marginBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 28, gap: 4 },
  arrow: { padding: 8 },
  digit: { fontSize: 40, fontWeight: '700', width: 60, textAlign: 'center' },
  colon: { fontSize: 36, fontWeight: '700', paddingHorizontal: 4, marginBottom: 6, position: 'absolute', left: 62 },
  period: { fontSize: 20, fontWeight: '600', marginLeft: 16, marginBottom: 6 },
  buttons: { flexDirection: 'row', gap: 12, width: '100%' },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  cancelText: { fontWeight: '600' },
  confirmBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  confirmText: { color: '#fff', fontWeight: '700' },
});
