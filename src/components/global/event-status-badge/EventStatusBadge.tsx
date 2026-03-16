import React from 'react';
import { StyleSheet } from 'react-native';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { colors, spacing, borderRadius } from '@theme';
import type { EventStatusBadgeProps, EventStatusBadgeVariant } from './EventStatusBadge.types';

const variantStyles: Record<
  EventStatusBadgeVariant,
  { background: string; label: string }
> = {
  going: {
    background: colors.greenbutton,
    label: 'Going',
  },
  ongoing: {
    background: colors.status.error,
    label: 'Ongoing',
  },
  'payment-pending': {
    background: colors.status.warning,
    label: 'Payment Pending',
  },
  'pending-approval': {
    background: colors.status.warning,
    label: 'Pending Approval',
  },
  cancelled: {
    background: colors.status.error,
    label: 'Cancelled',
  },
  'registration-soon': {
    background: colors.status.info,
    label: 'Registration Soon',
  },
  'registration-ended': {
    background: colors.text.secondary,
    label: 'Registration Ended',
  },
  'request-rejected': {
    background: colors.status.error,
    label: 'Request Rejected',
  },
};

export const EventStatusBadge: React.FC<EventStatusBadgeProps> = ({ variant, style }) => {
  const { background, label } = variantStyles[variant];

  return (
    <FlexView
      position="absolute"
      bottom={-7}
      left={0}
      right={0}
      alignItems="center"
      justifyContent="center"
      pointerEvents="none"
    >
      <FlexView
        borderRadius={borderRadius.full}
        px={spacing.sm}
        height={14}
        alignItems="center"
        justifyContent="center"
        boxShadow={colors.glass.boxShadow.light}
        backgroundColor={background}
        style={[styles.container, style]}
      >
        <TextDs size={10} weight="regular" color="white" numberOfLines={1}>
          {label}
        </TextDs>
      </FlexView>
    </FlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 14,
  },
});
