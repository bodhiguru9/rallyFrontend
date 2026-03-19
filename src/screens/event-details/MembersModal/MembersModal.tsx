import React, { useMemo } from 'react';
import { TextDs, FlexView, Avatar } from '@components';
import { Modal, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { User, X } from 'lucide-react-native';
import { colors } from '@theme';
import { useAuthStore } from '@store/auth-store';
import type { MembersModalProps } from './MembersModal.types';
import { styles } from './style/MembersModal.styles';

export const MembersModal: React.FC<MembersModalProps> = ({
  visible,
  eventTitle,
  organizerName,
  participants,
  spotsFilled,
  totalSpots,
  onClose,
}) => {
  const user = useAuthStore((state) => state.user);
  const isOrganiser = user?.userType === 'organiser';

  const progressPercentage = useMemo(() => {
    if (totalSpots === 0) { return 0; }
    return Math.min((spotsFilled / totalSpots) * 100, 100);
  }, [spotsFilled, totalSpots]);

  const spotsAvailable = totalSpots - spotsFilled;
  // Only display actual participants; remove empty/available placeholders
  const displayItems = useMemo(() => participants, [participants]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          <FlexView style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X size={20} color={colors.text.secondary} />
            </TouchableOpacity>

            {/* Header */}
            <FlexView style={styles.header}>
              <TextDs style={styles.eventTitle}>{eventTitle}</TextDs>
              {!isOrganiser && (
                <TextDs style={styles.organizerName}>by {organizerName}</TextDs>
              )}
            </FlexView>

            {/* Spots Info */}
            <FlexView style={styles.spotsInfo}>
              <TextDs style={styles.spotsText}>
                {spotsFilled}/{totalSpots}
              </TextDs>
              <TextDs style={styles.spotsAvailableText}>
                {spotsAvailable > 0 ? 'Spots Available' : 'Full'}
              </TextDs>
            </FlexView>

            {/* Progress Bar */}
            <FlexView style={styles.progressBarContainer}>
              <FlexView
                style={[
                  styles.progressBar,
                  { width: `${progressPercentage}%` },
                ]}
              />
            </FlexView>

            {/* Participants Grid - Show participants first, then empty spots, scrollable */}
            <ScrollView
              showsVerticalScrollIndicator={true}
              showsHorizontalScrollIndicator={false}
              style={styles.participantsScrollView}
              contentContainerStyle={styles.participantsGrid}
              nestedScrollEnabled={true}
              scrollEnabled={true}
            >
              {displayItems.map((item) => (
                <FlexView key={item.userId} style={styles.participantItem}>
                  <FlexView style={styles.participantAvatarWrap}>
                    <Avatar
                      imageUri={item.profilePic}
                      fullName={item.fullName}
                      size="xl"
                    />
                  </FlexView>
                  <TextDs style={styles.participantName} numberOfLines={2}>
                    {item.fullName}{(() => {
                      const gCount = item.guestsCount ?? (item as any).guestCount ?? (item as any).guest_count ?? 0;
                      return gCount - 1 > 0 ? ` (+${gCount - 1})` : '';
                    })()}
                  </TextDs>
                </FlexView>
              ))}
            </ScrollView>
          </FlexView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
