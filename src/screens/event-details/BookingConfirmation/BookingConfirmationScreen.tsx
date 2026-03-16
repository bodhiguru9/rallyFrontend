import React from 'react';
import { ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { colors, spacing } from '@theme';
import { styles } from './style/BookingConfirmation.styles';
import { logger } from '@dev-tools';
import {
  TBookingConfirmationRouteProp,
  TBookingConfirmationScreenNavigationProp,
} from './BookingConfirmation.types';
import { useEvent } from '@hooks/use-events';
import { formatDate, shareEvent, resolveImageUri } from '@utils';
import { CalendarPlus, Check } from 'lucide-react-native';
import { IconTag } from '@components/global/IconTag';
import { TextDs, FlexView, ImageDs } from '@components';

export const BookingConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<TBookingConfirmationScreenNavigationProp>();
  const route = useRoute<TBookingConfirmationRouteProp>();
  const { eventId, bookingId, amountPaid, currency } = route.params;

  // Fetch event data from API
  const { data: event, isLoading } = useEvent(eventId);

  const displayImage = React.useMemo(() => {
    if (!event) return 'https://via.placeholder.com/400?text=Event';
    const rawImage = event.eventImages?.[0] || (event as any).gameImages?.[0] || (event as any).eventImage;
    const organizerImage = event.creator?.profilePic || (event as any).eventCreatorProfilePic;
    return resolveImageUri(rawImage) || resolveImageUri(organizerImage) || 'https://via.placeholder.com/400?text=Event';
  }, [event]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <FlexView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TextDs style={{ color: colors.text.secondary }}>Loading...</TextDs>
        </FlexView>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <FlexView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TextDs style={{ color: colors.text.secondary }}>Event not found</TextDs>
        </FlexView>
      </SafeAreaView>
    );
  }

  const handleDone = () => {
    // Navigate back to Home
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const handleAddToCalendar = () => {
    logger.info('Add to calendar:', event.id);
    // Implement calendar integration here
  };

  const handleShare = () => {
    shareEvent({
      eventId: event.eventId ?? eventId,
      eventName: event.eventName ?? 'Event',
      creatorName: event.creator?.fullName ?? event.eventCreatorName ?? '',
      formattedDateTime: formatDate(event.eventDateTime ?? '', 'display-range'),
      eventLocation: event.eventLocation ?? undefined,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <FlexView style={styles.successIconContainer}>
          <Check size={50} color={colors.text.white} />
        </FlexView>

        {/* Title */}
        <TextDs style={styles.title}>Booking Confirmed!</TextDs>
        <TextDs style={styles.subtitle}>You&apos;re all set for your session</TextDs>

        {/* Event Details Card */}
        <FlexView style={styles.card}>
          <FlexView style={styles.eventOverview}>
            <Image
              source={{
                uri: displayImage,
              }}
              style={styles.eventImage}
            />
            <FlexView style={styles.eventInfo}>
              <TextDs style={styles.eventTitle}>{event.eventName}</TextDs>
              <TextDs style={styles.organizerName}>
                by {event.creator?.fullName || event.eventCreatorName || 'Unknown Organizer'}
              </TextDs>
              <FlexView style={styles.categoriesContainer}>
                <IconTag title={event.eventSports?.[0] ?? 'Sport'} variant="orange" />
                <IconTag title={event.eventType ?? 'Event'} variant="teal" />
              </FlexView>
            </FlexView>
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <ImageDs image="PaperPlane" size={24} />
            </TouchableOpacity>
          </FlexView>

          {/* Date */}
          <FlexView style={styles.eventDetailsRow}>
            <ImageDs image="time" size={16} />
            <TextDs style={styles.eventDetailText}>
              {formatDate(event.eventDateTime ?? '', 'display-range')}
            </TextDs>
          </FlexView>

          {/* Location */}
          <FlexView style={styles.eventDetailsRow}>
            <ImageDs image="locationPin" size={16} />
            <TextDs style={styles.eventDetailText}>{event.eventLocation ?? ''}</TextDs>
          </FlexView>

          {/* Amount Paid Section */}
          <FlexView style={styles.amountSection}>
            <TextDs size={14} weight="regular" color="secondary">
              Amount Paid
            </TextDs>
            <FlexView style={styles.amountRow}>
              {currency === 'AED' ? (
                <FlexView flexDirection="row" alignItems="center" gap={spacing.xs}>
                  <ImageDs image="dhiramIcon" size={16} style={styles.priceIcon} />
                  <TextDs size={14} weight="regular" color="blueGray">
                    {amountPaid.toFixed(2)}
                  </TextDs>
                </FlexView>
              ) : (
                <TextDs size={14} weight="regular" color="blueGray">
                  {currency} {amountPaid.toFixed(2)}
                </TextDs>
              )}
              <TouchableOpacity
                style={styles.addToCalendarButton}
                onPress={handleAddToCalendar}
                activeOpacity={0.7}
              >
                <CalendarPlus size={12} color={colors.text.blueGray} />
                <TextDs size={14} weight="regular" color="blueGray">
                  Add to Calendar
                </TextDs>
              </TouchableOpacity>
            </FlexView>
          </FlexView>
        </FlexView>

        {/* Booking ID */}
        <TextDs size={14} weight="regular" color="secondary">
          Booking ID: #RSDXB01
        </TextDs>
      </ScrollView>

      {/* Done Button */}
      <FlexView style={styles.footer}>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone} activeOpacity={0.8}>
          <TextDs style={styles.doneButtonText}>Done</TextDs>
        </TouchableOpacity>
      </FlexView>
    </SafeAreaView>
  );
};
