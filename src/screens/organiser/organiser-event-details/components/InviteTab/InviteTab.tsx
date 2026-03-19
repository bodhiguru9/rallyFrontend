import React, { useState, useMemo, useRef, useCallback } from 'react';
import { ScrollView, TouchableOpacity, TextInput, Image, StyleSheet, ActivityIndicator, Alert, View, Share, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system/legacy';
import { TextDs, ImageDs, BottomSheetModal } from '@components';
import { Card } from '@components/global/Card';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';
import { FlexView } from '@designSystem/atoms/FlexView';
import { Users, Megaphone, QrCode, Check } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import type { EventData } from '@app-types';
import { useOrganiserFollowers } from '@hooks/organiser';
import { useAuthStore } from '@store/auth-store';
import { IconTag } from '@components/global/IconTag';
import { eventService } from '@services/event-service';
import { ENV } from '@config';
import { shareEvent } from '@utils/share-utils';
import { formatDate } from '@utils/date-utils';

type InviteView = 'invite' | 'buzz' | 'qrcode';

interface InviteTabProps {
  event: EventData;
  invitedUserIds: string[];
  setInvitedUserIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export const InviteTab: React.FC<InviteTabProps> = ({ event, invitedUserIds, setInvitedUserIds }) => {
  const [activeView, setActiveView] = useState<InviteView>('invite');
  const [searchQuery, setSearchQuery] = useState('');
  const [buzzMessage, setBuzzMessage] = useState('');
  const [invitingUserId, setInvitingUserId] = useState<string | null>(null);
  const [showQRSheet, setShowQRSheet] = useState(false);
  const [isSendingBuzz, setIsSendingBuzz] = useState(false);
  const maxBuzzLength = 50;

  const user = useAuthStore((state) => state.user);
  const organiserId = user?.userId;

  // Fetch organiser followers (same as AllFollowersScreen)
  const {
    data: followersResponse,
    isLoading: isLoadingSubscribers,
    error: subscribersError,
  } = useOrganiserFollowers(organiserId || 0, 1, 100, {
    enabled: !!organiserId && activeView === 'invite',
  });

  // Map API response to component format (same mapping as AllFollowersScreen)
  const subscribers = useMemo(() => {
    const raw = (followersResponse as any)?.data?.followers ||
      (followersResponse as any)?.data?.data?.followers ||
      (followersResponse as any)?.data?.users ||
      (followersResponse as any)?.data?.members ||
      [];
    if (!Array.isArray(raw)) {
      return [];
    }
    return raw.map((u: any) => ({
      userId: String(u.userId ?? u.id ?? ''),
      fullName: u.fullName || u.name || '',
      profilePic: u.profilePic ?? u.avatar ?? 'https://via.placeholder.com/60',
    }));
  }, [followersResponse]);

  const handleSendBuzz = async () => {
    if (buzzMessage.trim().length === 0) { return; }
    
    setIsSendingBuzz(true);
    
    try {
      const response = await eventService.notifyAttendees(
        event.eventId.toString(),
        buzzMessage.trim()
      );

      if (response.success) {
        Alert.alert(
          'Buzz Sent!',
          response.message || 'Your message has been sent to all attendees.',
          [{ text: 'OK' }]
        );
        setBuzzMessage('');
      } else {
        Alert.alert(
          'Failed',
          response.message || 'Failed to send buzz. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error sending buzz:', error);
      Alert.alert(
        'Error',
        'An error occurred while sending the buzz. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSendingBuzz(false);
    }
  };

  const handleInvitePlayer = async (userId: string) => {
    if (invitingUserId) {
      return; // Prevent multiple simultaneous invites
    }

    setInvitingUserId(userId);

    try {
      const response = await eventService.sendEventInvite(event.eventId.toString(), userId);

      if (response.success) {
        setInvitedUserIds((prev) => [...prev, userId]);
        Alert.alert(
          'Invite Sent!',
          response.message || 'The invite has been sent successfully to the player.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Failed',
          response.message || 'Failed to send invite. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      console.error('Error sending invite:', error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'An error occurred while sending the invite. Please try again.';
        
      Alert.alert('Notice', errorMessage, [{ text: 'OK' }]);
    } finally {
      setInvitingUserId(null);
    }
  };

  const filteredSubscribers = subscribers.filter((subscriber: { fullName: string; userId: string; profilePic: string }) =>
    subscriber.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const eventDetailsUrl = `${ENV.RALLY_WEB_BASE_URL}event/${event.eventId}`;
  const qrSvgRef = useRef<any>(null);

  const handleShareEvent = useCallback(() => {
    shareEvent({
      eventId: event.eventId.toString(),
      eventName: event.eventName ?? 'Event',
      creatorName: event.eventCreatorName ?? '',
      formattedDateTime: formatDate(event.eventDateTime ?? '', 'display-range'),
      eventLocation: event.eventLocation ?? undefined,
    });
  }, [event]);

  const handleCopyLink = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(eventDetailsUrl);
      Alert.alert('Copied', 'Event link copied to clipboard.');
    } catch {
      Alert.alert('Error', 'Could not copy link.');
    }
  }, [eventDetailsUrl]);

  const handleDownloadQR = useCallback(() => {
    const svg = qrSvgRef.current;
    if (!svg) {
      Alert.alert('Error', 'QR code not ready. Please try again.');
      return;
    }
    svg.toDataURL((dataUrl: string) => {
      const dir = FileSystem.cacheDirectory;
      if (!dir) {
        Alert.alert('Error', 'Could not save QR code.');
        return;
      }
      const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '').replace(/(\r\n|\n|\r)/gm, '');
      const filename = `event-${event.eventId}-qr.png`;
      const fileUri = `${dir}${filename}`;
      FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      })
        .then(() => {
          return Share.share(
            Platform.select({
              ios: { url: fileUri, message: event.eventName ?? 'Event', title: event.eventName ?? 'Event QR' },
              android: { message: `${event.eventName ?? 'Event'}\n${eventDetailsUrl}`, title: event.eventName ?? 'Event QR', url: fileUri },
              default: { message: eventDetailsUrl, title: event.eventName ?? 'Event QR' },
            }) ?? { message: eventDetailsUrl, title: event.eventName ?? 'Event QR' },
          );
        })
        .then(() => {
          Alert.alert('Done', 'QR code ready to save or share.');
        })
        .catch(() => {
          Alert.alert('Error', 'Could not save QR code.');
        });
    });
  }, [event.eventId, event.eventName, eventDetailsUrl]);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Action Buttons */}
      <FlexView row gap={spacing.md} mb={spacing.base}>
        <TouchableOpacity
          style={[styles.actionButton, activeView === 'invite' && styles.activeActionButton]}
          onPress={() => setActiveView('invite')}
          activeOpacity={0.7}
        >
          <Users size={28} color={activeView === 'invite' ? colors.text.white : colors.primary} />
          <TextDs
            size={14} weight="regular"
            color={activeView === 'invite' ? 'white' : 'primary'}
          >
            Invite
          </TextDs>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, activeView === 'buzz' && styles.activeActionButton]}
          onPress={() => setActiveView('buzz')}
          activeOpacity={0.7}
        >
          <Megaphone size={28} color={activeView === 'buzz' ? colors.text.white : colors.primary} />
          <TextDs
            size={14} weight="regular"
            color={activeView === 'buzz' ? 'white' : 'primary'}
          >
            Buzz
          </TextDs>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, activeView === 'qrcode' && styles.activeActionButton]}
          onPress={() => {
            setActiveView('qrcode');
            setShowQRSheet(true);
          }}
          activeOpacity={0.7}
        >
          <QrCode size={28} color={activeView === 'qrcode' ? colors.text.white : colors.primary} />
          <TextDs
            size={14} weight="regular"
            color={activeView === 'qrcode' ? 'white' : 'primary'}
          >
            QR Code
          </TextDs>
        </TouchableOpacity>
      </FlexView>

      {/* Invite View */}
      {activeView === 'invite' && (
        <>
          {/* Search Bar */}
          <Card style={styles.searchCard}>
            <FlexView style={styles.searchContainer}>
              <TextDs size={14} weight="regular" color="secondary">
                🔍
              </TextDs>
              <TextInput
                placeholder="Search Players by Name"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                placeholderTextColor={colors.text.tertiary}
              />
            </FlexView>
          </Card>

          {/* Subscribers Section */}
          <TextDs size={14} weight="regular" color="primary" style={styles.sectionTitle}>
            Subscribers
          </TextDs>

          {isLoadingSubscribers ? (
            <FlexView style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <TextDs size={14} weight="regular" color="secondary" style={styles.loadingText}>
                Loading subscribers...
              </TextDs>
            </FlexView>
          ) : subscribersError ? (
            <Card style={styles.errorCard}>
              <TextDs size={14} weight="regular" color="error" style={styles.errorText}>
                Failed to load subscribers. Please try again.
              </TextDs>
            </Card>
          ) : filteredSubscribers.length === 0 ? (
            <Card style={styles.emptyCard}>
              <TextDs size={14} weight="regular" color="secondary" style={styles.emptyText}>
                {searchQuery ? 'No subscribers found matching your search.' : 'No subscribers yet.'}
              </TextDs>
            </Card>
          ) : (
            <FlexView style={styles.subscribersGrid}>
              {filteredSubscribers.map((subscriber: { fullName: string; userId: string; profilePic: string }) => {
                const isInviting = invitingUserId === subscriber.userId;
                const isInvited = invitedUserIds.includes(subscriber.userId);

                return (
                  <TouchableOpacity
                    key={subscriber.userId}
                    style={styles.subscriberItem}
                    onPress={() => !isInvited && handleInvitePlayer(subscriber.userId)}
                    activeOpacity={0.7}
                    disabled={isInviting || isInvited}
                  >
                    <FlexView style={styles.subscriberAvatarContainer}>
                      <Image
                        source={{ uri: subscriber.profilePic }}
                        style={[styles.subscriberAvatar, (isInviting || isInvited) && styles.subscriberAvatarLoading]}
                      />
                      <FlexView style={[styles.addIcon, isInvited && { backgroundColor: colors.status.success, borderColor: colors.status.success }]}>
                        {isInviting ? (
                          <ActivityIndicator size="small" color={colors.text.white} />
                        ) : isInvited ? (
                          <Check size={14} color={colors.text.white} />
                        ) : (
                          <TextDs size={14} weight="regular" color="white">
                            +
                          </TextDs>
                        )}
                      </FlexView>
                    </FlexView>
                    <TextDs
                      size={14} weight="regular"
                      color="primary"
                      style={styles.subscriberName}
                      numberOfLines={2}
                    >
                      {subscriber.fullName}
                    </TextDs>
                  </TouchableOpacity>
                );
              })}
            </FlexView>
          )}
        </>
      )}

      {/* Buzz View */}
      {activeView === 'buzz' && (
        <Card style={styles.buzzCard}>
          <FlexView row justifyContent="space-between" alignItems="center" mb={spacing.md}>
            <TextDs size={14} weight="regular" color="primary">
              Send Buzz to Players
            </TextDs>
            <TouchableOpacity
              style={[styles.sendButton, isSendingBuzz && styles.sendButtonDisabled]}
              onPress={handleSendBuzz}
              disabled={buzzMessage.trim().length === 0 || isSendingBuzz}
              activeOpacity={0.7}
            >
              {isSendingBuzz ? (
                <ActivityIndicator size="small" color={colors.text.white} />
              ) : (
                <TextDs size={14} weight="regular" color="white">
                  Send
                </TextDs>
              )}
            </TouchableOpacity>
          </FlexView>

          <TextDs size={14} weight="regular" color="secondary" style={styles.buzzSubtitle}>
            Write and share updates with everyone in your event.
          </TextDs>

          <FlexView style={styles.buzzInputContainer}>
            <TextInput
              placeholder="Write a quick update, reminder, or message, it will be sent as a notification to everyone who's joined your event."
              value={buzzMessage}
              onChangeText={(text) => setBuzzMessage(text.slice(0, maxBuzzLength))}
              multiline
              style={styles.buzzInput}
              placeholderTextColor={colors.text.tertiary}
              maxLength={maxBuzzLength}
            />
            <FlexView style={styles.characterCount}>
              <TextDs size={14} weight="regular" color="secondary">
                {buzzMessage.length}/{maxBuzzLength}
              </TextDs>
            </FlexView>
          </FlexView>
        </Card>
      )}

      {/* QR Code View - placeholder when sheet is closed */}
      {activeView === 'qrcode' && !showQRSheet && (
        <Card style={styles.qrPlaceholderCard}>
          <TextDs size={14} weight="regular" color="secondary" style={styles.qrPlaceholderText}>
            Show the QR code for walk-in players to check in and pay.
          </TextDs>
          <TouchableOpacity
            style={styles.qrPlaceholderButton}
            onPress={() => setShowQRSheet(true)}
            activeOpacity={0.7}
          >
            <QrCode size={24} color={colors.text.white} />
            <TextDs size={14} weight="regular" color="white">
              Show QR Code
            </TextDs>
          </TouchableOpacity>
        </Card>
      )}

      {/* QR Code Bottom Sheet */}
      <BottomSheetModal
        visible={showQRSheet}
        onClose={() => setShowQRSheet(false)}
        snapPoints={['90%']}
        contentContainerStyle={styles.qrSheetContent}
        backgroundStyle={styles.qrSheetBackground}
      >
        <FlexView style={styles.qrPaymentContainer}>
          <FlexView style={styles.qrHeader}>
            <TextDs size={14} weight="regular" color="primary">
              QR Payment
            </TextDs>
            <TextDs size={14} weight="regular" color="secondary" style={styles.qrHeaderSubtitle}>
              Let walk-in players scan this code to check in and pay instantly on the app.
            </TextDs>
          </FlexView>

          <Card style={styles.qrEventCard}>
            <FlexView row gap={spacing.base} alignItems="center">
              <Image
                source={{ uri: event.eventImages[0] || 'https://via.placeholder.com/60' }}
                style={styles.qrEventImage}
              />
              <FlexView flex={1}>
                <TextDs size={14} weight="regular" color="primary" numberOfLines={1}>
                  {event.eventName}
                </TextDs>
                <TextDs size={14} weight="regular" color="secondary" numberOfLines={1}>
                  by {event.eventCreatorName}
                </TextDs>
                <FlexView row gap={spacing.xs} mt={spacing.xs} flexWrap="wrap">
                  {event.eventSports.slice(0, 2).map((sport, index) => (
                    <IconTag
                      key={index}
                      title={sport}
                      icon={Users}
                      variant="orange"
                      size="small"
                    />
                  ))}
                  <IconTag
                    title={event.eventType}
                    icon={Users}
                    variant="teal"
                    size="small"
                  />
                </FlexView>
              </FlexView>
            </FlexView>
          </Card>

          <FlexView style={styles.qrCodeMainContainer}>
            <View style={styles.qrCodePlaceholder}>
              <QRCode
                getRef={(c) => (qrSvgRef.current = c)}
                value={eventDetailsUrl}
                size={220}
                color={colors.text.primary}
                backgroundColor={colors.background.white}
              />
            </View>
          </FlexView>

          <FlexView style={styles.qrEventDetails}>
            <FlexView row gap={spacing.sm} alignItems="center" mb={spacing.xs}>
              <ImageDs image="PeachClock" style={styles.qrDetailIconImage} />
              <TextDs size={14} weight="regular" color="secondary" style={styles.qrDetailText}>
                {new Date(event.eventDateTime).toLocaleDateString('en-US', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
                , {new Date(event.eventDateTime).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </TextDs>
            </FlexView>

            <FlexView row gap={spacing.sm} alignItems="center" mb={spacing.sm}>
              <ImageDs image="GreenPin" style={styles.qrDetailIconImage} />
              <TextDs size={14} weight="regular" color="secondary" style={styles.qrDetailText} numberOfLines={1}>
                {event.eventLocation}
              </TextDs>
            </FlexView>

            <FlexView row justifyContent="space-between" alignItems="center">
              <TextDs size={14} weight="regular" color="secondary">
                Amount to Pay
              </TextDs>
              <FlexView row alignItems='center' gap={spacing.xs}>
                <ImageDs image="DhiramIcon" size={16} />
                <TextDs size={14} weight="regular" color="blueGray">
                  {event.eventPricePerGuest.toFixed(2)}
                </TextDs>
              </FlexView>
            </FlexView>
          </FlexView>

          <FlexView row gap={spacing.md} mt={spacing.lg}>
            <TouchableOpacity style={styles.qrActionButton} onPress={handleShareEvent} activeOpacity={0.7}>
              <ImageDs image="PaperPlane" style={styles.qrActionIcon} />
              <TextDs size={14} weight="regular" color="primary">
                Share
              </TextDs>
            </TouchableOpacity>

            <TouchableOpacity style={styles.qrActionButton} onPress={handleDownloadQR} activeOpacity={0.7}>
              <TextDs size={14} weight="regular" color="primary" style={styles.qrActionIconText}>
                ⬇
              </TextDs>
              <TextDs size={14} weight="regular" color="primary">
                Download
              </TextDs>
            </TouchableOpacity>

            <TouchableOpacity style={styles.qrActionButton} onPress={handleCopyLink} activeOpacity={0.7}>
              <TextDs size={14} weight="regular" color="primary" style={styles.qrActionIconText}>
                🔗
              </TextDs>
              <TextDs size={14} weight="regular" color="primary">
                Copy Link
              </TextDs>
            </TouchableOpacity>
          </FlexView>

          <TouchableOpacity
            style={styles.qrCloseButton}
            onPress={() => setShowQRSheet(false)}
            activeOpacity={0.7}
          >
            <TextDs size={14} weight="semibold" color="white">
              Close
            </TextDs>
          </TouchableOpacity>
        </FlexView>
      </BottomSheetModal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.card.primary,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border.white,
    gap: spacing.xs,
    minHeight: 70,
  },
  activeActionButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  searchCard: {
    marginBottom: spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  searchInput: {
    flex: 1,
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
    paddingVertical: spacing.xs,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  subscribersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  subscriberItem: {
    width: '17%',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  subscriberAvatarContainer: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  subscriberAvatar: {
    width: 65,
    height: 65,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
  },
  subscriberAvatarLoading: {
    opacity: 0.5,
  },
  addIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background.cream,
  },
  subscriberName: {
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  loadingText: {
    marginTop: spacing.base,
    textAlign: 'center',
  },
  errorCard: {
    padding: spacing.base,
    backgroundColor: '#FFEBEE',
    borderColor: colors.status.error,
    borderWidth: 1,
  },
  errorText: {
    textAlign: 'center',
  },
  emptyCard: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
  buzzCard: {
    padding: spacing.base,
  },
  buzzSubtitle: {
    marginBottom: spacing.base,
    lineHeight: 20,
  },
  sendButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: "center",
    minWidth: 80,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  buzzInputContainer: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    minHeight: 200,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  buzzInput: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
    textAlignVertical: 'top',
    minHeight: 150,
    lineHeight: 22,
  },
  characterCount: {
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
  },
  qrPlaceholderCard: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  qrPlaceholderText: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  qrPlaceholderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  qrSheetContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xl,
  },
  qrSheetBackground: {
    experimental_backgroundImage: colors.gradient.mainBackground,
  },
  qrPaymentContainer: {
    flex: 1,
  },
  qrHeader: {
    marginBottom: spacing.lg,
  },
  qrHeaderSubtitle: {
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  qrEventCard: {
    padding: spacing.base,
    marginBottom: spacing.lg,
  },
  qrEventImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
  },
  qrCodeMainContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  qrCodePlaceholder: {
    width: 280,
    height: 280,
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrEventDetails: {
    backgroundColor: colors.card.primary,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.white,
  },
  qrDetailIcon: {
    width: 20,
  },
  qrDetailIconImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  qrDetailText: {
    flex: 1,
    lineHeight: 20,
  },
  qrActionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.card.primary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.white,
    gap: spacing.xs,
  },
  qrActionIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  qrActionIconText: {
    lineHeight: 24,
  },
  qrCloseButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
