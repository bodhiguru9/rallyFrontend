import React from 'react';
import { TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { colors, spacing, borderRadius } from '@theme';
import type { InstagramTagProps } from './InstagramTag.types';
import { ImageDs } from '@components';
import { TextDs } from '@designSystem/atoms/TextDs';

/**
 * Extracts Instagram username from a profile URL or returns the username as-is
 * Handles various Instagram URL formats:
 * - https://instagram.com/username
 * - https://www.instagram.com/username
 * - instagram.com/username
 * - @username
 * - username
 */
const extractUsername = (input: string): string => {
  if (!input) {
    return '';
  }

  // Remove whitespace
  const trimmed = input.trim();

  // If it's a URL, extract username
  if (trimmed.includes('instagram.com/')) {
    try {
      // Extract the path part after instagram.com/
      const match = trimmed.match(/instagram\.com\/([^/?#]+)/);
      if (match && match[1]) {
        return match[1];
      }
      return '';
    } catch (error) {
      console.error('Failed to parse Instagram URL:', error);
      return trimmed;
    }
  }

  // If it starts with @, remove it for extraction
  return trimmed.replace('@', '');
};

export const InstagramTag: React.FC<InstagramTagProps> = ({
  instagramLink,
  onPress,
  showIcon = true,
  disabled = false,
}) => {
  const username = extractUsername(instagramLink);

  const handlePress = () => {
    if (disabled || !username) {
      return;
    }

    if (onPress) {
      onPress(username);
    } else {
      // Default behavior: open Instagram profile
      const instagramUrl = `https://instagram.com/${username}`;
      Linking.openURL(instagramUrl).catch((err) =>
        console.error('Failed to open Instagram profile:', err)
      );
    }
  };

  if (!username) {
    return null;
  }

  const displayUsername = `${username}`;

  return (
    <TouchableOpacity
      style={[
        styles.container,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      {showIcon && (
        <ImageDs image="InstaIcon" size={16} />
      )}
      <TextDs size={14} weight="regular">
        {displayUsername}
      </TextDs>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
    backgroundColor: colors.glass.background.white,
    borderWidth: 1,
    borderColor: colors.border.white
  },
});
