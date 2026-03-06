import React from 'react';
import { Modal, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { TextDs, FlexView, ImageDs } from '@components';
import { colors, spacing, borderRadius, withOpaqueForAndroid } from '@theme';
import type { RemovePlayerModalProps } from './RemovePlayerModal.types';

export const RemovePlayerModal: React.FC<RemovePlayerModalProps> = ({
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
        <FlexView style={styles.modalContent}>
          {/* Trash Icon */}
          <FlexView style={styles.iconContainer}>
            <FlexView style={styles.trashIcon}>
              <ImageDs image="RemoveBin" size={100} fit="contain" />
            </FlexView>
          </FlexView>

          {/* Title */}
          <TextDs size={14} weight="regular" color="primary" style={styles.title}>
            Remove Player?
          </TextDs>

          {/* Message */}
          <TextDs size={14} weight="regular" color="secondary" style={styles.message}>
            The player will get a full refund if you remove them from the booking.
          </TextDs>

          {/* Buttons */}
          <FlexView style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <TextDs size={14} weight="regular" color="white">
                Close
              </TextDs>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.removeButton]}
              onPress={onConfirm}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.status.error} />
              ) : (
                <TextDs size={14} weight="regular" color="white">
                  Remove Player
                </TextDs>
              )}
            </TouchableOpacity>
          </FlexView>
        </FlexView>
      </FlexView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.surface.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.background.cream,
    borderRadius: borderRadius.xxl,
    padding: spacing.base,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  trashIcon: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  message: {
    marginBottom: spacing.xl,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  closeButton: {
    backgroundColor: colors.primary,
  },
  removeButton: {
    backgroundColor: withOpaqueForAndroid('rgba(244, 67, 54, 0.1)'),
  },
});
