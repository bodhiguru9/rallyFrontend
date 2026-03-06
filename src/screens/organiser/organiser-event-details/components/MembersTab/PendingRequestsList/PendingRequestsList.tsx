import React from 'react';
import { StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { Button } from '@designSystem/atoms/button';
import { Avatar } from '@components';
import { colors, spacing, borderRadius, shadows } from '@theme';
import type { PendingRequest } from '@app-types';
import { eventService } from '@services/event-service';
import { usePendingRequestMutations } from '../use-pending-request-mutations';

interface PendingRequestsListProps {
  eventId: string;
}

export const PendingRequestsList: React.FC<PendingRequestsListProps> = ({ eventId }) => {
  const { data: pendingRequestsData } = useQuery({
    queryKey: ['event-pending-requests', eventId],
    queryFn: () => eventService.getEventPendingRequests(eventId, 1),
    enabled: !!eventId,
  });

  const { acceptPendingRequestMutation, declinePendingRequestMutation } =
    usePendingRequestMutations(eventId);

  const pendingRequests = pendingRequestsData?.data?.pendingRequests ?? [];
  const isActionPending =
    acceptPendingRequestMutation.isPending || declinePendingRequestMutation.isPending;

  return (
    <FlexView style={[styles.requestsList, { marginTop: spacing.lg }]}>
      {pendingRequests.map((request: PendingRequest) => (
        <FlexView key={request.joinRequestId} style={styles.requestCard} row alignItems="center">
          <FlexView style={styles.requestAvatar}>
            <Avatar
              imageUri={request.user.profilePic}
              fullName={request.user.fullName}
              size="lg"
            />
          </FlexView>
          <TextDs
            size={14}
            weight="semibold"
            color="primary"
            style={styles.requestName}
            numberOfLines={1}
          >
            {request.user.fullName}
          </TextDs>
          <FlexView row gap={spacing.sm} style={styles.requestActions}>
            <Button
              variant="secondary"
              bg={colors.button.cancel.background}
              rounded
              minHeight={24}
              style={styles.actionButton}
              disabled={isActionPending}
              onPress={() =>
                declinePendingRequestMutation.mutate({ joinRequestId: request.joinRequestId })
              }
            >
              <TextDs size={12} weight="medium" style={styles.declineButtonText}>
                Decline
              </TextDs>
            </Button>
            <Button
              variant="primary"
              rounded
              minHeight={24}
              style={styles.actionButton}
              disabled={isActionPending}
              onPress={() =>
                acceptPendingRequestMutation.mutate({ joinRequestId: request.joinRequestId })
              }
            >
              <TextDs size={12} weight="medium" color="white">
                Accept
              </TextDs>
            </Button>
          </FlexView>
        </FlexView>
      ))}
    </FlexView>
  );
};

const styles = StyleSheet.create({
  requestsList: {
    gap: spacing.base,
  },
  requestCard: {
    backgroundColor: '#E8F7EC',
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    ...shadows.sm,
  },
  requestAvatar: {
    marginRight: spacing.base,
  },
  requestName: {
    flex: 1,
  },
  requestActions: {
    marginLeft: spacing.sm,
  },
  actionButton: {
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  declineButtonText: {
    color: colors.button.cancel.text,
  },
});
