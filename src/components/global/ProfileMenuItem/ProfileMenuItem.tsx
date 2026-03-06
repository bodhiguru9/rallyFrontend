import React from 'react';
import { TextDs, FlexView } from '@components';
import { TouchableOpacity, Image } from 'react-native';
import { ChevronRight, FileText } from 'lucide-react-native';
import { colors } from '@theme';
import type { ProfileMenuItemProps } from './ProfileMenuItem.types';
import { styles } from './style/ProfileMenuItem.styles';

const PROFILE_MENU_ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  'file-text': FileText,
};

export const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon,
  iconImage,
  iconColor = colors.primary,
  title,
  onPress,
  showArrow = true,
}) => {
  const IconComponent = icon ? PROFILE_MENU_ICON_MAP[icon] : null;
  return (
    <TouchableOpacity
      style={[styles.container]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <FlexView style={styles.content}>
        <FlexView style={styles.iconContainer}>
          {iconImage ? (
            <Image source={iconImage} style={styles.iconImage} resizeMode="contain" />
          ) : IconComponent ? (
            <IconComponent size={20} color={iconColor} />
          ) : null}
        </FlexView>
        <TextDs style={styles.title}>{title}</TextDs>
      </FlexView>
      {showArrow && <ChevronRight size={20} color={colors.text.secondary} />}
    </TouchableOpacity>
  );
};
