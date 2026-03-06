import React from 'react';
import { TouchableOpacity, Image, Platform, View } from 'react-native';
import { colors, spacing } from '@theme';
import type { ProfileHeaderProps } from './ProfileHeader.types';
import { styles } from './style/ProfileHeader.styles';
import { Pencil } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { InstagramTag } from '@designSystem/molecules/instagram-tag';
import { FlexView, TextDs, ImageDs } from '@components';
import { IconTag } from '@components/global/IconTag';

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  logoUri,
  name,
  communityName,
  isVerified = true,
  instagramHandle,
  stats,
  description,
  activityTags,
  onEditPress,
  onSettingsPress,
  // onLogoutPress,
  onSubscribersPress,
  onAttendeesPress,
  onHostedPress,
}) => {
  return (
    <FlexView py={spacing.xl} px={15}>

      {/* Header Actions */}
      <FlexView style={styles.headerActions}>
        {onSettingsPress && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onSettingsPress}
            activeOpacity={0.7}
          >
            <ImageDs image="SettingsIcon" size={24} />
          </TouchableOpacity>
        )}
      </FlexView>

      {/* Header Content */}
      <FlexView style={styles.headerContent}>
        {/* Logo */}
        <FlexView style={styles.logoContainer}>
          <FlexView style={styles.logo}>
            <Image source={{ uri: logoUri }} style={styles.logoImage} />
          </FlexView>
          {onEditPress && (
            <TouchableOpacity
              style={styles.editIconContainer}
              onPress={onEditPress}
              activeOpacity={0.7}
            >
              {Platform.OS === 'android' ? (
                <View style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.glass.background.white }}>
                  <Pencil size={12} color={colors.text.blueGray} />
                </View>
              ) : (
                <BlurView intensity={50} tint='default' style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Pencil size={12} color={colors.text.blueGray} />
                </BlurView>
              )}
            </TouchableOpacity>
          )}
        </FlexView>

        {/* Name and Info */}
        <FlexView style={styles.nameSection}>
          <FlexView row alignItems='center' mb={spacing.base}>
            <TextDs style={styles.name}>{communityName}</TextDs>
            {isVerified && (
              <FlexView style={styles.verifiedBadge}>
                <ImageDs image="VerifiedIcon" size={16} />
              </FlexView>
            )}
          </FlexView>
          <TextDs style={styles.communityName}>By {name}</TextDs>

          {instagramHandle && (
            <FlexView row mb={spacing.base}>
              <InstagramTag instagramLink={instagramHandle} />
              <FlexView flex={1} />
            </FlexView>
          )}

          {/* Stats */}
          <FlexView style={styles.statsContainer}>
            <TouchableOpacity
              style={styles.statBox}
              onPress={onHostedPress}
              activeOpacity={0.7}
              disabled={!onHostedPress}
            >
              <TextDs size={14} weight="semibold" color='blueGray'>{stats.hosted}</TextDs>
              <TextDs size={10} weight="regular" color='blueGray'>Hosted</TextDs>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statBox}
              onPress={onAttendeesPress}
              activeOpacity={0.7}
              disabled={!onAttendeesPress}
            >
              <TextDs size={14} weight="semibold" color='blueGray'>{stats.attendees}</TextDs>
              <TextDs size={10} weight="regular" color='blueGray'>Attendees</TextDs>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statBox}
              onPress={onSubscribersPress}
              activeOpacity={0.7}
              disabled={!onSubscribersPress}
            >
              <TextDs size={14} weight="semibold" color='blueGray'>{stats.subscribers}</TextDs>
              <TextDs size={10} weight="regular" color='blueGray'>Subscribers</TextDs>
            </TouchableOpacity>
          </FlexView>
        </FlexView>
      </FlexView>

      {/* Description */}
      <TextDs size={14} weight="regular">{description}</TextDs>

      {/* Activity Tags */}
      {activityTags.length > 0 && (
        <FlexView row gap={spacing.sm} alignItems='center' mt={spacing.md}>
          {activityTags.map((tag) => (
            <IconTag title={tag.label} key={tag.id} />
          ))}
        </FlexView>
      )
      }
    </FlexView>
  );
};
