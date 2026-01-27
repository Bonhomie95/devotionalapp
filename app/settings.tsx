import Header from '@/components/Header';
import { COLORS } from '@/constants/colors';
import { scheduleDailyDevotions } from '@/hooks/useNotifications';
import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function Settings() {
  const [notifications, setNotifications] = useState(false);

  const handleToggle = async (val: boolean) => {
    setNotifications(val);

    if (val) await scheduleDailyDevotions();
  };

  return (
    <View style={styles.container}>
      <Header title="Settings" />

      <View style={styles.row}>
        <Text style={styles.label}>Daily Reminder</Text>
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
