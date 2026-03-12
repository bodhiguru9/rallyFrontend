import React from 'react';
import { StyleSheet } from 'react-native';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { colors, spacing, borderRadius } from '@theme';
import type { EventStatusBadgeProps, EventStatusBadgeVariant } from './EventStatusBadge.types';

const variantStyles: Record<
  EventStatusBadgeVariant,
  { background: string; label: string; width?: number }
> = {
  going: {
    background: colors.greenbutton,
    label: 'Going',
    width: 50,
  },
  ongoing: {
    background: colors.status.error,
    label: 'Ongoing',
    width: 60,
  },
  'payment-pending': {
    background: colors.status.warning,
    label: 'Payment Pending',
    width: 95,
  },
  'pending-approval': {
    background: colors.status.warning,
    label: 'Pending Approval',
    width: 100,
  },
  cancelled: {
    background: colors.status.error,
    label: 'Cancelled',
    width: 65,
  },
  'registration-soon': {
    background: colors.status.info,
    label: 'Registration Soon',
    width: 105,
  },
  'registration-ended': {
    background: colors.text.secondary,
    label: 'Registration Ended',
    width: 110,
  },
  'request-rejected': {
    background: colors.status.error,
    label: 'Request Rejected',
    width: 105,
  },
};

export const EventStatusBadge: React.FC<EventStatusBadgeProps> = ({ variant, style }) => {
  const { background, label, width = 50 } = variantStyles[variant];

  return (
    <FlexView
      borderRadius={borderRadius.full}
      px={spacing.sm}
      width={width}
      height={14}
      alignItems="center"
      justifyContent="center"
      boxShadow={colors.glass.boxShadow.light}
      backgroundColor={background}
      position="absolute"
      bottom={-7}
      left={25}
      style={[styles.container, style]}
    >
      <TextDs size={10} weight="regular" color="white">
        {label}
      </TextDs>
    </FlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 14,
  },
});
