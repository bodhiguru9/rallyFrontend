import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FlexView, TextDs } from '@components';
import { colors, spacing, borderRadius } from '@theme';

type Tab = 'about' | 'members' | 'invite';

interface TabSelectorProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onTabChange }) => {
  return (
    <FlexView isFullWidth row backgroundColor={colors.glass.background.white} borderWhite rounded>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'about' && styles.activeTab]}
        onPress={() => onTabChange('about')}
        activeOpacity={0.8}
      >
        <TextDs
          size={14} weight="regular"
          color={activeTab === 'about' ? 'white' : 'primary'}
        >
          About
        </TextDs>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'members' && styles.activeTab]}
        onPress={() => onTabChange('members')}
        activeOpacity={0.8}
      >
        <TextDs
          size={14} weight="regular"
          color={activeTab === 'members' ? 'white' : 'primary'}
        >
          Members
        </TextDs>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'invite' && styles.activeTab]}
        onPress={() => onTabChange('invite')}
        activeOpacity={0.8}
      >
        <TextDs
          size={14} weight="regular"
          color={activeTab === 'invite' ? 'white' : 'primary'}
        >
          Invite
        </TextDs>
      </TouchableOpacity>
    </FlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
});
