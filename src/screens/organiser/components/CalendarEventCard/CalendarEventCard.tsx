import React from 'react';
import { TextDs, FlexView, ImageDs } from '@components';
import { TouchableOpacity, Image } from 'react-native';
import { Activity, User, Users } from 'lucide-react-native';
import { colors } from '@theme';
import type { CalendarEventCardProps } from './CalendarEventCard.types';
import { styles } from './style/CalendarEventCard.styles';

export const CalendarEventCard: React.FC<CalendarEventCardProps> = ({
  event,
  onPress,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(event.id);
    }
  };

  const getCategoryStyle = (category: string) => {
    const cat = category.toLowerCase();
    if (cat === 'social') {
      return { bg: '#E3F2FD', text: colors.primary };
    }
    return { bg: '#FFF3E7', text: '#FF6B35' };
  };

  const sportStyle = { bg: '#FFF3E7', text: '#FF6B35' };
  const eventTypeStyle = getCategoryStyle(event.eventType);

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
          <FlexView style={[styles.tag, { backgroundColor: sportStyle.bg }]}>
            <Activity size={12} color={sportStyle.text} />
            <TextDs style={[styles.tagText, { color: sportStyle.text }]} numberOfLines={1}>
              {event.sport}
            </TextDs>
          </FlexView>
          <FlexView style={[styles.tag, { backgroundColor: eventTypeStyle.bg }]}>
            <Users size={12} color={eventTypeStyle.text} />
            <TextDs style={[styles.tagText, { color: eventTypeStyle.text }]} numberOfLines={1}>
              {event.eventType}
            </TextDs>
          </FlexView>
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

        <FlexView style={styles.participantsContainer}>
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
          <TextDs style={styles.spotsText}>Spots Available</TextDs>
        </FlexView>
      </FlexView>
    </TouchableOpacity>
  );
};

