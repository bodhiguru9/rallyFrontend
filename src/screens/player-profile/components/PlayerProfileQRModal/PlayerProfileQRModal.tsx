import React from 'react';
import { TextDs, FlexView } from '@components';
import { Modal, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { colors } from '@theme';
import type { PlayerProfileQRModalProps } from './PlayerProfileQRModal.types';
import { styles } from './style/PlayerProfileQRModal.styles';

const QR_SIZE = 180;

export const PlayerProfileQRModal: React.FC<PlayerProfileQRModalProps> = ({
  visible,
  profileLink,
  playerName,
  onClose,
}) => {
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
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <FlexView style={styles.header}>
            <TextDs style={styles.title}>Share Player Profile</TextDs>
            <TextDs style={styles.subtitle}>{playerName}</TextDs>
          </FlexView>

          <View style={styles.qrWrapper}>
            <QRCode
              value={profileLink}
              size={QR_SIZE}
              color={colors.text.primary}
              backgroundColor={colors.background.white}
            />
          </View>

          <FlexView style={styles.linkContainer}>
            <TextDs style={styles.linkLabel}>Profile link</TextDs>
            <TextDs style={styles.linkText} numberOfLines={2}>
              {profileLink}
            </TextDs>
          </FlexView>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <TextDs style={styles.closeButtonText}>Close</TextDs>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
