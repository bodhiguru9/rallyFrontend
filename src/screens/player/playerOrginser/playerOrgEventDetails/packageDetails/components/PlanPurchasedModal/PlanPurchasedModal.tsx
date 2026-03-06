import React from 'react';
import { TextDs, FlexView } from '@components';
import { Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { styles } from './style/PlanPurchasedModal.styles';

interface PlanPurchasedModalProps {
  visible: boolean;
  onClose: () => void;
  onViewCredits: () => void;
}

export const PlanPurchasedModal: React.FC<PlanPurchasedModalProps> = ({
  visible,
  onClose,
  onViewCredits,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
        <FlexView style={styles.card}>
          <FlexView style={styles.iconWrap}>
            <Check size={28} color="#35B36B" />
          </FlexView>

          {/* <TextDs style={styles.title}>Plan Purchased</TextDs> */}
          <TextDs style={styles.subtitle}>
            You have successfully used 1 credit.{'\n'}
            You can use your credits while making a booking.
          </TextDs>

          <TouchableOpacity style={styles.primaryButton} onPress={onViewCredits} activeOpacity={0.85}>
            <TextDs style={styles.primaryButtonText}>View credits</TextDs>
          </TouchableOpacity>
        </FlexView>
      </SafeAreaView>
    </Modal>
  );
};

