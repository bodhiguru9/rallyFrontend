import React from 'react';
import { ScrollView, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { colors, spacing } from '@theme';
import { styles } from './style/BookingConfirmation.styles';
import { logger } from '@dev-tools';
import Constants from 'expo-constants';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import {
  TBookingConfirmationRouteProp,
  TBookingConfirmationScreenNavigationProp,
} from './BookingConfirmation.types';
import { useEvent } from '@hooks/use-events';
import { formatDate, shareEvent, resolveImageUri } from '@utils';
import { CalendarPlus, Check } from 'lucide-react-native';
import { IconTag } from '@components/global/IconTag';
import { TextDs, FlexView, ImageDs, LoadingIndicator } from '@components';

WebBrowser.maybeCompleteAuthSession();

export const BookingConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<TBookingConfirmationScreenNavigationProp>();
  const route = useRoute<TBookingConfirmationRouteProp>();
  const { eventId, bookingId, amountPaid, currency } = route.params;
  const [isCalendarAdded, setIsCalendarAdded] = React.useState(false);
  const [isAddingToCalendar, setIsAddingToCalendar] = React.useState(false);

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
          <LoadingIndicator size={60} />
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
    navigation.navigate('PlayerCalendar');
  };

  const getGoogleCalendarClientId = (): string => {
    const googleOAuth =
      Constants.expoConfig?.extra?.googleOAuth ||
      (Constants.manifest as { extra?: { googleOAuth?: { [key: string]: string } } } | null)?.extra
        ?.googleOAuth ||
      {};

    if (Platform.OS === 'ios') {
      return googleOAuth.iosClientId || googleOAuth.webClientId || '';
    }

    if (Platform.OS === 'android') {
      return googleOAuth.androidClientId || googleOAuth.webClientId || '';
    }

    return googleOAuth.webClientId || '';
  };

  const handleAddToCalendar = async () => {
    if (isCalendarAdded) {
      navigation.navigate('PlayerCalendar');
      return;
    }

    if (!event?.eventDateTime) {
      Alert.alert('Cannot Add Event', 'Event date is missing.');
      return;
    }

    const clientId =
      getGoogleCalendarClientId() ||
      '204335986948-6hombupu358nsu7pgga7v2b6ume920vn.apps.googleusercontent.com';

    if (!clientId) {
      Alert.alert(
        'Google Calendar',
        'Missing Google OAuth client ID. Please update app configuration.',
      );
      return;
    }

    try {
      setIsAddingToCalendar(true);

      const scheme = Constants.expoConfig?.scheme;
      const schemeStr =
        typeof scheme === 'string'
          ? scheme
          : Array.isArray(scheme)
            ? scheme[0]
            : 'rally-app';

      const redirectUri = AuthSession.makeRedirectUri({
        scheme: schemeStr,
      });

      // ✅ Discovery endpoints
      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
      };

      // ✅ Create auth request (PKCE enabled)
      const request = new AuthSession.AuthRequest({
        clientId,
        scopes: ['https://www.googleapis.com/auth/calendar.events'],
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        usePKCE: true,
        extraParams: {
          prompt: 'consent',
          access_type: 'offline',
        },
      });

      // 👉 Step 1: Get authorization code
      const result = await request.promptAsync(discovery);

      if (result.type !== 'success' || !result.params.code) {
        Alert.alert('Google Calendar', 'Authorization failed.');
        return;
      }

      // 👉 Step 2: Exchange code for access token
      const tokenResponse = await fetch(discovery.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `client_id=${clientId}&grant_type=authorization_code&code=${result.params.code}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&code_verifier=${request.codeVerifier}`,
      });

      const tokenData = await tokenResponse.json();

      if (!tokenData.access_token) {
        logger.error('Token exchange failed', tokenData);
        Alert.alert('Google Calendar', 'Failed to get access token.');
        return;
      }

      // 👉 Step 3: Create calendar event
      const startDate = new Date(event.eventDateTime);
      const endDate = event.eventEndDateTime
        ? new Date(event.eventEndDateTime)
        : new Date(startDate.getTime() + 60 * 60 * 1000);

      const calendarPayload = {
        summary: event.eventName ?? 'Rally Event',
        location: event.eventLocation ?? '',
        description: `Booked via Rally${bookingId ? `\nBooking ID: ${bookingId}` : ''
          }`,
        start: {
          dateTime: startDate.toISOString(),
        },
        end: {
          dateTime: endDate.toISOString(),
        },
      };

      const calendarResponse = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(calendarPayload),
        },
      );

      if (!calendarResponse.ok) {
        const responseText = await calendarResponse.text();
        logger.error('Calendar creation failed', responseText);
        Alert.alert('Google Calendar', 'Failed to add event.');
        return;
      }

      setIsCalendarAdded(true);
      Alert.alert(
        'Google Calendar',
        'Event added successfully. Tap Done to open your calendar.'
      );
    } catch (error) {
      logger.error('Add to calendar error', error);
      Alert.alert('Google Calendar', 'Something went wrong.');
    } finally {
      setIsAddingToCalendar(false);
    }
  };

  const handleShare = () => {
    shareEvent({
      eventId: event.eventId ?? eventId,
      eventName: event.eventName ?? 'Event',
      creatorName: event.creator?.fullName ?? event.eventCreatorName ?? '',
      formattedDateTime: formatDate(event.eventDateTime ?? '', 'display-range', { endTime: event.eventEndDateTime ?? undefined }),
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
              {formatDate(event.eventDateTime ?? '', 'display-range', { endTime: event.eventEndDateTime ?? undefined })}
            </TextDs>
          </FlexView>

          {/* Location */}
          <FlexView style={styles.eventDetailsRow}>
            <ImageDs image="locationPin" size={16} />
            <TextDs style={styles.eventDetailText}>{event.eventLocation ?? ''}</TextDs>
          </FlexView>

          {/* Amount Paid Section */}
          <FlexView style={styles.amountSection}>
            {route.params.subtotal !== undefined && (
              <FlexView style={[styles.amountRow, { marginBottom: spacing.xs }]}>
                <TextDs size={12} weight="regular" color="secondary">Subtotal</TextDs>
                <TextDs size={14} weight="regular" color="error">-</TextDs>
                {currency === 'aed' ? (
                  <FlexView flexDirection="row" alignItems="center" gap={spacing.xs}>
                    <ImageDs image="dhiramIcon" size={16} style={styles.priceIcon} />
                    <TextDs size={14} weight="regular" color="blueGray">
                      {route.params.subtotal.toFixed(2)}
                    </TextDs>
                  </FlexView>
                ) : (
                  <TextDs size={14} weight="regular" color="blueGray">
                    {currency} {route.params.subtotal.toFixed(2)}
                  </TextDs>
                )}
              </FlexView>
            )}
            {route.params.discountAmount !== undefined && route.params.discountAmount > 0 && (
              <FlexView style={[styles.amountRow, { marginBottom: spacing.xs }]}>
                <TextDs size={12} weight="regular" color="secondary">Discount</TextDs>
                <FlexView flexDirection="row" alignItems="center">
                  <TextDs size={14} weight="regular" color="error">-</TextDs>
                  {currency === 'aed' ? (
                    <FlexView flexDirection="row" alignItems="center" gap={spacing.xs}>
                      <ImageDs image="dhiramIcon" size={16} style={styles.priceIcon} />
                      <TextDs size={14} weight="regular" color="blueGray">
                        {route.params.discountAmount.toFixed(2)}
                      </TextDs>
                    </FlexView>
                  ) : (
                    <TextDs size={14} weight="regular" color="blueGray">
                      {currency} {route.params.discountAmount.toFixed(2)}
                    </TextDs>
                  )}
                </FlexView>
              </FlexView>
            )}
            {route.params.vatAmount !== undefined && (
              <FlexView style={[styles.amountRow, { marginBottom: spacing.xs }]}>
                <TextDs size={12} weight="regular" color="secondary">VAT (5%)</TextDs>
                <FlexView flexDirection="row" alignItems="center">
                  {currency === 'aed' ? (
                    <FlexView flexDirection="row" alignItems="center" gap={spacing.xs}>
                      <ImageDs image="dhiramIcon" size={16} style={styles.priceIcon} />
                      <TextDs size={14} weight="regular" color="blueGray">
                        {route.params.vatAmount.toFixed(2)}
                      </TextDs>
                    </FlexView>
                  ) : (
                    <TextDs size={14} weight="regular" color="blueGray">
                      {currency} {route.params.vatAmount.toFixed(2)}
                    </TextDs>
                  )}
                </FlexView>
              </FlexView>
            )}

            <FlexView style={[styles.amountRow, { marginTop: spacing.xs }]}>
              <TextDs size={14} weight="semibold" color="blueGray">
                Total Paid
              </TextDs>
              <FlexView flexDirection="row" alignItems="center">
                {currency === 'aed' ? (
                  <FlexView flexDirection="row" alignItems="center" gap={spacing.xs}>
                    <ImageDs image="dhiramIcon" size={16} style={styles.priceIcon} />
                    <TextDs size={14} weight="semibold" color="blueGray">
                      {amountPaid.toFixed(2)}
                    </TextDs>
                  </FlexView>
                ) : (
                  <TextDs size={14} weight="semibold" color="blueGray">
                    {currency} {amountPaid.toFixed(2)}
                  </TextDs>
                )}
              </FlexView>
            </FlexView>
            <FlexView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md }}>
              {route.params.guestsCount !== undefined && (
                <TextDs size={14} weight="regular" color="secondary" style={{ marginTop: spacing.md }}>
                  • {route.params.guestsCount} {route.params.guestsCount === 1 ? 'Person' : 'People'}
                </TextDs>
              )}

              <TouchableOpacity
                style={[styles.addToCalendarButton, { marginTop: spacing.md, alignSelf: 'flex-start' }]}
                onPress={handleAddToCalendar}
                disabled={isAddingToCalendar}
                activeOpacity={0.7}
              >
                {isCalendarAdded ? (
                  <Check size={12} color={colors.text.blueGray} />
                ) : (
                  <CalendarPlus size={12} color={colors.text.blueGray} />
                )}
                <TextDs size={14} weight="regular" color="blueGray">
                  {isAddingToCalendar ? 'Adding...' : isCalendarAdded ? 'Done' : 'Add to Calendar'}
                </TextDs>
              </TouchableOpacity>
            </FlexView>
          </FlexView>
        </FlexView>

        {/* Booking ID */}
        <TextDs size={14} weight="regular" color="secondary">
          Booking ID: #{bookingId}
        </TextDs>
      </ScrollView>

      {/* Done Button */}
      <FlexView style={styles.footer}>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone} activeOpacity={0.8}>
          <TextDs style={styles.doneButtonText}>Done</TextDs>
        </TouchableOpacity>
      </FlexView>
    </SafeAreaView >
  );
};
