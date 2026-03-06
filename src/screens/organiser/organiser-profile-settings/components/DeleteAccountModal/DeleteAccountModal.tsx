import React, { useEffect, useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { FlexView, ImageDs, TextDs } from '@components';
import { useDeleteAccount } from '@hooks/use-delete-account';
import { colors } from '@theme';
import type { DeleteAccountModalProps } from './DeleteAccountModal.types';
import { styles } from './style/DeleteAccountModal.styles';

const COUNTDOWN_SECONDS = 5;

/**
 * Modal to confirm deleting the organiser account. Uses gradient main background,
 * 5 second countdown before Delete is enabled, and rounded buttons.
 */
export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  visible,
  onClose,
  onDeleteSuccess,
}) => {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const { deleteAccount, isLoading: isDeleting } = useDeleteAccount();

  const canDelete = countdown <= 0;

  // Reset and run countdown when modal opens
  useEffect(() => {
    if (!visible) {
      setCountdown(COUNTDOWN_SECONDS);
      return;
    }
    setCountdown(COUNTDOWN_SECONDS);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [visible]);

  const handleDelete = async () => {
    if (!canDelete || isDeleting) return;
    try {
      const success = await deleteAccount();
      if (success) {
        onDeleteSuccess?.();
        onClose();
      }
    } catch {
      // deleteAccount already shows Alert on error
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View>
          <FlexView
            style={[styles.card, { experimental_backgroundImage: colors.gradient.mainBackground }]}
          >
            <FlexView style={styles.iconContainer}>
              <ImageDs image="removeBin" size={80} />
            </FlexView>
            <TextDs style={styles.title}>Delete Account</TextDs>
            <TextDs style={styles.subtitle} numberOfLines={4}>
              This action cannot be reversed. Your profile and all associated
              data will be permanently deleted.
            </TextDs>
            {countdown > 0 ? (
              <TextDs style={styles.timerText}>
                You can confirm in {countdown} second{countdown !== 1 ? 's' : ''}...
              </TextDs>
            ) : null}
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.7}
                style={[styles.button, styles.closeButton]}
              >
                <TextDs style={[styles.buttonText, styles.closeButtonText]}>
                  Close
                </TextDs>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                disabled={!canDelete || isDeleting}
                activeOpacity={0.7}
                style={[
                  styles.button,
                  styles.deleteButton,
                  (!canDelete || isDeleting) && styles.deleteButtonDisabled,
                ]}
              >
                <TextDs style={[styles.buttonText, styles.deleteButtonText]}>
                  {isDeleting ? 'Deleting...' : canDelete ? 'Delete' : `Delete (${countdown}s)`}
                </TextDs>
              </TouchableOpacity>
            </View>
          </FlexView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
