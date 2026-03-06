import React from 'react';
import { TextDs,  FlexView } from '@components';
import {Image, StyleSheet} from 'react-native';
import { Award, Users } from 'lucide-react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

interface OrganiserCardProps {
  name: string;
  profileImage: string;
  hostedCount: number;
  attendeesCount: number;
}

export const OrganiserCard: React.FC<OrganiserCardProps> = ({
  name,
  profileImage,
  hostedCount,
  attendeesCount,
}) => {
  return (
    <FlexView style={styles.container}>
      <Image source={{ uri: profileImage }} style={styles.avatar} resizeMode="cover" />
      <FlexView style={styles.info}>
        <TextDs style={styles.name}>{name}</TextDs>
        <FlexView style={styles.badgesContainer}>
          <FlexView style={styles.badge}>
            <Award size={12} color={colors.primary} />
            <TextDs style={styles.badgeText}>{hostedCount} Hosted</TextDs>
          </FlexView>
          <FlexView style={styles.badge}>
            <Users size={12} color={colors.primary} />
            <TextDs style={styles.badgeText}>{attendeesCount} Attendees</TextDs>
          </FlexView>
        </FlexView>
      </FlexView>
    </FlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
    backgroundColor: colors.surface.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    ...getFontStyle(6, 'medium'),
    color: colors.primary,
  },
});
