import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import type { KeyboardAvoidingWrapperProps } from './KeyboardAvoidingWrapper.types';

export const KeyboardAvoidingWrapper: React.FC<KeyboardAvoidingWrapperProps> = ({
  children,
  style,
  behavior = 'padding',
  keyboardVerticalOffset = 0,
  enabled = true,
  scrollable = false,
}) => {
  const content = scrollable ? (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    children
  );

  // Android handles keyboard via windowSoftInputMode; avoid double adjustment
  if (Platform.OS === 'android' || !enabled) {
    return <View style={[{ flex: 1 }, style]}>{content}</View>;
  }

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, style]}
      behavior={behavior}
      keyboardVerticalOffset={keyboardVerticalOffset}
      enabled={enabled}
    >
      {content}
    </KeyboardAvoidingView>
  );
};

