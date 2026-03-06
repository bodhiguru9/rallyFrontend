import React from 'react';
import { StyleSheet, Pressable, Platform } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';
import { FlexView } from '@designSystem/atoms/FlexView';
import { Card } from '@components/global/Card';
import { TextDs, ImageDs } from '@components';
import { IconTag } from '@components/global/IconTag';

interface PackageCardProps {
  title: string;
  validity: string;
  sport: string;
  eventType: string;
  numberOfEvents: number;
  price: number;
  currency?: string;
  onPress: () => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  title,
  validity,
  sport,
  eventType,
  numberOfEvents,
  price,
  onPress,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        Platform.OS === 'ios' && pressed && { opacity: 0.7 },
      ]}
      onPress={onPress}
      android_ripple={{ color: `${colors.primary}20`, borderless: false }}
    >
      <Card>
        <FlexView isFullWidth row justifyContent='space-between' mb={spacing.xs}>
          <TextDs size={14} weight="regular">{title}</TextDs>
          <FlexView px={spacing.sm} py={spacing.xs} rounded glassBg borderWhite>
            <TextDs color='blueGray' size={14} weight="regular">Validity: {validity}</TextDs>
          </FlexView>
        </FlexView>

        <FlexView mb={spacing.sm} >
          <IconTag title={sport} />
        </FlexView>

        <FlexView row isFullWidth alignItems='center' justifyContent='space-between'>
          <FlexView row alignItems='center' justifyContent='center' gap={spacing.xxl}>

            {/* Block 1: Changed alignItems to 'flex-start' */}
            <FlexView alignItems='flex-start' gap={spacing.xs} justifyContent='center'>
              {/* Optional: You may also want to change the label align to 'left' for consistency */}
              <TextDs align='left' size={10} weight="regular" color='secondary'>Event Type</TextDs>
              <TextDs align='left' size={14} weight="bold">{eventType}</TextDs>
            </FlexView>

            {/* Block 2: Changed alignItems to 'flex-start' */}
            <FlexView alignItems='flex-start' gap={spacing.xs} justifyContent='center'>
              <TextDs align='left' size={10} weight="regular" color='secondary'>No of Events</TextDs>
              <TextDs align='left' size={14} weight="bold">{numberOfEvents}</TextDs>
            </FlexView>

          </FlexView>

          <FlexView row alignItems='center' gap={spacing.sm}>
            <ImageDs image="DhiramIcon" size={12} />
            <TextDs size={14} weight="regular" color="blueGray">
              {price}
            </TextDs>
          </FlexView>
        </FlexView>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
  },
  validity: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.secondary,
  },
  sportTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
    backgroundColor: colors.surface.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  sportText: {
    ...getFontStyle(8, 'medium'),
    color: colors.primary,
  },
  detailsContainer: {
    marginBottom: spacing.md,
  },
  detailRow: {
    marginBottom: spacing.xs,
  },
  detailLabel: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.secondary,
    marginBottom: 2,
  },
  detailValue: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.primary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
  },
});
