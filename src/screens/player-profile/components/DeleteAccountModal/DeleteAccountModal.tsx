import React from 'react';
import { TextDs,  FlexView } from '@components';
import {Modal, TouchableOpacity} from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { colors } from '@theme';
import type { DeleteAccountModalProps } from './DeleteAccountModal.types';
import { styles } from './style/DeleteAccountModal.styles';

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  visible,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <FlexView style={styles.overlay}>
        <FlexView style={styles.modalContainer}>
          {/* Header */}
          <FlexView style={styles.header}>
            <FlexView style={styles.iconContainer}>
              <Trash2 size={32} color={colors.status.error} />
            </FlexView>
            <TextDs style={styles.title}>Are you really delete your account?</TextDs>
            <TextDs style={styles.description}>
              This action cannot be undone. Please read the information below before proceeding.
            </TextDs>
          </FlexView>

          {/* Warning Section */}
          <FlexView style={styles.warningSection}>
            <TextDs style={styles.warningTitle}>⚠️ Data Not Recoverable</TextDs>
            <TextDs style={styles.warningText}>
              Once you delete your account, all of your data will be permanently removed and cannot be recovered.
            </TextDs>
            
            <FlexView style={styles.infoList}>
              <TextDs style={styles.warningTitle}>What will be deleted:</TextDs>
              <FlexView style={styles.infoItem}>
                <TextDs style={styles.bullet}>•</TextDs>
                <TextDs style={styles.infoText}>Your profile information and personal data</TextDs>
              </FlexView>
              <FlexView style={styles.infoItem}>
                <TextDs style={styles.bullet}>•</TextDs>
                <TextDs style={styles.infoText}>All your event participations and history</TextDs>
              </FlexView>
              <FlexView style={styles.infoItem}>
                <TextDs style={styles.bullet}>•</TextDs>
                <TextDs style={styles.infoText}>Your purchased packages and subscriptions</TextDs>
              </FlexView>
              <FlexView style={styles.infoItem}>
                <TextDs style={styles.bullet}>•</TextDs>
                <TextDs style={styles.infoText}>All your preferences and settings</TextDs>
              </FlexView>
              <FlexView style={styles.infoItem}>
                <TextDs style={styles.bullet}>•</TextDs>
                <TextDs style={styles.infoText}>Your payment methods and transaction history</TextDs>
              </FlexView>
            </FlexView>
          </FlexView>

          {/* Buttons */}
          <FlexView style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <TextDs style={styles.cancelButtonText}>Cancel</TextDs>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, isLoading && styles.confirmButtonDisabled]}
              onPress={onConfirm}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <TextDs style={styles.confirmButtonText}>
                {isLoading ? 'Deleting...' : 'Yes, Delete Account'}
              </TextDs>
            </TouchableOpacity>
          </FlexView>
        </FlexView>
      </FlexView>
    </Modal>
  );
};

