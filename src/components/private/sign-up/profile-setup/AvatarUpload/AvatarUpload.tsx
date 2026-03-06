import React from 'react';
import { TextDs } from '@designSystem/atoms/TextDs';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, avatarSize, getFontStyle } from '@theme';
import { FlexView } from '@designSystem/atoms/FlexView';
import { Camera } from 'lucide-react-native';

interface AvatarUploadProps {
  initials?: string;
  imageUri?: string;
  size?: keyof typeof avatarSize;
  onPress: () => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  initials = 'AR',
  imageUri,
  size = 'xxxl',
  onPress,
}) => {
  const avatarSizeValue = avatarSize[size];

  return (
    <FlexView style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.avatarContainer, { width: avatarSizeValue, height: avatarSizeValue }]}
        activeOpacity={0.8}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatarImage} />
        ) : (
          <FlexView
            padding={spacing.sm}
            backgroundColor={colors.background.white}
            borderRadius={borderRadius.full}
          >
            <FlexView style={[styles.avatarPlaceholder]}>
              <TextDs style={styles.initials}>{initials}</TextDs>
            </FlexView>
          </FlexView>
        )}
        <FlexView style={styles.cameraIconContainer}>
          <Camera size={16} color={colors.primaryDark} />
        </FlexView>
      </TouchableOpacity>
    </FlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.full,
  },
  avatarPlaceholder: {
    aspectRatio: 1 / 1,
    borderRadius: borderRadius.full,
    experimental_backgroundImage: colors.gradient.blueRadial,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: colors.primary,
    zIndex: 10,
    ...getFontStyle(20, 'medium'),
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.cream,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background.white,
  },
});
