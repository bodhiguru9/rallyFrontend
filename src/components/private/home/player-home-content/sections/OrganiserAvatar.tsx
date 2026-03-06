import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import type { Organiser } from '@screens/home/Home.types';
import { colors, spacing, borderRadius } from '@theme';
import { TextDs, FlexView, ImageDs } from '@components';

interface OrganiserAvatarProps {
  organiser: Organiser;
  onPress: (id: string, communityName?: string) => void;
}

const AVATAR_SIZE = 87;

export const OrganiserAvatar: React.FC<OrganiserAvatarProps> = ({ organiser, onPress }) => {
  const handlePress = () => {
    onPress(String(organiser.userId ?? organiser.id ?? ''), organiser.communityName);
  };

  return (
    <TouchableOpacity style={styles.item} onPress={handlePress} activeOpacity={0.8}>
      <FlexView style={styles.avatarWrapper}>
        <FlexView style={styles.avatarCont}>
          <Image
            source={{ uri: organiser.profilePic || undefined }}
            style={styles.avatar}
            resizeMode="cover"
          />
        </FlexView>
      </FlexView>

      <FlexView flexDirection="row" gap={spacing.xs} alignItems="center" position='relative' pb={6}>
        <TextDs size={10} weight="semibold" numberOfLines={1} align="center">
          {organiser.fullName}
        </TextDs>
        {organiser.isVerified && (
          <ImageDs image="VerifiedIcon" style={{ position: "absolute", right: -14, top: 0 }} size={10} />
        )}
      </FlexView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    width: 74,
    gap: spacing.sm,
  },
  avatarWrapper: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    padding: 2,
    experimental_backgroundImage:
      'linear-gradient(to top, #b0e0b0, #7bc7af, #50abad, #3a8da4, #3d6f92)',
  },
  avatarCont: {
    width: '100%',
    height: '100%',
    padding: 2,
    backgroundColor: colors.surface.defaultNP,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: borderRadius.full,
  },
  verifiedicon: {
    width: 16,
    height: 16,
  },
});
