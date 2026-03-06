import React from 'react';
import { TextDs,  FlexView } from '@components';
import {TouchableOpacity, Image} from 'react-native';
import { Activity, Calendar, MapPin } from 'lucide-react-native';
import { colors } from '@theme';
import type { Invitation } from './InvitationCard.types';
import { styles } from './style/InvitationCard.styles';

interface InvitationCardProps {
  invitation: Invitation;
  onAccept: (inviteId: string) => void;
  onDecline: (inviteId: string) => void;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  invitation,
  onAccept,
  onDecline,
}) => {
  const canRespond = Boolean(invitation.inviteId);
  const inviteId = invitation.inviteId ?? '';

  return (
    <FlexView style={styles.card}>
      {/* Header Section */}
      <FlexView style={styles.header}>
        <FlexView style={styles.avatarContainer}>
          <FlexView style={[styles.avatar, { backgroundColor: invitation.organiserAvatarColor }]}>
            <Activity size={24} color={colors.text.white} />
          </FlexView>
        </FlexView>
        <FlexView style={styles.headerText}>
          <TextDs style={styles.invitationText}>{invitation.message}</TextDs>
          <TextDs style={styles.timestamp}>{invitation.timestamp}</TextDs>
        </FlexView>
      </FlexView>

      {/* Event Content */}
      <FlexView style={styles.eventContent}>
        {/* Event Image */}
        <Image source={{ uri: invitation.eventImage }} style={styles.eventImage} />

        {/* Event Details */}
        <FlexView style={styles.eventDetails}>
          <TextDs style={styles.eventTitle}>{invitation.eventName}</TextDs>
          <TextDs style={styles.organiserName}>by {invitation.organiserName}</TextDs>

          {/* Tags */}
          <FlexView style={styles.tagsContainer}>
            {invitation.tags.map((tag, index) => (
              <FlexView
                key={index}
                style={[
                  styles.tag,
                  {
                    backgroundColor: tag.backgroundColor,
                  },
                ]}
              >
                <TextDs style={[styles.tagText, { color: tag.textColor }]}>{tag.label}</TextDs>
              </FlexView>
            ))}
          </FlexView>

          {/* Date & Time */}
          <FlexView style={styles.detailRow}>
            <Calendar size={16} color={colors.text.secondary} />
            <TextDs style={styles.detailText}>{invitation.dateTime}</TextDs>
          </FlexView>

          {/* Location */}
          <FlexView style={styles.detailRow}>
            <MapPin size={16} color={colors.text.secondary} />
            <TextDs style={styles.detailText} numberOfLines={1}>
              {invitation.location}
            </TextDs>
          </FlexView>
        </FlexView>
      </FlexView>

      {/* Action Buttons */}
      <FlexView style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.declineButton, !canRespond && styles.buttonDisabled]}
          onPress={() => canRespond && onDecline(inviteId)}
          activeOpacity={0.7}
          disabled={!canRespond}
        >
          <TextDs style={styles.declineButtonText}>Decline</TextDs>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.acceptButton, !canRespond && styles.buttonDisabled]}
          onPress={() => canRespond && onAccept(inviteId)}
          activeOpacity={0.7}
          disabled={!canRespond}
        >
          <TextDs style={styles.acceptButtonText}>Accept</TextDs>
        </TouchableOpacity>
      </FlexView>
    </FlexView>
  );
};
