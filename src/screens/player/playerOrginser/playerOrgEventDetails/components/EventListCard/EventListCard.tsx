import React from 'react';
import { TextDs,  FlexView } from '@components';
import {Image, Pressable, Platform, StyleSheet} from 'react-native';
import { Calendar, MapPin, Send } from 'lucide-react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

interface EventListCardProps {
  id: string;
  title: string;
  image: string;
  categories: string[];
  date: string;
  time: string;
  location: string;
  participants: Array<{ id: string; avatar?: string }>;
  spotsAvailable?: number;
  price: number;
  onPress: (id: string) => void;
  onShare: (id: string) => void;
}

export const EventListCard: React.FC<EventListCardProps> = ({
  id,
  title,
  image,
  categories,
  date,
  time,
  location,
  participants,
  spotsAvailable,
  price,
  onPress,
  onShare,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        Platform.OS === 'ios' && pressed && { opacity: 0.7 },
      ]}
      onPress={() => onPress(id)}
      android_ripple={{ color: `${colors.primary  }20`, borderless: false }}
    >
      <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />

      <FlexView style={styles.content}>
        <FlexView style={styles.header}>
          <FlexView style={styles.titleSection}>
            <TextDs style={styles.title}>{title}</TextDs>
            <FlexView style={styles.tagsContainer}>
              {categories.map((category, index) => (
                <FlexView key={index} style={styles.tag}>
                  <TextDs style={styles.tagText}>{category}</TextDs>
                </FlexView>
              ))}
            </FlexView>
          </FlexView>
          <Pressable
            style={({ pressed }) => [
              styles.shareButton,
              Platform.OS === 'ios' && pressed && { opacity: 0.7 },
            ]}
            onPress={() => onShare(id)}
            android_ripple={{ color: `${colors.primary  }30`, borderless: true, radius: 20 }}
          >
            <Send size={18} color={colors.text.primary} />
          </Pressable>
        </FlexView>

        <FlexView style={styles.infoRow}>
          <Calendar size={14} color={colors.text.secondary} />
          <TextDs style={styles.infoText}>
            {date}, {time}
          </TextDs>
        </FlexView>

        <FlexView style={styles.infoRow}>
          <MapPin size={14} color={colors.text.secondary} />
          <TextDs style={styles.infoText}>{location}</TextDs>
        </FlexView>

        <FlexView style={styles.footer}>
          <FlexView style={styles.participantsSection}>
            <FlexView style={styles.avatarsContainer}>
              {participants.slice(0, 4).map((participant, index) => (
                <Image
                  key={participant.id}
                  source={{ uri: participant.avatar || 'https://i.pravatar.cc/150' }}
                  style={[styles.avatar, { marginLeft: index > 0 ? -8 : 0 }]}
                />
              ))}
            </FlexView>
            {participants.length > 4 && (
              <TextDs style={styles.viewAllText}>View All</TextDs>
            )}
            {spotsAvailable !== undefined && spotsAvailable > 0 && (
              <TextDs style={styles.spotsText}>{spotsAvailable} spots left</TextDs>
            )}
          </FlexView>
          <FlexView style={styles.priceContainer}>
            <TextDs style={styles.price}>{price}</TextDs>
          </FlexView>
        </FlexView>
      </FlexView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface.card,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 120,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.xs / 2,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs / 2,
  },
  tag: {
    backgroundColor: colors.surface.background,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  tagText: {
    ...getFontStyle(6, 'medium'),
    color: colors.text.secondary,
  },
  shareButton: {
    padding: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs / 2,
  },
  infoText: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  participantsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  avatarsContainer: {
    flexDirection: 'row',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.surface.background,
  },
  viewAllText: {
    ...getFontStyle(6, 'medium'),
    color: colors.text.secondary,
  },
  spotsText: {
    ...getFontStyle(6, 'medium'),
    color: colors.text.secondary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
  },
});
