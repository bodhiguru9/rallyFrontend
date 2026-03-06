import React from 'react';
import { TextDs, FlexView } from '@components';
import { StyleSheet } from 'react-native';
import { Award } from 'lucide-react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

interface CreditsCardProps {
  credits: number;
  validity: string;
}

export const CreditsCard: React.FC<CreditsCardProps> = ({ credits, validity }) => {
  return (
    <FlexView style={styles.container}>
      <Award size={32} color="#FBBF24" />
      <TextDs style={styles.creditsText}>{credits} Credits</TextDs>
      <TextDs style={styles.validityText}>
        Redeem credits on events by this organiser. Validity {validity}
      </TextDs>
    </FlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFDEF80',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.sm,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  creditsText: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  validityText: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
