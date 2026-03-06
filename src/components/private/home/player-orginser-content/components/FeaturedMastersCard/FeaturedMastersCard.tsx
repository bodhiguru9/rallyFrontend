import React from 'react';
import { TextDs,  FlexView } from '@components';
import {TouchableOpacity, StyleSheet} from 'react-native';
import { colors, spacing, borderRadius, getFontStyle, withOpaqueForAndroid } from '@theme';

interface FeaturedMastersCardProps {
  name: string;
  organizerName: string;
  hostedCount: number;
  attendeesCount: number;
  tags: string[];
  mastersText: string;
  backgroundColor: string;
  onPress: () => void;
}

export const FeaturedMastersCard: React.FC<FeaturedMastersCardProps> = ({
  name,
  organizerName,
  hostedCount,
  attendeesCount,
  tags,
  mastersText,
  backgroundColor,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Badges */}
      <FlexView style={styles.badgesContainer}>
        <FlexView style={styles.badge}>
          <TextDs style={styles.badgeText}>{hostedCount} Hosted</TextDs>
        </FlexView>
        <FlexView style={[styles.badge, styles.badgeYellow]}>
          <TextDs style={[styles.badgeText, styles.badgeTextYellow]}>
            {attendeesCount} Attendees
          </TextDs>
        </FlexView>
      </FlexView>

      {/* MASTERS Section */}
      <FlexView style={styles.mastersContainer}>
        <FlexView style={styles.flagsContainer}>
          {[1, 2, 3, 4, 5].map((i) => (
            <FlexView key={i} style={styles.flag} />
          ))}
        </FlexView>
        <TextDs style={styles.mastersText}>{mastersText}</TextDs>
      </FlexView>

      {/* Content */}
      <FlexView style={styles.content}>
        <TextDs style={styles.title}>{name}</TextDs>
        <TextDs style={styles.organizer}>By {organizerName}</TextDs>

        {/* Tags */}
        <FlexView style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <FlexView key={index} style={styles.tag}>
              <TextDs style={styles.tagText}>{tag}</TextDs>
            </FlexView>
          ))}
        </FlexView>
      </FlexView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    minHeight: 240,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  badge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  badgeYellow: {
    backgroundColor: '#FBBF24',
  },
  badgeText: {
    ...getFontStyle(8, 'medium'),
    color: colors.text.white,
  },
  badgeTextYellow: {
    color: colors.text.primary,
  },
  mastersContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  flagsContainer: {
    flexDirection: 'row',
    gap: spacing.xs / 2,
    marginBottom: spacing.xs,
  },
  flag: {
    width: 20,
    height: 14,
    backgroundColor: colors.text.white,
    borderRadius: 2,
    opacity: 0.8,
  },
  mastersText: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.white,
    letterSpacing: 2,
  },
  content: {
    marginTop: 'auto',
  },
  title: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.white,
    marginBottom: spacing.xs / 2,
    textTransform: 'uppercase',
  },
  organizer: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.white,
    opacity: 0.9,
    marginBottom: spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    alignItems: 'center',
  },
  tag: {
    backgroundColor: withOpaqueForAndroid('rgba(255, 255, 255, 0.3)'),
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  tagText: {
    ...getFontStyle(8, 'medium'),
    color: colors.text.white,
  },
});
