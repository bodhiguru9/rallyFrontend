import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, borderRadius } from '@theme';
import { getInitials } from '@utils/string-utils';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import type { ParticipantProfilesProps } from './ParticipantProfiles.types';

export const ParticipantProfiles: React.FC<ParticipantProfilesProps> = ({
  participants,
  onViewAllPress,
}) => {
  const displayParticipants = participants.slice(0, 4);

  const viewAllCircle = (
    <FlexView
      width={30}
      aspectRatio={1 / 1}
      borderRadius={borderRadius.full}
      backgroundColor={colors.primary}
      zIndex={10}
      alignItems="center"
      justifyContent="center"
    >
      <TextDs size={8} weight="regular" color="white">
        View
      </TextDs>
      <TextDs size={8} weight="regular" color="white">
        All
      </TextDs>
    </FlexView>
  );

  return (
    <FlexView flexDirection="row" alignItems="center">
      <FlexView alignItems="center" flexDirection="row">
        {displayParticipants.map((participant, idx) => {
          const hasProfilePic =
            participant.profilePic != null && participant.profilePic !== '';
          return (
            <FlexView key={participant.userId} width={15} height={30} position='relative' zIndex={idx}>
              <FlexView
                width={30}
                aspectRatio={1 / 1}
                borderRadius={borderRadius.full}
                overflow="hidden"
                zIndex={idx + 1}
                backgroundColor={!hasProfilePic ? colors.background.tertiary : undefined}
                alignItems="center"
                justifyContent="center"
              >
                {hasProfilePic ? (
                  <Image
                    source={{ uri: participant.profilePic ?? '' }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <TextDs
                    size={10}
                    weight="semibold"
                    color="secondary"
                    numberOfLines={1}
                    style={styles.avatarInitials}
                  >
                    {getInitials(participant.fullName)}
                  </TextDs>
                )}
              </FlexView>
            </FlexView>
          );
        })}
        <FlexView width={20} height={30} position='relative' zIndex={10}>
          {onViewAllPress ? (
            <TouchableOpacity onPress={onViewAllPress} activeOpacity={0.7}>
              {viewAllCircle}
            </TouchableOpacity>
          ) : (
            viewAllCircle
          )}
        </FlexView>
      </FlexView>
    </FlexView>
  );
};

const styles = StyleSheet.create({
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarInitials: {
    textAlign: 'center',
    maxWidth: '100%',
  },
});
