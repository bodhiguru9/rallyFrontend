import React, { useMemo } from 'react';
import { TextDs, FlexView } from '@components';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Activity, ChevronRight, Users } from 'lucide-react-native';
import { colors, spacing } from '@theme';
import { getDummyBookAgainItems } from '@data';
import { styles } from '../style/PlayerHomeContent.styles';
import { EventData } from '@app-types';

interface BookAgainSectionProps {
  events: EventData[];
  onEventPress: (id: string) => void;
  onOrganiserPress: (id: number) => void;
}

interface BookAgainItem {
  id: number;
  name: string;
  avatar: string | null;
  icon?: string;
  color: string;
}

export const BookAgainSection: React.FC<BookAgainSectionProps> = ({
  events,
  onEventPress,
  onOrganiserPress,
}) => {
  // Extract unique organisers from events that user has joined/booked, or use dummy data
  const bookAgainItems = useMemo(() => {
    const organiserMap = new Map<number, BookAgainItem>();

    events.forEach((event) => {
      // Skip events without creator data
      if (!event.creator) {
        return;
      }

      if (!organiserMap.has(event.creator.userId)) {
        // Map event type to icon and color
        const getItemStyle = (type: string) => {
          const typeLower = type.toLowerCase();
          if (typeLower.includes('badminton')) {
            return { icon: 'badminton', color: '#FFB6C1' }; // Pink
          }
          if (typeLower.includes('padel')) {
            return { icon: 'padel', color: '#FFC0CB' }; // Light pink
          }
          if (typeLower.includes('social')) {
            return { icon: 'social', color: '#87CEEB' }; // Blue
          }
          return { icon: 'sports', color: '#F5DEB3' }; // Cream
        };

        const style = getItemStyle(event.eventType);
        organiserMap.set(event.creator.userId, {
          id: event.creator.userId,
          name: event.creator.fullName,
          avatar: event.creator.profilePic,
          icon: style.icon,
          color: style.color,
        });
      }
    });

    // If no events found, use dummy data
    if (organiserMap.size === 0) {
      return getDummyBookAgainItems();
    }

    return Array.from(organiserMap.values());
  }, [events]);

  if (bookAgainItems.length === 0) {
    return null;
  }

  return (
    <FlexView style={styles.section}>
      <FlexView style={styles.sectionHeader}>
        <TextDs style={styles.sectionTitle}>Book Again</TextDs>
        <TouchableOpacity style={styles.sectionHeaderButton}>
          <ChevronRight size={22} color={colors.text.white} />
        </TouchableOpacity>
      </FlexView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
        contentContainerStyle={{ gap: spacing.md }}
      >
        {bookAgainItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onOrganiserPress(Number(item.id))}
            style={[styles.bookAgainCard, { backgroundColor: item.color }]}
            activeOpacity={0.7}
          >
            <FlexView style={styles.bookAgainIconContainer}>
              {item.avatar ? (
                <FlexView style={styles.bookAgainAvatarContainer}>
                  <TextDs style={styles.bookAgainAvatarText}>
                    {item.name.charAt(0).toUpperCase()}
                  </TextDs>
                </FlexView>
              ) : (
                <FlexView style={styles.bookAgainIconPlaceholder}>
                  {item.icon === 'badminton' && (
                    <Activity size={24} color={colors.text.white} />
                  )}
                  {item.icon === 'padel' && (
                    <Activity size={24} color={colors.text.white} />
                  )}
                  {item.icon === 'social' && <TextDs style={styles.bookAgainSocialText}>S</TextDs>}
                  {(!item.icon || item.icon === 'sports') && (
                    <Users size={24} color={colors.text.white} />
                  )}
                </FlexView>
              )}
            </FlexView>
            <FlexView style={styles.bookAgainNameContainer}>
              <TextDs style={styles.bookAgainName} numberOfLines={1}>
                {item.name}
              </TextDs>
              <FlexView style={styles.bookAgainDot} />
            </FlexView>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </FlexView>
  );
};
