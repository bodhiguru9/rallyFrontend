import React from 'react';
import { ActivityIndicator } from 'react-native';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { colors, spacing } from '@theme';

export const LoadingState: React.FC = () => {
  return (
    <FlexView flex={1} justifyContent="center" alignItems="center" padding={spacing.xl}>
      <ActivityIndicator size="large" color={colors.primary} />
      <TextDs size={14} weight="regular" color="secondary">
        Loading events...
      </TextDs>
    </FlexView>
  );
};
