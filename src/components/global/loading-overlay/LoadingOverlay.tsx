import React from 'react';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { StyleSheet, Modal, Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LoadingIndicator } from '../LoadingIndicator';
import { colors, getFontStyle, spacing } from '@theme';
import type { LoadingOverlayProps } from './LoadingOverlay.types';

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, message }) => {
  if (!visible) {
    return null;
  }

  const renderLoadingIndicator = () => {
    return <LoadingIndicator size={60} />;
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <FlexView style={styles.container} pointerEvents="none">
        {Platform.OS === 'android' ? (
          <View style={styles.blurView}>
            <FlexView style={styles.content}>
              {renderLoadingIndicator()}
              {message && <TextDs style={styles.message}>{message}</TextDs>}
            </FlexView>
          </View>
        ) : (
          <BlurView intensity={10} tint="dark" style={styles.blurView}>
            <FlexView style={styles.content}>
              {renderLoadingIndicator()}
              {message && <TextDs style={styles.message}>{message}</TextDs>}
            </FlexView>
          </BlurView>
        )}
      </FlexView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 120,
  },
  message: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.primary,
    marginTop: spacing.base,
    textAlign: 'center',
  },
});
