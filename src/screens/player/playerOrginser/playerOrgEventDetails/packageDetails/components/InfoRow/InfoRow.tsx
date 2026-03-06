import React from 'react';
import { TextDs, FlexView } from '@components';
import { StyleSheet } from 'react-native';
import { Calendar, MapPin } from 'lucide-react-native';
import { colors, spacing, getFontStyle } from '@theme';

const ICON_MAP = { calendar: Calendar, 'map-pin': MapPin } as const;
type InfoRowIcon = keyof typeof ICON_MAP;

interface InfoRowProps {
  icon: InfoRowIcon;
  text: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({ icon, text }) => {
  const IconComponent = ICON_MAP[icon] ?? Calendar;
  return (
    <FlexView style={styles.container}>
      <IconComponent size={18} color={colors.primary} />
      <TextDs style={styles.text}>{text}</TextDs>
    </FlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  text: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.primary,
  },
});
