import React from 'react';
import { TextDs } from '@designSystem/atoms/TextDs';
import { TouchableOpacity } from 'react-native';
import { Activity, Bookmark, ChevronDown, TrendingUp } from 'lucide-react-native';
import { colors } from '@theme';
import { IFilterChipProps } from './FilterChip.types';
import { styles } from './style/FilterChip.style';

const FILTER_CHIP_ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  activity: Activity,
  'trending-up': TrendingUp,
  bookmark: Bookmark,
};

export const FilterChip: React.FC<IFilterChipProps> = ({ label, isActive, onPress, icon }) => {
  const iconColor = isActive ? colors.text.white : colors.text.secondary;
  const IconComponent = icon ? FILTER_CHIP_ICON_MAP[icon] : null;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, isActive ? styles.active : styles.inactive]}
      activeOpacity={0.7}
    >
      {IconComponent && <IconComponent size={14} color={iconColor} />}
      <TextDs style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
        {label}
      </TextDs>
      <ChevronDown size={14} color={iconColor} />
    </TouchableOpacity>
  );
};
