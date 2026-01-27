import { COLORS } from '@/constants/colors';
import { StyleSheet, Text, View } from 'react-native';

export default function DevotionCard({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 16,
  },
  title: { color: COLORS.primary, fontSize: 18, fontWeight: '600' },
  message: { color: COLORS.text, marginTop: 10, lineHeight: 22 },
});
