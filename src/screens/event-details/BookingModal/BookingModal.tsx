import React, { useState, useMemo } from 'react';
import { TextDs, FlexView, ImageDs } from '@components';
import {
  Modal,
  TouchableOpacity,
  Pressable,
  TextInput,
  ScrollView,
  PanResponder,
  Animated,
  Alert,
} from 'react-native';
import { ArrowRight, Calendar, ChevronUp, X } from 'lucide-react-native';
import { colors, spacing } from '@theme';
import type { IBookingModalProps } from './BookingModal.types';
import { styles } from './style/BookingModal.styles';
import { MonthYearPicker } from '@components/private/booking/MonthYearPicker';
import { useStripe } from '@stripe/stripe-react-native';
import { paymentService } from '@services';
import { logger } from '@dev-tools/logger';

export const BookingModal: React.FC<IBookingModalProps> = ({
  visible,
  totalPrice,
  currency,
  guestsCount,
  onClose,
  onBookEvent,
  onApplePay,
  primaryButtonText = 'Book Event',
  eventId,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState<{ month: number; year: number } | null>(null);
  const [cvv, setCvv] = useState('');
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { confirmPayment, initPaymentSheet, presentPaymentSheet } = useStripe();

  const renderAmount = (value: string, textStyle: object) =>
    currency === 'AED' ? (
      <FlexView flexDirection="row" alignItems="center" gap={spacing.xs}>
        <ImageDs image="dhiramWhiteIcon" size={16} style={styles.priceIcon} />
        <TextDs style={textStyle}>{value}</TextDs>
      </FlexView>
    ) : (
      <TextDs style={textStyle}>{currency} {value}</TextDs>
    );

  // Create Animated.Value and PanResponder only once using useMemo
  // This pattern avoids accessing refs during render
  const { translateY, panResponder } = useMemo(() => {
    const animatedValue = new Animated.Value(0);

    const responder = PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        // Only start if the gesture is on the handle bar area or top of modal
        return evt.nativeEvent.locationY < 100;
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to downward vertical swipes
        return gestureState.dy > 10 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderGrant: () => {
        // Get the current value safely
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const currentValue =
          (animatedValue as Animated.Value & { getValue?: () => number }).getValue?.() || 0;
        animatedValue.setOffset(currentValue);
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow downward movement
        if (gestureState.dy > 0) {
          animatedValue.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        animatedValue.flattenOffset();
        // If swiped down more than 100px, close the modal
        if (gestureState.dy > 100) {
          Animated.timing(animatedValue, {
            toValue: 1000,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            animatedValue.setValue(0);
            onClose();
          });
        } else {
          // Snap back to original position
          Animated.spring(animatedValue, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start();
        }
      },
    });

    return { translateY: animatedValue, panResponder: responder };
  }, [onClose]); // Only recreate if onClose changes

  const handleApplyPromoCode = () => {
    if (promoCode.trim()) {
      // Dummy promo code logic - apply 20% discount for "FIRSTTIME20"
      if (promoCode.toUpperCase() === 'FIRSTTIME20') {
        const discount = totalPrice * 0.2; // 20% discount
        setPromoDiscount(discount);
        setAppliedPromoCode(promoCode.toUpperCase());
      } else {
        // Other promo codes can be added here
        setPromoDiscount(0);
        setAppliedPromoCode(null);
      }
    }
  };

  // Calculate payment breakdown with example data
  // For Hot Cricket: base price is 75 AED per guest
  // Example calculation: 75 * guests = reservation charge
  const basePricePerGuest = totalPrice / guestsCount;
  const reservationCharge = basePricePerGuest * guestsCount;

  // Example fees (can be customized per event)
  const platformFee = 10.0; // Fixed platform fee
  const vatRate = 0.05; // 5% VAT rate
  const subtotalBeforeVAT = reservationCharge - promoDiscount + platformFee;
  const vat = Math.round(subtotalBeforeVAT * vatRate * 100) / 100; // Calculate VAT
  const finalTotal = subtotalBeforeVAT + vat;

  const formatCardNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
  };

  const handleExpirySelect = (month: number, year: number) => {
    setExpiryDate({ month, year });
    setShowExpiryPicker(false);
  };

  const formatExpiryDisplay = () => {
    if (!expiryDate) {
      return '';
    }
    const month = String(expiryDate.month + 1).padStart(2, '0');
    const year = String(expiryDate.year).slice(-2);
    return `${month}/${year}`;
  };

  const handleCvvChange = (text: string) => {
    // Only allow digits, max 4 characters
    const cleaned = text.replace(/\D/g, '').substring(0, 4);
    setCvv(cleaned);
  };

  const handlePrimaryAction = async () => {
    if (isProcessing) {
      return;
    }

    // Validate card details
    const cleanedCard = cardNumber.replace(/\D/g, '');
    if (cleanedCard.length < 13 || cleanedCard.length > 19) {
      Alert.alert('Invalid Card', 'Please enter a valid card number');
      return;
    }

    if (!expiryDate) {
      Alert.alert('Invalid Expiry', 'Please select card expiry date');
      return;
    }

    if (cvv.length < 3) {
      Alert.alert('Invalid CVV', 'Please enter a valid CVV');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create booking and get Stripe Payment Intent
      logger.info('Creating booking for event:', eventId);
      const bookingResponse = await paymentService.createBookingWithPayment(
        eventId,
        appliedPromoCode || (promoCode.trim() || null),
      );

      if (!bookingResponse.success) {
        throw new Error(bookingResponse.message || 'Failed to create booking');
      }

      const { data } = bookingResponse;

      // Check if it's a free event
      if (data.isFreeEvent || !data.paymentRequired) {
        logger.info('Free event - no payment required');
        setIsProcessing(false);
        onBookEvent({
          promoCode: appliedPromoCode || (promoCode.trim() || null),
          amount: 0,
          currency,
        });
        return;
      }

      // Step 2: Confirm payment with Stripe using card details
      logger.info('Confirming payment with Stripe');
      const { error, paymentIntent } = await confirmPayment(data.paymentIntent.clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            name: data.user.fullName,
            email: data.user.email,
            phone: data.user.mobileNumber,
          },
        },
      });

      if (error) {
        logger.error('Payment failed:', error);
        Alert.alert(
          'Payment Failed',
          error.message || 'Your payment could not be processed. Please try again.',
        );
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status !== 'Succeeded') {
        logger.warn('Payment Intent status:', paymentIntent?.status);
        Alert.alert(
          'Payment Incomplete',
          'Payment was not completed successfully. Please try again.',
        );
        setIsProcessing(false);
        return;
      }

      // Step 3: Verify payment on backend
      logger.info('Verifying payment on backend');
      const verifyResponse = await paymentService.verifyPayment(paymentIntent.id);

      if (!verifyResponse.success) {
        throw new Error(verifyResponse.message || 'Failed to verify payment');
      }

      logger.info('Payment verified successfully');
      setIsProcessing(false);

      // Call onBookEvent with payment details
      const last4 = cleanedCard.slice(-4);
      onBookEvent({
        promoCode: appliedPromoCode || (promoCode.trim() || null),
        cardLast4: last4,
        expiryMonth: expiryDate.month + 1,
        expiryYear: expiryDate.year,
        amount: data.payment.finalAmount,
        currency: data.payment.currency,
        paymentIntentId: paymentIntent.id,
        bookingId: data.booking.bookingId,
      });
    } catch (error) {
      logger.error('Booking error:', error);
      Alert.alert(
        'Booking Failed',
        error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
      );
      setIsProcessing(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{
                translateY: translateY.interpolate({
                  inputRange: [0, 1000],
                  outputRange: [0, 1000],
                  extrapolate: 'clamp'
                })
              }]
            }
          ]}
          {...panResponder.panHandlers}
        >
          {/* 1. Handle Bar */}
          <FlexView style={styles.handleBarContainer}>
            <FlexView style={styles.handleBar} />
          </FlexView>


          {/* 3. Scrollable Content */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* ... All your Promo and Card sections ... */}
            {/* Promo Code Section */}
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
                    <X
                      size={18}
                      color={colors.text.secondary}
                      style={styles.promoCodeArrow}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={handleApplyPromoCode} activeOpacity={0.7}>
                    <ArrowRight
                      size={20}
                      color={colors.text.secondary}
                      style={styles.promoCodeArrow}
                    />
                  </TouchableOpacity>
                )}
              </FlexView>
            </FlexView>

            {/* Payment Details Section - Always Expanded */}
            <FlexView style={styles.section}>
              <FlexView style={styles.paymentDetailsHeader}>
                <TextDs style={styles.sectionTitle}>Payment Details</TextDs>
                <ChevronUp size={20} color={colors.text.secondary} />
              </FlexView>
              <FlexView style={styles.paymentDetailsContent}>
                {/* Reservation Charge */}
                <FlexView style={styles.paymentRow}>
                  <TextDs style={styles.paymentLabel}>Reservation Charge</TextDs>
                  {renderAmount(reservationCharge.toFixed(2), styles.paymentAmount)}
                </FlexView>

                {/* Promo Code Discount */}
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

                {/* Platform Fee */}
                <FlexView style={styles.paymentRow}>
                  <TextDs style={styles.paymentLabel}>Platform Fee</TextDs>
                  {renderAmount(platformFee.toFixed(2), styles.paymentAmount)}
                </FlexView>

                {/* VAT */}
                <FlexView style={styles.paymentRow}>
                  <TextDs style={styles.paymentLabel}>VAT</TextDs>
                  {renderAmount(vat.toFixed(2), styles.paymentAmount)}
                </FlexView>

                {/* Divider */}
                <FlexView style={styles.paymentDivider} />

                {/* Total */}
                <FlexView style={styles.totalRow}>
                  <TextDs style={styles.totalLabel}>Total ({guestsCount})</TextDs>
                  {renderAmount(finalTotal.toFixed(2), styles.totalPrice)}
                </FlexView>
              </FlexView>
            </FlexView>

            {/* Credit/Debit Card Section */}
            <FlexView style={styles.section}>
              <TextDs style={styles.sectionTitle}>Credit/Debit Card</TextDs>
              {/* Card Number */}
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
              {/* Expiry Date and CVV */}
              <FlexView style={styles.cardInputsRow}>
                <FlexView style={styles.cardInputContainer}>
                  <TouchableOpacity
                    style={[styles.cardInput, styles.cardInputTouchable]}
                    onPress={() => setShowExpiryPicker(true)}
                    activeOpacity={0.7}
                  >
                    <TextDs
                      style={[styles.cardInputText, !expiryDate && styles.cardInputPlaceholder]}
                    >
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

            {/* Disclaimer */}
            <TextDs style={styles.disclaimer}>
              By joining the session, you agree that you fit all the requirements of this event.
            </TextDs>

            {/* Apple Pay stays at the bottom of the scroll or below */}
            {onApplePay && (
              <TouchableOpacity style={styles.applePayButton} onPress={onApplePay}>
                <TextDs style={styles.applePayButtonText}>Pay with Apple Pay</TextDs>
              </TouchableOpacity>
            )}
          </ScrollView>
          {/* 2. THE NEW CTA HEADER (The "persistent" button) */}
          <FlexView style={styles.modalHeaderButtonContainer}>
            <TouchableOpacity
              style={[styles.bookEventButton, isProcessing && { opacity: 0.6 }]}
              onPress={handlePrimaryAction}
              activeOpacity={0.8}
              disabled={isProcessing}
            >
              <TextDs style={styles.bookEventButtonText}>
                {isProcessing ? 'Processing Payment...' : primaryButtonText}
              </TextDs>
            </TouchableOpacity>
          </FlexView>
        </Animated.View>
      </Pressable>

      {/* Month/Year Picker Modal */}
      {showExpiryPicker && (
        <MonthYearPicker
          visible={showExpiryPicker}
          onSelect={handleExpirySelect}
          onClose={() => setShowExpiryPicker(false)}
        />
      )}
    </Modal>
  );
};
