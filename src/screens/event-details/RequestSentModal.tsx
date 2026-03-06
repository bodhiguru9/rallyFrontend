import React from 'react';
import { TextDs, FlexView, ImageDs } from '@components';
import { TouchableOpacity, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@theme';
import { shareEvent } from '@utils';
import { styles } from './style/RequestSentModal.styles';
import { Card } from '@components/global/Card';
import { Subtitle, Title } from '@components/global';
import { IconTag } from '@components/global/IconTag';
import { EventData } from '@app-types';
import { Calendar } from 'lucide-react-native';

interface RequestSentModalProps {
  visible: boolean;
  onClose: () => void;
  eventTitle: string;
  organizerName: string;
  eventImage: string;
  eventDate: string;
  eventLocation: string;
  amountDue: number;
  currency: string;
  bookingId: string;
  categories: string[];
  event: EventData;
  variant: 'private' | 'waitlist' | 'registration';
}

const modalVarients = {
  private: {
    image: 'HourGlass' as const,
    title: 'Request Sent',
    subTitle:
      'Your request is sent to the host. Once approved upon payment your spot will be confirmed.',
  },
  waitlist: {
    image: 'MultiUsers' as const,
    title: 'Waitlist Joined',
    subTitle:
      'You will be notified when a slot opens up, upon payment your spot will be confirmed. ',
  },
  registration: {
    image: 'ReminderBell' as const,
    title: 'Reminder Set!',
    subTitle: 'You will be notified when the registration begins.',
  },
};

export const RequestSentModal: React.FC<RequestSentModalProps> = ({
  visible,
  onClose,
  eventTitle,
  organizerName,
  eventImage,
  eventDate,
  eventLocation,
  amountDue,
  currency,
  bookingId,
  event,
  variant,
}) => {
  const modalContent = modalVarients[variant];

  const handleShare = () => {
    shareEvent({
      eventId: event.eventId ?? event.id ?? '',
      eventName: eventTitle,
      creatorName: organizerName,
      formattedDateTime: eventDate,
      eventLocation,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <FlexView style={styles.content}>
          {/* Success Icon */}
          <FlexView style={styles.iconContainer}>
            <ImageDs image={modalContent.image} size={130} style={styles.hourglassIcon} />
          </FlexView>

          {/* Title */}
          <TextDs style={styles.title}>{modalContent.title}</TextDs>
          <TextDs style={styles.subtitle}>{modalContent.subTitle}</TextDs>

          {/* Event Card */}
          <FlexView style={{ width: '100%' }}>
            <Card>
              <FlexView style={styles.eventHeader}>
                <Image source={{ uri: eventImage }} style={styles.eventImage} />
                <FlexView style={styles.eventInfo}>
                  <Title variant="cardTitle">{eventTitle}</Title>
                  <Subtitle variant="default">by {organizerName}</Subtitle>
                  <FlexView style={styles.categoriesContainer}>
                    <IconTag title={event.eventSports[0]} variant="orange" />
                    <IconTag title={event.eventType} variant="teal" />
                  </FlexView>
                </FlexView>
                <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                  <ImageDs image="PaperPlane" />
                </TouchableOpacity>
              </FlexView>

              <FlexView style={styles.divider} />

              {/* Event Details */}
              <FlexView style={styles.detailsContainer}>
                <FlexView style={styles.detailRow}>
                  <ImageDs image="Time" size={16} />
                  <TextDs style={styles.detailText}>{eventDate}</TextDs>
                </FlexView>
                <FlexView style={styles.detailRow}>
                  <ImageDs image="LocationPin" size={16} />
                  <TextDs style={styles.detailText}>{eventLocation}</TextDs>
                </FlexView>
              </FlexView>

              <FlexView style={styles.divider} />

              {/* Amount Due */}
              <FlexView style={styles.amountContainer}>
                <TextDs style={styles.amountLabel}>Amount Due</TextDs>
                <FlexView style={styles.amountRow}>
                  {currency === 'AED' ? (
                    <FlexView flexDirection="row" alignItems="center" gap={spacing.xs}>
                      <ImageDs image="dhiramWhiteIcon" size={16} style={styles.priceIcon} />
                      <TextDs style={styles.amountValue}>{amountDue.toFixed(2)}</TextDs>
                    </FlexView>
                  ) : (
                    <TextDs style={styles.amountValue}>
                      {currency} {amountDue.toFixed(2)}
                    </TextDs>
                  )}
                  <TouchableOpacity style={styles.calendarButton}>
                    <Calendar size={16} color={colors.primary} />
                    <TextDs style={styles.calendarText}>Add to Calendar</TextDs>
                  </TouchableOpacity>
                </FlexView>
              </FlexView>
            </Card>
          </FlexView>

          {/* Booking ID */}
          {variant !== 'registration' && (
            <TextDs style={styles.bookingId}>Booking ID: {bookingId}</TextDs>
          )}
        </FlexView>

        {/* Done Button */}
        <FlexView style={styles.buttonContainer}>
          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
            <TextDs style={styles.doneButtonText}>Done</TextDs>
          </TouchableOpacity>
        </FlexView>
      </SafeAreaView>
    </Modal>
  );
};
