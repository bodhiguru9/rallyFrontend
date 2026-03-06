import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { avatarSize, borderRadius, typography } from '@theme';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { getInitials } from '@utils/string-utils';
import type { AvatarProps, AvatarSizeKey } from './Avatar.types';
import { styles } from './style/Avatar.styles';

const AVATAR_INITIALS_FONT_SIZE: Record<AvatarSizeKey, keyof typeof typography.fontSize> = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  xxl: 16,
  xxxl: 20,
};

export const Avatar: React.FC<AvatarProps> = ({
  imageUri,
  fullName,
  initials: initialsOverride,
  size = 'md',
  onPress,
}) => {
  const sizePx = avatarSize[size];
  const hasImage = imageUri != null && imageUri !== '';
  const initials = initialsOverride ?? (fullName !== undefined ? getInitials(fullName) : '?');
  const fontSize = typography.fontSize[AVATAR_INITIALS_FONT_SIZE[size]];

  const content = (
    <FlexView
      style={[
        styles.container,
        {
          width: sizePx,
          height: sizePx,
          borderRadius: borderRadius.full,
        },
      ]}
    >
      {hasImage ? (
        <Image
          source={{ uri: imageUri ?? '' }}
          style={[styles.image, { width: sizePx, height: sizePx, borderRadius: sizePx / 2 }]}
        />
      ) : (
        <FlexView style={styles.placeholder}>
          <TextDs style={[styles.initials, { fontSize }]} numberOfLines={1}>
            {initials}
          </TextDs>
        </FlexView>
      )}
    </FlexView>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};
