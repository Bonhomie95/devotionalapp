import Header from '@/components/Header';
import { COLORS } from '@/constants/colors';
import {
  disableNotifications,
  scheduleDailyDevotions,
} from '@/hooks/useNotifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

const KEY = 'NOTIFICATIONS_ENABLED';

export default function Settings() {
  const [notifications, setNotifications] = useState(false);

  // Load saved preference
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(KEY);
      if (saved === 'true') setNotifications(true);
    })();
  }, []);

  const handleToggle = async (val: boolean) => {
    setNotifications(val);
    await AsyncStorage.setItem(KEY, String(val));

    if (val) {
      await scheduleDailyDevotions();
    } else {
      await disableNotifications();
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Settings" />

      <View style={styles.row}>
        <Text style={styles.label}>Daily Devotions</Text>
        <Switch value={notifications} onValueChange={handleToggle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 20 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  label: { color: COLORS.text },
});
