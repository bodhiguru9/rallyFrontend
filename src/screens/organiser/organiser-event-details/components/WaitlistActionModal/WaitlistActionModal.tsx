import React from 'react';
import { Modal, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { TextDs, FlexView } from '@components';
import { colors, spacing, borderRadius, withOpaqueForAndroid } from '@theme';
import type { WaitlistActionModalProps } from './WaitlistActionModal.types';

export const WaitlistActionModal: React.FC<WaitlistActionModalProps> = ({
  visible,
  playerName,
  playerProfilePic,
  onClose,
  onAccept,
  onReject,
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
          {/* Player Avatar */}
          <FlexView style={styles.avatarContainer}>
            <Image
              source={{
                uri: playerProfilePic || 'https://via.placeholder.com/100',
              }}
              style={styles.playerAvatar}
            />
          </FlexView>

          {/* Title */}
          <TextDs size={14} weight="regular" color="primary" style={styles.title}>
            {playerName}
          </TextDs>

          {/* Message */}
          <TextDs size={14} weight="regular" color="secondary" style={styles.message}>
            Do you want to accept or reject this player from the waitlist?
          </TextDs>

          {/* Buttons */}
          <FlexView style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={onReject}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.status.error} />
              ) : (
                <TextDs size={14} weight="regular" color="error">
                  Reject
                </TextDs>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={onAccept}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.text.white} />
              ) : (
                <TextDs size={14} weight="regular" color="white">
                  Accept
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
  avatarContainer: {
    marginBottom: spacing.lg,
  },
  playerAvatar: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
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
  acceptButton: {
    backgroundColor: colors.status.success,
  },
  rejectButton: {
    backgroundColor: withOpaqueForAndroid('rgba(244, 67, 54, 0.1)'),
  },
});
