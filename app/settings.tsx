import Header from '@/components/Header';
import { COLORS } from '@/constants/colors';
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
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useStreak } from '../hooks/useStreak';

const KEY_NOTIFICATIONS_ENABLED = 'NOTIFICATIONS_ENABLED';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function formatTime(h: number, m: number) {
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:${pad(m)} ${period}`;
}

function TimePickerModal({
  visible,
  label,
  initial,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  label: string;
  initial: { hour: number; minute: number };
  onConfirm: (t: { hour: number; minute: number }) => void;
  onCancel: () => void;
}) {
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);

  useEffect(() => {
    setHour(initial.hour);
    setMinute(initial.minute);
  }, [visible]);

  const changeHour = (delta: number) => setHour((h) => (h + delta + 24) % 24);
  const changeMinute = (delta: number) =>
    setMinute((m) => (m + delta + 60) % 60);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modal.overlay}>
        <View style={modal.box}>
          <Text style={modal.label}>{label}</Text>

          <View style={modal.row}>
            {/* Hour column */}
            <View style={modal.column}>
              <TouchableOpacity
                onPress={() => changeHour(1)}
                style={modal.arrow}
              >
                <Ionicons name="chevron-up" size={22} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={modal.digit}>{pad(hour)}</Text>
              <TouchableOpacity
                onPress={() => changeHour(-1)}
                style={modal.arrow}
              >
                <Ionicons
                  name="chevron-down"
                  size={22}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>

            <Text style={modal.colon}>:</Text>

            {/* Minute column */}
            <View style={modal.column}>
              <TouchableOpacity
                onPress={() => changeMinute(5)}
                style={modal.arrow}
              >
                <Ionicons name="chevron-up" size={22} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={modal.digit}>{pad(minute)}</Text>
              <TouchableOpacity
                onPress={() => changeMinute(-5)}
                style={modal.arrow}
              >
                <Ionicons
                  name="chevron-down"
                  size={22}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>

            <Text style={modal.period}>{hour >= 12 ? 'PM' : 'AM'}</Text>
          </View>

          <View style={modal.buttons}>
            <TouchableOpacity style={modal.cancelBtn} onPress={onCancel}>
              <Text style={modal.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={modal.confirmBtn}
              onPress={() => onConfirm({ hour, minute })}
            >
              <Text style={modal.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function Settings() {
  const { streak } = useStreak();
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [morningTime, setMorningTime] = useState(DEFAULT_MORNING);
  const [eveningTime, setEveningTime] = useState(DEFAULT_EVENING);
  const [pickerFor, setPickerFor] = useState<'morning' | 'evening' | null>(
    null,
  );

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
        Alert.alert(
          'Permission needed',
          'Please enable notifications for this app in your device settings.',
        );
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

    if (isMorning) setMorningTime(time);
    else setEveningTime(time);

    await saveNotificationTimes(updated.morning, updated.evening);

    // Re-schedule with new times if notifications are on
    if (notificationsOn) await scheduleDailyDevotions();

    setPickerFor(null);
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Settings" />

      {/* Streak section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>YOUR PROGRESS</Text>
        <View style={styles.streakCard}>
          <Ionicons name="flame" size={32} color="#FF6B35" />
          <View style={{ marginLeft: 14 }}>
            <Text style={styles.streakNumber}>{streak}</Text>
            <Text style={styles.streakLabel}>
              day{streak !== 1 ? 's' : ''} in a row
            </Text>
          </View>
          {streak >= 7 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🔥 Week streak!</Text>
            </View>
          )}
        </View>
      </View>

      {/* Notifications section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>

        <View style={styles.row}>
          <View>
            <Text style={styles.rowLabel}>Daily Devotions</Text>
            <Text style={styles.rowSub}>Morning & evening reminders</Text>
          </View>
          <Switch
            value={notificationsOn}
            onValueChange={handleToggle}
            trackColor={{ true: COLORS.primary }}
          />
        </View>

        {notificationsOn && (
          <>
            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.row}
              onPress={() => setPickerFor('morning')}
            >
              <View style={styles.timeIconRow}>
                <Ionicons name="sunny-outline" size={18} color="#FBBF24" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.rowLabel}>Morning devotion</Text>
                  <Text style={styles.rowSub}>
                    {formatTime(morningTime.hour, morningTime.minute)}
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={COLORS.subtext}
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.row}
              onPress={() => setPickerFor('evening')}
            >
              <View style={styles.timeIconRow}>
                <Ionicons name="moon-outline" size={18} color="#818CF8" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.rowLabel}>Evening reflection</Text>
                  <Text style={styles.rowSub}>
                    {formatTime(eveningTime.hour, eveningTime.minute)}
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={COLORS.subtext}
              />
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={{ height: 40 }} />

      {/* Time picker modals */}
      <TimePickerModal
        visible={pickerFor === 'morning'}
        label="Morning Devotion 🌅"
        initial={morningTime}
        onConfirm={handleTimeConfirm}
        onCancel={() => setPickerFor(null)}
      />
      <TimePickerModal
        visible={pickerFor === 'evening'}
        label="Evening Reflection 🌙"
        initial={eveningTime}
        onConfirm={handleTimeConfirm}
        onCancel={() => setPickerFor(null)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 20 },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.subtext,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  streakCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakNumber: {
    color: '#FF6B35',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 30,
  },
  streakLabel: {
    color: COLORS.subtext,
    fontSize: 13,
  },
  badge: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(255,107,53,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FF6B35',
    fontSize: 12,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
  },
  timeIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLabel: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '500',
  },
  rowSub: {
    color: COLORS.subtext,
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#0F172A',
    marginHorizontal: 0,
  },
});

const modal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 28,
    width: 280,
    alignItems: 'center',
  },
  label: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  column: {
    alignItems: 'center',
  },
  arrow: {
    padding: 8,
  },
  digit: {
    color: COLORS.text,
    fontSize: 40,
    fontWeight: '700',
    width: 60,
    textAlign: 'center',
  },
  colon: {
    color: COLORS.text,
    fontSize: 36,
    fontWeight: '700',
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  period: {
    color: COLORS.subtext,
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
    marginBottom: 6,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  cancelText: {
    color: COLORS.subtext,
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '700',
  },
});
