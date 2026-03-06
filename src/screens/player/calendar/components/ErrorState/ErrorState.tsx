import React from 'react';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { spacing } from '@theme';

export const ErrorState: React.FC = () => {
  return (
    <FlexView flex={1} justifyContent="center" alignItems="center" padding={spacing.xl}>
      <TextDs size={14} weight="regular" color="error">
        Failed to load events
      </TextDs>
      <TextDs size={14} weight="regular" color="secondary" marginTop={spacing.sm}>
        Please try again later
      </TextDs>
    </FlexView>
  );
};
