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
