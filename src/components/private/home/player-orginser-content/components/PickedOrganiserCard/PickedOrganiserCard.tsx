import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors, spacing, borderRadius } from '@theme';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { IconTag } from '@components/global/IconTag';
import { Calendar, Users } from 'lucide-react-native';

export type IconType = 'badminton' | 'padel' | 'social' | 'custom';

interface PickedOrganiserCardProps {
  id: string;
  name: string;
  subtitle?: string;
  organizerName: string;
  background: string | string[];
  profilePic: string;
  iconType: IconType;
  hostedCount: number;
  attendeesCount: number;
  tags: string[];
  additionalTagsCount?: number;
  communityName?: string;
  onPress: (id: string, communityName?: string) => void;
}

export const PickedOrganiserCard: React.FC<PickedOrganiserCardProps> = ({
  id,
  name,
  organizerName,
  profilePic,
  tags,
  hostedCount,
  attendeesCount,
  communityName,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card]}
      onPress={() => onPress(id, communityName)}
      activeOpacity={0.8}
    >
      <FlexView
        aspectRatio={4 / 3}
        overflow="hidden"
        borderRadius={borderRadius.lg}
        style={{ experimental_backgroundImage: colors.gradient.blueRadial }}
        position="relative"
      >
        {/* Render the image first or give it absolute positioning to act as a background */}
        {profilePic && (
          <Image
            source={{ uri: profilePic || '' }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: borderRadius.lg,
              zIndex: 10,
              objectFit: 'cover',
            }}
          />
        )}

        {/* Make sure the tags have a higher zIndex so they stay visible on top of the image */}
        <FlexView flexDirection="row" gap={spacing.xs} position="absolute" top={3} left={3} zIndex={10}>
          <IconTag icon={Calendar} title={hostedCount.toString()} size="small" variant="purple" />
          <IconTag icon={Users} title={attendeesCount.toString()} size="small" variant="yellow" />
        </FlexView>
      </FlexView>

      {/* Content */}
      <FlexView marginTop={spacing.sm}>
        <TextDs size={14} weight="bold">{name}</TextDs>
        <TextDs size={14} weight="regular" color="secondary">
          by {organizerName}
        </TextDs>

        {/* Tags */}
        <FlexView flexDirection="row" flexWrap='wrap' width={"100%"} gap={spacing.xs} mt={spacing.sm} height={20}>
          {tags.map((item, index) => (
            <IconTag title={item} key={index} size='extraSmall' />
          ))}
        </FlexView>
      </FlexView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    // width: '48%',
    padding: spacing.sm,
    // marginRight: '4%',
    minHeight: 180,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.white,
    backgroundColor: "#FFFDEF80",
  },
});
