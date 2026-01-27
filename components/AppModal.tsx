import { COLORS } from '@/constants/colors';
import { Modal, StyleSheet, Text, View } from 'react-native';
import ButtonPrimary from './ButtonPrimary';

export default function AppModal({
  visible,
  title,
  message,
  onClose,
}: {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <ButtonPrimary label="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 16,
    width: '85%',
  },
  title: { color: COLORS.primary, fontSize: 18, fontWeight: '700' },
  message: { color: COLORS.text, marginVertical: 10 },
});
