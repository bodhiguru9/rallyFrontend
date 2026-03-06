import React from 'react';
import { TextDs, FlexView, ImageDs } from '@components';
import { TouchableOpacity, Image } from 'react-native';
import { colors } from '@theme';
import type { FollowerItemProps } from './FollowerItem.types';
import { styles } from './style/FollowerItem.styles';

export const FollowerItem: React.FC<FollowerItemProps> = ({
  follower,
  onRemove,
}) => {
  const handleRemove = () => {
    onRemove(follower.userId ?? Number(follower.id) ?? 0);
  };

  return (
    <FlexView style={styles.container}>
      <FlexView style={styles.avatarContainer}>
        {follower.profilePic ? (
          <Image source={{ uri: follower.profilePic }} style={styles.avatar} />
        ) : (
          <ImageDs image="UserGray" style={styles.avatar} />
        )}
      </FlexView>

      <FlexView style={styles.content}>
        <TextDs style={styles.name}>{follower.fullName ?? follower.name ?? ''}</TextDs>
      </FlexView>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={handleRemove}
        activeOpacity={0.7}
      >
        <TextDs style={styles.removeButtonText}>Remove</TextDs>
      </TouchableOpacity>
    </FlexView>
  );
};

