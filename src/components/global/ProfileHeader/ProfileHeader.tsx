import React from 'react';
import { TextDs, FlexView, ImageDs } from '@components';
import { TouchableOpacity } from 'react-native';
import { colors } from '@theme';
import { Avatar } from '@components';
import type { ProfileHeaderProps } from './ProfileHeader.types';
import { styles } from './style/ProfileHeader.styles';
import { IconTag } from '../IconTag';

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  imageUri,
  initials,
  name,
  sports,
  onEditProfile,
  onQRCodePress,
}) => {
  return (
    <FlexView style={styles.container}>
      <FlexView style={styles.profileSection}>
        <FlexView style={styles.avatarContainer}>
          <Avatar imageUri={imageUri} initials={initials} size="xxl" />
          <TouchableOpacity
            style={styles.editIconContainer}
            onPress={onEditProfile}
            activeOpacity={0.7}
          >
            <ImageDs image="pencil" size={14} />
          </TouchableOpacity>
        </FlexView>
        <FlexView style={styles.infoContainer}>
          <TextDs style={styles.name}>{name}</TextDs>
          <FlexView style={styles.sportsContainer}>
            {sports.map((sport, index) => (
              <IconTag key={index} title={sport.name} size='small' />
            ))}
          </FlexView>
        </FlexView>
        {onQRCodePress && (
          <TouchableOpacity style={styles.qrButton} onPress={onQRCodePress} activeOpacity={0.7}>
            <ImageDs image='qrCode' size={28} />
          </TouchableOpacity>
        )}
      </FlexView>
    </FlexView>
  );
};
