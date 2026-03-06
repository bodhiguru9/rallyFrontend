import React from 'react';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { spacing } from '@theme';
import type { CalendarTab } from '../calendar.types';

interface EmptyStateProps {
  tab: CalendarTab;
}

function getEmptyMessage(tab: CalendarTab): string {
  if (tab === 'all') return 'No events';
  if (tab === 'upcoming') return 'No upcoming events';
  return 'No past events';
}

export const EmptyState: React.FC<EmptyStateProps> = ({ tab }) => {
  return (
    <FlexView flex={1} justifyContent="center" alignItems="center" padding={spacing.xl}>
      <TextDs size={14} weight="regular" color="secondary">
        {getEmptyMessage(tab)}
      </TextDs>
      <TextDs size={14} weight="regular" color="tertiary" marginTop={spacing.sm}>
        Your calendar is empty
      </TextDs>
    </FlexView>
  );
};
