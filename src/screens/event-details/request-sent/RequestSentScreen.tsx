import React, { useState } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { Calendar, Check } from 'lucide-react-native';
import { TextDs, FlexView, ImageDs } from '@components';
import { Card } from '@components/global/Card';
import { Subtitle, Title } from '@components/global';
import { IconTag } from '@components/global/IconTag';
import { colors, spacing } from '@theme';
import { shareEvent } from '@utils/share-utils';
import { styles } from './RequestSentScreen.styles';

type RequestSentScreenProps = NativeStackScreenProps<RootStackParamList, 'RequestSent'>;

const screenVariants = {
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
      'You will be notified when a slot opens up, upon payment your spot will be confirmed.',
  },
  registration: {
    image: 'HourGlass' as const,
    title: 'Reminder Set!',
    subTitle: 'You will be notified when the registration begins.',
  },
};

type RequestSentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RequestSent'>;

export const RequestSentScreen: React.FC = () => {
  const navigation = useNavigation<RequestSentScreenNavigationProp>();
  const route = useRoute<RequestSentScreenProps['route']>();
  const {
    variant,
    eventId,
    eventTitle,
    organizerName,
    eventImage,
    eventDate,
    eventLocation,
    amountDue,
    currency,
    bookingId,
    categories,
    eventType,
  } = route.params;

  const [isCalendarAdded, setIsCalendarAdded] = useState(false);
  const content = screenVariants[variant];

  const handleDone = () => {
    navigation.navigate('Home');
  };

  const handleShare = () => {
    shareEvent({
      eventId,
      eventName: eventTitle,
      creatorName: organizerName,
      formattedDateTime: eventDate,
      eventLocation,
    });
  };

  const handleAddToCalendar = () => {
    setIsCalendarAdded(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <FlexView style={styles.content}>
        <FlexView style={styles.iconContainer}>
          <ImageDs image={content.image} size={130} style={styles.hourglassIcon} />
        </FlexView>

        <TextDs style={styles.title}>{content.title}</TextDs>
        <TextDs style={styles.subtitle}>{content.subTitle}</TextDs>

        <FlexView style={styles.eventCardWrapper}>
          <Card>
            <FlexView style={styles.eventHeader}>
              <Image source={{ uri: eventImage }} style={styles.eventImage} />
              <FlexView style={styles.eventInfo}>
                <Title variant="cardTitle">{eventTitle}</Title>
                <Subtitle variant="default">by {organizerName}</Subtitle>
                <FlexView style={styles.categoriesContainer}>
                  <IconTag
                    title={categories?.[0] ?? 'Sport'}
                    variant="orange"
                  />
                  <IconTag title={eventType ?? 'Event'} variant="teal" />
                </FlexView>
              </FlexView>
              <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                <ImageDs image="PaperPlane" />
              </TouchableOpacity>
            </FlexView>

            <FlexView style={styles.divider} />

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

            <FlexView style={styles.amountContainer}>
              <TextDs style={styles.amountLabel}>Amount Due</TextDs>
              <FlexView style={styles.amountRow}>
                {currency === 'AED' ? (
                  <FlexView flexDirection="row" alignItems="center" gap={spacing.xs}>
                    <ImageDs image="dhiramIcon" size={16} style={styles.priceIcon} />
                    <TextDs style={styles.amountValue}>{amountDue.toFixed(2)}</TextDs>
                  </FlexView>
                ) : (
                  <TextDs style={styles.amountValue}>
                    {currency} {amountDue.toFixed(2)}
                  </TextDs>
                )}
                <TouchableOpacity
                  style={styles.calendarButton}
                  onPress={handleAddToCalendar}
                  disabled={isCalendarAdded}
                >
                  {isCalendarAdded ? (
                    <>
                      <Check size={16} color={colors.primary} />
                      <TextDs style={styles.calendarText}>Done</TextDs>
                    </>
                  ) : (
                    <>
                      <Calendar size={16} color={colors.primary} />
                      <TextDs style={styles.calendarText}>Add to Calendar</TextDs>
                    </>
                  )}
                </TouchableOpacity>
              </FlexView>
            </FlexView>
          </Card>
        </FlexView>

        {variant !== 'registration' && (
          <TextDs style={styles.bookingId}>Booking ID: #RSDXB01</TextDs>
        )}
      </FlexView>

      <FlexView style={styles.buttonContainer}>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <TextDs style={styles.doneButtonText}>Done</TextDs>
        </TouchableOpacity>
      </FlexView>
    </SafeAreaView>
  );
};
