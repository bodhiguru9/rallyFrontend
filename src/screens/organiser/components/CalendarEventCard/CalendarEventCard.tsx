import React, { useState } from 'react';
import { TextDs, FlexView, ImageDs } from '@components';
import { TouchableOpacity, Image } from 'react-native';
import { User } from 'lucide-react-native';
import { colors } from '@theme';
import type { CalendarEventCardProps } from './CalendarEventCard.types';
import { styles } from './style/CalendarEventCard.styles';
import { IconTag } from '@components/global/IconTag';
import { MembersModal } from '@screens/event-details/MembersModal';
import { useEvent } from '@hooks/use-events';
import { calculateSpotsFilled } from '@utils';
import type { EventData } from '@app-types';

export const CalendarEventCard: React.FC<CalendarEventCardProps> = ({
  event,
  onPress,
}) => {
  const [isMembersModalVisible, setIsMembersModalVisible] = useState(false);

  const { data: fullEvent } = useEvent(event.id, {
    enabled: isMembersModalVisible,
    allowPrivate: true,
  });

  const handlePress = () => {
    if (onPress) {
      onPress(event.id);
    }
  };

  const handleOpenMembersModal = () => {
    setIsMembersModalVisible(true);
  };

  const handleCloseMembersModal = () => {
    setIsMembersModalVisible(false);
  };

  const displayParticipants = fullEvent?.participants || event.participants.map(p => ({
    userId: parseInt(p.id),
    profilePic: p.avatar,
    fullName: 'Player',
  }));

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: event.image }} style={styles.image} />
      <FlexView style={styles.content}>
        <TextDs style={styles.title}>{event.title}</TextDs>

        <FlexView style={styles.tagsContainer}>
          <IconTag title={event.sport} />
          <IconTag title={event.eventType} />
        </FlexView>

        <FlexView style={styles.infoRow}>
          <ImageDs image="Time" size={16} />
          <TextDs style={styles.infoText}>
            {event.date}, {event.time}
          </TextDs>
        </FlexView>

        <FlexView style={styles.infoRow}>
          <ImageDs image='LocationPin' size={16} />
          <TextDs style={styles.infoText}>{event.location}</TextDs>
        </FlexView>

        <TouchableOpacity 
          style={styles.participantsContainer} 
          onPress={handleOpenMembersModal}
          activeOpacity={0.7}
        >
          {event.participants.slice(0, 4).map((participant, index) => (
            <FlexView
              key={participant.id}
              style={[
                styles.participantAvatar,
                { marginLeft: index > 0 ? -8 : 0 },
              ]}
            >
              {participant.avatar ? (
                <Image
                  source={{ uri: participant.avatar }}
                  style={styles.avatarImage}
                />
              ) : (
                <FlexView style={styles.avatarPlaceholder}>
                  <User size={12} color={colors.text.secondary} />
                </FlexView>
              )}
            </FlexView>
          ))}
          <TextDs style={styles.spotsText}>
            {fullEvent ? `${calculateSpotsFilled(fullEvent)}/${fullEvent.eventMaxGuest} joined` : 'View Members'}
          </TextDs>
        </TouchableOpacity>
      </FlexView>

      <MembersModal
        visible={isMembersModalVisible}
        eventTitle={event.title}
        organizerName="You"
        participants={displayParticipants as any[]}
        spotsFilled={fullEvent ? calculateSpotsFilled(fullEvent) : event.participants.length}
        totalSpots={fullEvent?.eventMaxGuest || event.participants.length}
        isLoading={!fullEvent && isMembersModalVisible}
        onClose={handleCloseMembersModal}
      />
    </TouchableOpacity>
  );
};

