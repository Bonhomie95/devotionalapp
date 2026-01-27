import { COLORS } from '@/constants/colors';
import { StyleSheet, Text, View } from 'react-native';

export default function ShareVerseCard({
  verse,
  reference,
}: {
  verse: string;
  reference: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.verse}>“{verse}”</Text>
      <Text style={styles.ref}>{reference}</Text>
      <Text style={styles.brand}>Daily Devotion</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 1080,
    height: 1920,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
  },
  verse: {
    color: 'white',
    fontSize: 60,
    textAlign: 'center',
    lineHeight: 80,
  },
  ref: {
    color: COLORS.primary,
    fontSize: 40,
    marginTop: 40,
  },
  brand: {
    position: 'absolute',
    bottom: 100,
    color: '#aaa',
    fontSize: 32,
  },
});
