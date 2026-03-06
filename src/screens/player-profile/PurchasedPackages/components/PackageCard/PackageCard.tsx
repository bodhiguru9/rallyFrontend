import React from 'react';
import { TextDs, FlexView } from '@components';
import { TouchableOpacity, Image } from 'react-native';
import { Activity, Users } from 'lucide-react-native';
import { colors } from '@theme';
import type { PackageCardProps } from './PackageCard.types';
import { styles } from './style/PackageCard.styles';

export const PackageCard: React.FC<PackageCardProps> = ({
  package: packageData,
  onPress,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(packageData.id);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Organiser Info */}
      <FlexView style={styles.organizerSection}>
        <FlexView style={styles.avatarContainer}>
          {packageData.organizerAvatar ? (
            <Image
              source={{ uri: packageData.organizerAvatar }}
              style={styles.avatar}
            />
          ) : (
            <FlexView style={styles.avatarPlaceholder}>
              <Users size={24} color={colors.text.secondary} />
            </FlexView>
          )}
        </FlexView>
        <FlexView style={styles.organizerInfo}>
          <TextDs style={styles.packageTitle}>{packageData.title}</TextDs>
          <TextDs style={styles.organizerName}>by {packageData.organizerName}</TextDs>
        </FlexView>
      </FlexView>

      {/* Package Details */}
      <FlexView style={styles.detailsSection}>
        <FlexView style={styles.titleRow}>
          <TextDs style={styles.detailTitle}>{packageData.title}</TextDs>
          <TextDs style={styles.validity}>Validity: {packageData.validity}</TextDs>
        </FlexView>

        {/* Sport Tag */}
        <FlexView style={styles.sportTag}>
          <Activity size={14} color="#FF6B35" />
          <TextDs style={styles.sportText}>{packageData.sport}</TextDs>
        </FlexView>

        {/* Info Grid */}
        <FlexView style={styles.infoGrid}>
          <FlexView style={styles.infoItem}>
            <TextDs style={styles.infoLabel}>Purchased On</TextDs>
            <TextDs style={styles.infoValue}>{packageData.purchasedOn}</TextDs>
          </FlexView>
          <FlexView style={styles.infoItem}>
            <TextDs style={styles.infoLabel}>Event Type</TextDs>
            <TextDs style={styles.infoValue}>{packageData.eventTypes.join(', ')}</TextDs>
          </FlexView>
          <FlexView style={styles.infoItem}>
            <TextDs style={styles.infoLabel}>No of Events</TextDs>
            <TextDs style={styles.infoValue}>{packageData.totalEvents}</TextDs>
          </FlexView>
        </FlexView>

      </FlexView>
      {/* Progress Indicator */}
      <FlexView style={styles.progressContainer}>
        <TextDs style={styles.progressText}>
          {packageData.usedEvents}/{packageData.totalEvents}
        </TextDs>

      </FlexView>
    </TouchableOpacity>
  );
};

