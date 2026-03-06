import React from 'react';
import { TextDs,  FlexView } from '@components';
import {TouchableOpacity, Image} from 'react-native';
import { Activity, Calendar, MapPin, Send, User, Users } from 'lucide-react-native';
import { colors } from '@theme';
import type { PackageEventCardProps } from './PackageEventCard.types';
import { styles } from './style/PackageEventCard.styles';

export const PackageEventCard: React.FC<PackageEventCardProps> = ({
  event,
  onPress,
  onShare,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(event.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(event.id);
    }
  };

  const getCategoryStyle = (category: string) => {
    const cat = category.toLowerCase();
    if (cat === 'social') {
      return { bg: '#E3F2FD', text: colors.primary }; // Light blue
    }
    return { bg: '#FFF3E7', text: '#FF6B35' }; // Light orange
  };

  const sportStyle = { bg: '#FFF3E7', text: '#FF6B35' }; // Orange for sport
  const eventTypeStyle = getCategoryStyle(event.eventType);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Image and Share Button */}
      <FlexView style={styles.imageContainer}>
        <Image source={{ uri: event.image }} style={styles.image} />
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Send size={18} color={colors.text.primary} />
        </TouchableOpacity>
      </FlexView>

      {/* Content */}
      <FlexView style={styles.content}>
        <TextDs style={styles.title}>{event.title}</TextDs>

        {/* Tags */}
        <FlexView style={styles.tagsContainer}>
          <FlexView style={[styles.tag, { backgroundColor: sportStyle.bg }]}>
            <Activity size={12} color={sportStyle.text} />
            <TextDs style={[styles.tagText, { color: sportStyle.text }]}>
              {event.sport}
            </TextDs>
          </FlexView>
          <FlexView style={[styles.tag, { backgroundColor: eventTypeStyle.bg }]}>
            <Users size={12} color={eventTypeStyle.text} />
            <TextDs style={[styles.tagText, { color: eventTypeStyle.text }]}>
              {event.eventType}
            </TextDs>
          </FlexView>
        </FlexView>

        {/* Date */}
        <FlexView style={styles.infoRow}>
          <Calendar size={14} color={colors.text.secondary} />
          <TextDs style={styles.infoText}>
            {event.date}, {event.time}
          </TextDs>
        </FlexView>

        {/* Location */}
        <FlexView style={styles.infoRow}>
          <MapPin size={14} color={colors.text.secondary} />
          <TextDs style={styles.infoText}>{event.location}</TextDs>
        </FlexView>

        {/* Participants and Status */}
        <FlexView style={styles.footer}>
          <FlexView style={styles.participantsContainer}>
            {event.participants.slice(0, 3).map((participant, index) => (
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
            {event.participants.length > 3 && (
              <FlexView style={[styles.participantAvatar, styles.viewAllButton]}>
                <TextDs style={styles.viewAllText}>View All</TextDs>
              </FlexView>
            )}
          </FlexView>
          <TextDs
            style={[
              styles.waitlistStatus,
              {
                color:
                  event.waitlistStatus === 'open'
                    ? colors.status.success
                    : colors.status.success,
              },
            ]}
          >
            Waitlist {event.waitlistStatus === 'open' ? 'Open' : 'Closed'}
          </TextDs>
        </FlexView>
      </FlexView>
    </TouchableOpacity>
  );
};

