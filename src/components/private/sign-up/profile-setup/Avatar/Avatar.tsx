import React from 'react';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { Image, TouchableOpacity } from 'react-native';
import { avatarSize, borderRadius, colors, typography } from '@theme';
import { IAvatarProps } from './Avatar.types';
import { styles } from './style/Avatar.styles';

// Map avatar size to typography fontSize (scale: 6, 8, 10, 12, 14, 16, 20)
const AVATAR_INITIALS_FONT_SIZE: Record<
  keyof typeof avatarSize,
  keyof typeof typography.fontSize
> = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 20,
  xxl: 20,
  xxxl: 20,
};

export const Avatar: React.FC<IAvatarProps> = ({
  imageUri,
  initials = '?',
  size = 'xxl',
  onPress,
}) => {
  const sizeValue = avatarSize[size];
  const initialsFontSize = typography.fontSize[AVATAR_INITIALS_FONT_SIZE[size]];

  const content = (
    <FlexView
      style={[
        styles.container,
        {
          width: sizeValue,
          height: sizeValue,
          borderRadius: borderRadius.full,
          boxShadow: colors.boxShadow.lowRaised
        },
      ]}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={[
            styles.image,
            {
              width: sizeValue,
              height: sizeValue,
              borderRadius: sizeValue / 2,
            },
          ]}
        />
      ) : (
        <FlexView style={styles.placeholder}>
          <TextDs style={[styles.initials, { fontSize: initialsFontSize }]}>{initials}</TextDs>
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
