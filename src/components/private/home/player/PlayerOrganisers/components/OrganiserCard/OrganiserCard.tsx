import React from 'react';
import { TextDs,  FlexView } from '@components';
import {TouchableOpacity} from 'react-native';
import { Activity } from 'lucide-react-native';
import { colors } from '@theme';
import type { PlayerOrganiser } from '../../PlayerOrganisers.types';
import { styles } from './OrganiserCard.styles';

interface OrganiserCardProps {
  organiser: PlayerOrganiser;
  onPress: (id: string) => void;
  isFeatured?: boolean;
}

export const OrganiserCard: React.FC<OrganiserCardProps> = ({
  organiser,
  onPress,
  isFeatured = false,
}) => {
  // Handle gradient by using the first color for now
  // Can be enhanced with expo-linear-gradient later if needed
  const backgroundColor = Array.isArray(organiser.background)
    ? organiser.background[0]
    : organiser.background;

  const renderIcon = () => {
    switch (organiser.iconType) {
      case 'badminton':
        return <Activity size={40} color={colors.text.white} />;
      case 'padel':
        return <Activity size={40} color={colors.text.white} />;
      case 'social':
        return (
          <FlexView style={styles.socialIconContainer}>
            <TextDs style={styles.socialText}>Socials</TextDs>
          </FlexView>
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress(organiser.id)} activeOpacity={0.8}>
      <FlexView style={[styles.card, { backgroundColor }, isFeatured && styles.featuredCard]}>
        {/* Badges */}
        <FlexView style={styles.badgesContainer}>
          <FlexView style={styles.badge}>
            <TextDs style={styles.badgeText}>{organiser.hostedCount} Hosted</TextDs>
          </FlexView>
          <FlexView style={[styles.badge, styles.badgeYellow]}>
            <TextDs style={[styles.badgeText, styles.badgeTextYellow]}>
              {organiser.attendeesCount} Attendees
            </TextDs>
          </FlexView>
        </FlexView>

        {/* Featured Card - MASTERS Text */}
        {isFeatured && organiser.mastersText && (
          <FlexView style={styles.mastersContainer}>
            <FlexView style={styles.flagsContainer}>
              {[1, 2, 3, 4, 5].map((i) => (
                <FlexView key={i} style={styles.flag} />
              ))}
            </FlexView>
            <TextDs style={styles.mastersText}>{organiser.mastersText}</TextDs>
          </FlexView>
        )}

        {/* Icon */}
        <FlexView style={styles.iconContainer}>{renderIcon()}</FlexView>

        {/* Content */}
        <FlexView style={styles.content}>
          <TextDs style={styles.title}>{organiser.name}</TextDs>
          <TextDs style={styles.organizer}>by {organiser.organizerName}</TextDs>

          {/* Tags */}
          <FlexView style={styles.tagsContainer}>
            {organiser.tags.map((tag, index) => (
              <FlexView key={index} style={styles.tag}>
                <TextDs style={styles.tagText}>{tag}</TextDs>
              </FlexView>
            ))}
            {organiser.additionalTagsCount && organiser.additionalTagsCount > 0 && (
              <FlexView style={styles.additionalTag}>
                <TextDs style={styles.additionalTagText}>+{organiser.additionalTagsCount}</TextDs>
              </FlexView>
            )}
          </FlexView>
        </FlexView>
      </FlexView>
    </TouchableOpacity>
  );
};
