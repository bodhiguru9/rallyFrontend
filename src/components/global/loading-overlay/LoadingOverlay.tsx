import React from 'react';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { ActivityIndicator, StyleSheet, Modal, Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, getFontStyle, spacing, withOpaqueForAndroid } from '@theme';
import type { LoadingOverlayProps } from './LoadingOverlay.types';

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, message }) => {
  if (!visible) {
    return null;
  }

  return (
    <Modal transparent visible={visible} animationType="fade">
      <FlexView style={styles.container} pointerEvents="none">
        {Platform.OS === 'android' ? (
          <View style={styles.blurView}>
            <FlexView style={styles.content}>
              <ActivityIndicator size="large" color={colors.primary} />
              {message && <TextDs style={styles.message}>{message}</TextDs>}
            </FlexView>
          </View>
        ) : (
          <BlurView intensity={10} tint="dark" style={styles.blurView}>
            <FlexView style={styles.content}>
              <ActivityIndicator size="large" color={colors.primary} />
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
    backgroundColor: withOpaqueForAndroid('rgba(255, 255, 255, 0.95)'),
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
