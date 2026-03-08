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
  creditsAdded?: number;
  packageName?: string;
}

export const PlanPurchasedModal: React.FC<PlanPurchasedModalProps> = ({
  visible,
  onClose,
  onViewCredits,
  creditsAdded = 0,
  packageName,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
        <FlexView style={styles.card}>
          <FlexView style={styles.iconWrap}>
            <Check size={28} color="#35B36B" />
          </FlexView>

          <TextDs style={styles.title}>Package Purchased!</TextDs>
          <TextDs style={styles.subtitle}>
            You have successfully purchased {packageName || 'the package'}.{'\n'}
            {creditsAdded} {creditsAdded === 1 ? 'credit has' : 'credits have'} been added to your account.{'\n'}
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

