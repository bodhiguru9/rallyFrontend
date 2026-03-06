import React from 'react';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { spacing } from '@theme';
import type { CalendarTab } from '../../CalendarScreen.types';

interface EmptyStateProps {
  tab: CalendarTab;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ tab }) => {
  return (
    <FlexView flex={1} justifyContent="center" alignItems="center" padding={spacing.xl}>
      <TextDs size={14} weight="regular" color="secondary">
        No {tab === 'upcoming' ? 'upcoming' : 'past'} events
      </TextDs>
      <TextDs size={14} weight="regular" color="tertiary" marginTop={spacing.sm}>
        Your calendar is empty
      </TextDs>
    </FlexView>
  );
};
