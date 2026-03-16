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
  /** User IDs already in Joined list - filter these out from Requests (paid users should only show in Joined) */
  joinedUserIds?: number[];
}

function isRequestPaid(request: PendingRequest): boolean {
  const status = request.paymentStatus ?? request.payment_status ?? '';
  const s = String(status).toLowerCase();
  return s === 'paid' || s.includes('paid');
}

export const PendingRequestsList: React.FC<PendingRequestsListProps> = ({
  eventId,
  joinedUserIds = [],
}) => {
  const { data: pendingRequestsData } = useQuery({
    queryKey: ['event-pending-requests', eventId],
    queryFn: () => eventService.getEventPendingRequests(eventId, 1),
    enabled: !!eventId,
  });

  const { acceptPendingRequestMutation, declinePendingRequestMutation } =
    usePendingRequestMutations(eventId);

  const allRequests = pendingRequestsData?.data?.pendingRequests ?? [];
  const joinedSet = new Set(joinedUserIds);
  const pendingRequests = allRequests.filter(
    (r) => !joinedSet.has(r.user.userId) && !isRequestPaid(r)
  );
  const isActionPending =
    acceptPendingRequestMutation.isPending || declinePendingRequestMutation.isPending;

  return (
    <FlexView style={[styles.requestsList, { marginTop: spacing.lg }]}>
      {pendingRequests.map((request: PendingRequest) => {
        const guestCount = request.guestCount ?? request.guest_count ?? 0;
        const guestSuffix = guestCount > 0 ? ` +${guestCount}` : '';
        const paymentStatus = request.paymentStatus ?? request.payment_status ?? null;
        const isAcceptedPendingPayment =
          request.status?.toLowerCase() === 'accepted' &&
          (paymentStatus === 'pending' ||
            String(paymentStatus || '').toLowerCase().includes('pending'));

        return (
        <FlexView key={request.joinRequestId} style={styles.requestCard} row alignItems="center">
          <FlexView style={styles.requestAvatar}>
            <Avatar
              imageUri={request.user.profilePic}
              fullName={request.user.fullName}
              size="lg"
            />
          </FlexView>
          <FlexView flex={1} style={styles.requestNameContainer}>
            <TextDs
              size={14}
              weight="semibold"
              color="primary"
              style={styles.requestName}
              numberOfLines={1}
            >
              {request.user.fullName}{guestSuffix}
            </TextDs>
          </FlexView>
          {isAcceptedPendingPayment ? (
            <FlexView style={styles.pendingPaymentBadge}>
              <TextDs size={12} weight="medium" color="blueGray">
                Payment Pending
              </TextDs>
            </FlexView>
          ) : (
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
          )}
        </FlexView>
        );
      })}
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
  requestNameContainer: {
    flex: 1,
  },
  requestName: {
  },
  pendingPaymentBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginLeft: spacing.sm,
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
