import React from 'react';
import { TextDs } from '@components';
import {Pressable, Platform, StyleSheet, ScrollView} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

interface FilterBarProps {
  filters: Array<{ id: string; label: string }>;
  onFilterPress: (id: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterPress }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      nestedScrollEnabled={true}
    >
      {filters.map((filter) => (
        <Pressable
          key={filter.id}
          style={({ pressed }) => [
            styles.filterButton,
            Platform.OS === 'ios' && pressed && { opacity: 0.7 },
          ]}
          onPress={() => onFilterPress(filter.id)}
          android_ripple={{ color: `${colors.primary}30`, borderless: false }}
        >
          <TextDs style={styles.filterText}>{filter.label}</TextDs>
          <ChevronDown size={16} color={colors.text.primary} />
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.glass.background.white,
    borderRadius: borderRadius.md,
  },
  filterText: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.primary,
  },
});
