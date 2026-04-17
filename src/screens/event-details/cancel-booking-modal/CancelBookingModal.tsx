import React from 'react';
import { Alert, Modal, TouchableOpacity, View } from 'react-native';
import { Button, FlexView, ImageDs, TextDs } from '@components';
import { useCancelBooking } from '@hooks/use-bookings';
import { logger } from '@dev-tools/logger';
import { colors, spacing } from '@theme';
import type { CancelBookingModalProps } from './CancelBookingModal.types';

const NO_REFUND_CONFIG = {
  image: 'noRefund' as const,
  title: 'No Refund',
  subtitle: 'This booking is within 24 hours. You will not get a refund for this booking.',
};

const CANCEL_SESSION_CONFIG = {
  image: 'cancelBooking' as const,
  title: 'Cancel Session',
  subtitle: 'This action cannot be reversed. You will get a refund for this booking.',
};

/**
 * Shared modal for cancelling a booking: no-refund (player after deadline) or cancel-session (with refund).
 * Cancel button calls POST /api/bookings/:bookingId/cancel.
 */
export const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  visible,
  onClose,
  variant = 'noRefund',
  bookingId,
  onCancelSuccess,
}) => {
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();
  const config = variant === 'cancelSession' ? CANCEL_SESSION_CONFIG : NO_REFUND_CONFIG;

  const handleCancelBooking = () => {
    logger.info('[CancelBookingModal] handleCancelBooking called', { bookingId, variant });
    if (bookingId) {
      cancelBooking(bookingId, {
        onSuccess: () => {
          logger.info('[CancelBookingModal] Cancel booking succeeded', { bookingId });
          Alert.alert('Booking Cancelled', 'Your booking has been cancelled successfully.', [
            {
              text: 'OK',
              onPress: () => {
                onCancelSuccess?.();
                onClose();
              },
            },
          ]);
        },
        onError: (err: Error & { response?: { data?: { error?: string; message?: string } } }) => {
          const message =
            err.response?.data?.error ??
            err.response?.data?.message ??
            'Failed to cancel booking.';
          logger.warn('[CancelBookingModal] Cancel booking failed', { message, err });

          // If the backend says the booking is already cancelled, treat it as a
          // successful outcome — the desired state has been reached.
          const alreadyCancelled = message.toLowerCase().includes('already cancelled');

          Alert.alert(
            alreadyCancelled ? 'Already Cancelled' : 'Cancel booking failed',
            message,
            [
              {
                text: 'OK',
                onPress: () => {
                  if (alreadyCancelled) {
                    onCancelSuccess?.();
                  }
                  onClose();
                },
              },
            ],
          );
        },
      });
    } else {
      logger.warn('[CancelBookingModal] No bookingId - skipping API call');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: colors.surface.overlay, justifyContent: 'center', padding: spacing.lg }}
        activeOpacity={1}
        onPress={onClose}
      >
        <View>
          <FlexView
            style={{
              experimental_backgroundImage: colors.gradient.mainBackground
            }}
            borderRadius={20}
            alignItems='center'
            justifyContent='center'
            px={8}
            pt={26}
            pb={16}
          >
            <ImageDs image={config.image} size={80} style={{ marginBottom: 20 }} />
            <TextDs size={20} weight="bold" align='center' style={{ marginBottom: 4 }}>
              {config.title}
            </TextDs>
            <TextDs size={14} weight="regular" color="secondary" align='center' numberOfLines={3} style={{ marginBottom: 16 }}>
              {config.subtitle}
            </TextDs>
            <FlexView row gap={12} width={"100%"}>
              <Button
                onPress={onClose}
                rounded
                backgroundColor={colors.primaryDark}
                style={{
                  paddingVertical: 6,
                  flex: 1
                }}
              >
                <TextDs size={16} color='white' weight='semibold'>
                  Close
                </TextDs>
              </Button>
              <Button
                onPress={handleCancelBooking}
                rounded
                backgroundColor={colors.button.cancel.background}
                disabled={isCancelling}
                style={{
                  paddingVertical: 6,
                  flex: 1
                }}
              >
                <TextDs size={16} color="error" weight='semibold'>
                  {isCancelling ? 'Cancelling...' : 'Cancel'}
                </TextDs>
              </Button>
            </FlexView>
          </FlexView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
