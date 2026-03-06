import React from 'react';
import { TextDs, FlexView, ImageDs } from '@components';
import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';
import { formatDate } from '@utils';
import type { YellowBannerProps, BannerConfig, BannerVariant } from './YellowBanner.types';

// Banner configurations for different variants (titles overridden for registration when eventRegistrationStartTime is provided)
const BANNER_CONFIGS: Record<BannerVariant, BannerConfig> = {
  waitlist: {
    title: 'Event Capacity Reached',
    description:
      'You can join the waitlist and if a spot opens up, you will be notified. Upon payment, your spot will be booked.',
  },
  registration: {
    title: 'Registration starts on Tue 23 Oct, 3:00 PM',
  },
  private: {
    title: 'Approval Needed',
    description:
      'This event required host approval, once approved upon payment your spot will be confirmed.',
  },
};

export const YellowBanner: React.FC<YellowBannerProps> = ({ variant, eventRegistrationStartTime }) => {
  // Don't render anything if no variant is provided
  if (!variant) {
    return null;
  }

  const bannerConfig = BANNER_CONFIGS[variant];

  // For registration variant, use real date in same display format when provided
  const title =
    variant === 'registration' && eventRegistrationStartTime
      ? `Registration starts on ${formatDate(eventRegistrationStartTime, 'display')}`
      : bannerConfig.title;

  return (
    <FlexView alignItems='center' style={styles.banner}>
      <ImageDs image="WarningShield" style={styles.image} />
      <FlexView alignItems='center' style={styles.content}>
        <TextDs style={styles.title}>{title}</TextDs>
        {bannerConfig.description && (
          <TextDs style={styles.description} align='center'>{bannerConfig.description}</TextDs>
        )}
      </FlexView>
    </FlexView>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.card.primary,
    borderRadius: borderRadius.xxl,
    padding: spacing.base,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.white,
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
  },
  content: {
    flex: 1,
    gap: spacing.xxs,
  },
  title: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.primary,
  },
  description: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    lineHeight: 20,
  },
  image: {
    width: 30,
    height: 30,
  },
});
