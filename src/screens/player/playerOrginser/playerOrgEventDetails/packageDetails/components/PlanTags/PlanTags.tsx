import React from 'react';
import { TextDs, FlexView } from '@components';
import { StyleSheet } from 'react-native';
import { Award, BookOpen, Tag, Users } from 'lucide-react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

const ICON_MAP = { users: Users, 'book-open': BookOpen, award: Award, tag: Tag } as const;
type TagIcon = keyof typeof ICON_MAP;

export interface Tag {
  label: string;
  icon: TagIcon | string;
}

interface PlanTagsProps {
  tags: Tag[];
}

export const PlanTags: React.FC<PlanTagsProps> = ({ tags }) => {
  return (
    <FlexView style={styles.container}>
      {tags.map((tag, index) => {
        const IconComponent = ICON_MAP[tag.icon as TagIcon] ?? Tag;
        return (
          <FlexView key={index} style={styles.tag}>
            <IconComponent size={14} color={colors.primary} />
            <TextDs style={styles.tagText}>{tag.label}</TextDs>
          </FlexView>
        );
      })}
    </FlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
    backgroundColor: colors.surface.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.full,
  },
  tagText: {
    ...getFontStyle(8, 'medium'),
    color: colors.primary,
  },
});
