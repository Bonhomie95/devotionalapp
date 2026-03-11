import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function StreakBadge({ streak }: { streak: number }) {
  if (streak === 0) return null;

  return (
    <View style={styles.container}>
      <Ionicons name="flame" size={16} color="#FF6B35" />
      <Text style={styles.text}>
        {streak} day{streak !== 1 ? 's' : ''} streak
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    gap: 5,
  },
  text: {
    color: '#FF6B35',
    fontWeight: '700',
    fontSize: 13,
  },
});
