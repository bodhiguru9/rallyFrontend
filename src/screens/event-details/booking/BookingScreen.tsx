import React, { useState } from 'react';
import {
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { ArrowRight, Calendar, ChevronUp, X } from 'lucide-react-native';
import { TextDs, FlexView, ImageDs } from '@components';
import { ArrowIcon } from '@components/global/ArrowIcon';
import { colors, spacing } from '@theme';
import { MonthYearPicker } from '@components/private/booking/MonthYearPicker';
import { useBookEvent } from '@hooks/use-events';
import { styles } from './BookingScreen.styles';

type BookingScreenProps = NativeStackScreenProps<RootStackParamList, 'Booking'>;

type BookingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Booking'>;

export const BookingScreen: React.FC = () => {
  const navigation = useNavigation<BookingScreenNavigationProp>();
  const route = useRoute<BookingScreenProps['route']>();
  const { eventId, totalPrice, currency, guestsCount } = route.params;

  const { mutate: bookEvent, isPending: isBookingEvent } = useBookEvent();

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState<{ month: number; year: number } | null>(null);
  const [cvv, setCvv] = useState('');
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);

  const renderAmount = (value: string, textStyle: object) =>
    currency === 'AED' ? (
      <FlexView flexDirection="row" alignItems="center" gap={spacing.xs}>
        <ImageDs image="dhiramWhiteIcon" size={16} style={styles.priceIcon} />
        <TextDs style={textStyle}>{value}</TextDs>
      </FlexView>
    ) : (
      <TextDs style={textStyle}>{currency} {value}</TextDs>
    );

  const handleApplyPromoCode = () => {
    if (promoCode.trim()) {
      if (promoCode.toUpperCase() === 'FIRSTTIME20') {
        const discount = totalPrice * 0.2;
        setPromoDiscount(discount);
        setAppliedPromoCode(promoCode.toUpperCase());
      } else {
        setPromoDiscount(0);
        setAppliedPromoCode(null);
      }
    }
  };

  const basePricePerGuest = totalPrice / guestsCount;
  const reservationCharge = basePricePerGuest * guestsCount;
  const platformFee = 10.0;
  const vatRate = 0.05;
  const subtotalBeforeVAT = reservationCharge - promoDiscount + platformFee;
  const vat = Math.round(subtotalBeforeVAT * vatRate * 100) / 100;
  const finalTotal = subtotalBeforeVAT + vat;

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const handleCardNumberChange = (text: string) => {
    setCardNumber(formatCardNumber(text));
  };

  const handleExpirySelect = (month: number, year: number) => {
    setExpiryDate({ month, year });
    setShowExpiryPicker(false);
  };

  const formatExpiryDisplay = () => {
    if (!expiryDate) { return ''; }
    const month = String(expiryDate.month + 1).padStart(2, '0');
    const year = String(expiryDate.year).slice(-2);
    return `${month}/${year}`;
  };

  const handleCvvChange = (text: string) => {
    setCvv(text.replace(/\D/g, '').substring(0, 4));
  };

  const handleBookEvent = () => {
    bookEvent(eventId, {
      onSuccess: (response) => {
        navigation.navigate('BookingConfirmation', {
          eventId,
          bookingId: response.data.booking.bookingId,
          amountPaid: response.data.booking.finalAmount,
          currency: currency ?? 'AED',
          guestsCount,
        });
      },
    });
  };

  const handleApplePay = () => {
    bookEvent(eventId, {
      onSuccess: (response) => {
        navigation.navigate('BookingConfirmation', {
          eventId,
          bookingId: response.data.booking.bookingId,
          amountPaid: response.data.booking.finalAmount,
          currency: currency ?? 'AED',
          guestsCount,
        });
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlexView style={styles.header}>
        <ArrowIcon variant="left" onClick={() => navigation.goBack()} />
        <TextDs style={styles.sectionTitle}>Book Event</TextDs>
        <FlexView style={{ width: 24 }} />
      </FlexView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <FlexView style={styles.section}>
          <TextDs style={styles.sectionTitle}>Promo Code</TextDs>
          <FlexView style={styles.promoCodeContainer}>
            <TextInput
              style={styles.promoCodeInput}
              placeholder="Enter Promo Code"
              placeholderTextColor={colors.text.tertiary}
              value={appliedPromoCode || promoCode}
              onChangeText={setPromoCode}
              editable={!appliedPromoCode}
            />
            {appliedPromoCode ? (
              <TouchableOpacity
                onPress={() => {
                  setPromoCode('');
                  setAppliedPromoCode(null);
                  setPromoDiscount(0);
                }}
                activeOpacity={0.7}
              >
                <X size={18} color={colors.text.secondary} style={styles.promoCodeArrow} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleApplyPromoCode} activeOpacity={0.7}>
                <ArrowRight size={20} color={colors.text.secondary} style={styles.promoCodeArrow} />
              </TouchableOpacity>
            )}
          </FlexView>
        </FlexView>

        <FlexView style={styles.section}>
          <FlexView style={styles.paymentDetailsHeader}>
            <TextDs style={styles.sectionTitle}>Payment Details</TextDs>
            <ChevronUp size={20} color={colors.text.secondary} />
          </FlexView>
          <FlexView style={styles.paymentDetailsContent}>
            <FlexView style={styles.paymentRow}>
              <TextDs style={styles.paymentLabel}>Reservation Charge</TextDs>
              {renderAmount(reservationCharge.toFixed(2), styles.paymentAmount)}
            </FlexView>
            {appliedPromoCode && promoDiscount > 0 ? (
              <FlexView style={styles.paymentRow}>
                <TextDs style={styles.paymentLabel}>Promo Code</TextDs>
                {currency === 'AED' ? (
                  <FlexView flexDirection="row" alignItems="center" gap={spacing.xs}>
                    <ImageDs image="dhiramWhiteIcon" size={16} style={styles.priceIcon} />
                    <TextDs style={styles.paymentDiscount}>-{promoDiscount.toFixed(2)}</TextDs>
                  </FlexView>
                ) : (
                  <TextDs style={styles.paymentDiscount}>{currency} -{promoDiscount.toFixed(2)}</TextDs>
                )}
              </FlexView>
            ) : (
              <FlexView style={styles.paymentRow}>
                <TextDs style={styles.paymentLabel}>Promo Code</TextDs>
                {renderAmount('0.00', styles.paymentAmount)}
              </FlexView>
            )}
            <FlexView style={styles.paymentRow}>
              <TextDs style={styles.paymentLabel}>Platform Fee</TextDs>
              {renderAmount(platformFee.toFixed(2), styles.paymentAmount)}
            </FlexView>
            <FlexView style={styles.paymentRow}>
              <TextDs style={styles.paymentLabel}>VAT</TextDs>
              {renderAmount(vat.toFixed(2), styles.paymentAmount)}
            </FlexView>
            <FlexView style={styles.paymentDivider} />
            <FlexView style={styles.totalRow}>
              <TextDs style={styles.totalLabel}>Total ({guestsCount})</TextDs>
              {renderAmount(finalTotal.toFixed(2), styles.totalPrice)}
            </FlexView>
          </FlexView>
        </FlexView>

        <FlexView style={styles.section}>
          <TextDs style={styles.sectionTitle}>Credit/Debit Card</TextDs>
          <FlexView style={styles.cardInputFullWidth}>
            <TextInput
              style={styles.cardInput}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor={colors.text.tertiary}
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              keyboardType="numeric"
              maxLength={19}
            />
          </FlexView>
          <FlexView style={styles.cardInputsRow}>
            <FlexView style={styles.cardInputContainer}>
              <TouchableOpacity
                style={[styles.cardInput, styles.cardInputTouchable]}
                onPress={() => setShowExpiryPicker(true)}
                activeOpacity={0.7}
              >
                <TextDs style={[styles.cardInputText, !expiryDate && styles.cardInputPlaceholder]}>
                  {expiryDate ? formatExpiryDisplay() : 'MM/YY'}
                </TextDs>
                <Calendar size={18} color={colors.text.secondary} />
              </TouchableOpacity>
            </FlexView>
            <FlexView style={styles.cardInputContainer}>
              <TextInput
                style={styles.cardInput}
                placeholder="CVV"
                placeholderTextColor={colors.text.tertiary}
                value={cvv}
                onChangeText={handleCvvChange}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </FlexView>
          </FlexView>
        </FlexView>

        <TextDs style={styles.disclaimer}>
          By joining the session, you agree that you fit all the requirements of this event.
        </TextDs>
      </ScrollView>

      <FlexView style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.bookEventButton}
          onPress={handleBookEvent}
          activeOpacity={0.8}
          disabled={isBookingEvent}
        >
          <TextDs style={styles.bookEventButtonText}>
            {isBookingEvent ? 'Processing...' : 'Book Event'}
          </TextDs>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applePayButton} onPress={handleApplePay} activeOpacity={0.8} disabled={isBookingEvent}>
          <TextDs style={styles.applePayButtonText}>Pay with Apple Pay</TextDs>
        </TouchableOpacity>
      </FlexView>

      <MonthYearPicker
        visible={showExpiryPicker}
        value={expiryDate || undefined}
        onSelect={handleExpirySelect}
        onClose={() => setShowExpiryPicker(false)}
      />
    </SafeAreaView>
  );
};
