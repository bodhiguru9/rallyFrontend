import React from 'react';
import { TextDs,  FlexView } from '@components';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import { Activity, Calendar, Eye, MapPin, Send } from 'lucide-react-native';
import { colors } from '@theme';
import type { ProfileEventCardProps } from './ProfileEventCard.types';
import { styles } from './style/ProfileEventCard.styles';

export const ProfileEventCard: React.FC<ProfileEventCardProps> = ({
  id,
  title,
  image,
  categories,
  date,
  time,
  location,
  participants,
  spotsAvailable,
  views,
  onPress,
  onShare,
}) => {
  const handlePress = () => {
    onPress(id);
  };

  const handleShare = () => {
    if (onShare) {
      onShare(id);
    }
  };

  const formatViews = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <FlexView style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
      </FlexView>

      <FlexView style={styles.content}>
        {/* Share Button - Top Right */}
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Send size={18} color={colors.text.secondary} />
        </TouchableOpacity>

        {/* Title */}
        <TextDs style={styles.title}>{title}</TextDs>

        {/* Tags */}
        <FlexView style={styles.tagsContainer}>
          {categories.map((category, index) => (
            <FlexView
              key={index}
              style={[
                styles.tag,
                { backgroundColor: category.color || '#FFF3E7' },
              ]}
            >
              <Activity
                size={12}
                color={category.color === '#E0F7F5' ? '#4ECDC4' : '#FF6B35'}
              />
              <TextDs
                style={[
                  styles.tagText,
                  {
                    color:
                      category.color === '#E0F7F5' ? '#4ECDC4' : '#FF6B35',
                  },
                ]}
              >
                {category.label}
              </TextDs>
            </FlexView>
          ))}
        </FlexView>

        {/* Date & Time */}
        <FlexView style={styles.infoRow}>
          <Calendar size={14} color={colors.text.secondary} />
          <TextDs style={styles.infoText}>
            {date}, {time}
          </TextDs>
        </FlexView>

        {/* Location */}
        <FlexView style={styles.infoRow}>
          <MapPin size={14} color={colors.text.secondary} />
          <TextDs style={styles.infoText} numberOfLines={1}>
            {location}
          </TextDs>
        </FlexView>

        {/* Footer: Participants, Spots, Views */}
        <FlexView style={styles.footer}>
          <FlexView style={styles.participantsSection}>
            <FlexView style={styles.avatarsContainer}>
              {participants.slice(0, 3).map((participant, index) => (
                <Image
                  key={participant.id}
                  source={{ uri: participant.avatar }}
                  style={[
                    styles.avatar,
                    { marginLeft: index > 0 ? -8 : 0 },
                  ]}
                />
              ))}
              {participants.length > 3 && (
                <FlexView
                  style={[
                    styles.viewAllAvatar,
                    { marginLeft: participants.length > 0 ? -8 : 0 },
                  ]}
                >
                  <TextDs style={styles.viewAllText}>View All</TextDs>
                </FlexView>
              )}
            </FlexView>
            {spotsAvailable !== undefined && (
              <TextDs style={styles.spotsText}>Spots Available</TextDs>
            )}
          </FlexView>

          {/* Views with Eye Icon */}
          <FlexView style={styles.viewsSection}>
            <Eye size={14} color={colors.text.secondary} />
            <TextDs style={styles.viewsText}>{formatViews(views)}</TextDs>
          </FlexView>
        </FlexView>
      </FlexView>
    </TouchableOpacity>
  );
};

