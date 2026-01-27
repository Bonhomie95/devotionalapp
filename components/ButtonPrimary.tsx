import { COLORS } from '@/constants/colors';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function ButtonPrimary({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 10,
  },
  text: { color: 'white', fontWeight: '600' },
});
