import React from 'react';
import { Alert, Modal, TouchableOpacity, View } from 'react-native';
import { Button, FlexView, ImageDs, TextDs } from '@components';
import { useDeleteEvent } from '@hooks/use-events';
import { logger } from '@dev-tools/logger';
import { colors, spacing } from '@theme';
import type { DeleteEventModalProps } from './DeleteEventModal.types';

/**
 * Modal to confirm deleting an event. Same UI pattern as CancelBookingModal:
 * overlay, gradient card, icon (trash), title, subtitle, Close + Delete buttons.
 */
export const DeleteEventModal: React.FC<DeleteEventModalProps> = ({
  visible,
  onClose,
  eventId,
  onDeleteSuccess,
}) => {
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();

  const handleDelete = () => {
    logger.info('[DeleteEventModal] handleDelete called', { eventId });
    if (eventId) {
      deleteEvent(eventId, {
        onSuccess: () => {
          logger.info('[DeleteEventModal] Delete event succeeded', { eventId });
          onDeleteSuccess?.();
          onClose();
        },
        onError: (err: Error & { response?: { data?: { error?: string; message?: string } } }) => {
          const message =
            err.response?.data?.error ??
            err.response?.data?.message ??
            'Failed to delete event.';
          logger.warn('[DeleteEventModal] Delete event failed', { message, err });
          Alert.alert('Cannot delete', message, [
            {
              text: 'OK',
              onPress: () => {
                onClose();
              },
            },
          ]);
        },
      });
    } else {
      logger.warn('[DeleteEventModal] No eventId - skipping API call');
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
            <ImageDs image="removeBin" size={80} style={{ marginBottom: 20 }} />
            <TextDs size={20} weight="bold" align='center' style={{ marginBottom: 4 }}>
              Delete Event
            </TextDs>
            <TextDs size={14} weight="regular" color="secondary" align='center' numberOfLines={3} style={{ marginBottom: 16 }}>
              This action cannot be reversed. The event will be permanently deleted.
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
                onPress={handleDelete}
                rounded
                backgroundColor={colors.button.cancel.background}
                disabled={isDeleting}
                style={{
                  paddingVertical: 6,
                  flex: 1
                }}
              >
                <TextDs size={16} color="error" weight='semibold'>
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </TextDs>
              </Button>
            </FlexView>
          </FlexView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
