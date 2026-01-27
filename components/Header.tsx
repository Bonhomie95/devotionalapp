import { COLORS } from '@/constants/colors';
import { StyleSheet, Text, View } from 'react-native';

export default function Header({ title }: { title: string }) {
  return (
    <View style={styles.header}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  text: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '700',
  },
});
