import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { images, type ImageKey } from '@assets/images';
import type { ImageDsProps, ImageFit } from './ImageDs.types';

function toImageKey(name: string): ImageKey {
  const camel = name.charAt(0).toLowerCase() + name.slice(1);
  if (camel in images) {
    return camel as ImageKey;
  }
  return name as ImageKey;
}

const resizeModeMap: Record<ImageFit, 'contain' | 'cover' | 'stretch' | 'repeat' | 'center'> = {
  contain: 'contain',
  cover: 'cover',
  stretch: 'stretch',
  repeat: 'repeat',
  center: 'center',
};

export const ImageDs: React.FC<ImageDsProps> = ({
  image,
  size = 16,
  fit = 'contain',
  source,
  style,
  accessibilityLabel,
}) => {
  const key = toImageKey(image);
  const imageSource = source ?? images[key];

  return (
    <Image
      source={imageSource}
      style={[styles.base, { width: size, height: size }, style]}
      resizeMode={resizeModeMap[fit]}
      accessibilityLabel={accessibilityLabel}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    width: 16,
    height: 16,
  },
});
