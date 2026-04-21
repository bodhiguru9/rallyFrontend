import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Keyboard,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { ArrowRight, ChevronUp, ChevronDown, X } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '@theme';
import type { IBookingModalProps } from './BookingModal.types';
import { styles } from './style/BookingModal.styles';
import { useStripe, initStripe, PlatformPay } from '@stripe/stripe-react-native';
import { paymentService, bookingService, SavedCard } from '@services';
import { logger } from '@dev-tools/logger';
import { useAuthStore } from '@store';
import { AddCardModal } from '@screens/player-profile/PaymentMethods/components/AddCardModal';

export const BookingModal: React.FC<IBookingModalProps> = ({
  visible,
  totalPrice,
  currency,
  guestsCount,
  onClose,
  onBookEvent,
  primaryButtonText = 'Book Event',
  eventId,
  occurrenceStart,
  occurrenceEnd,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentDetailsExpanded, setIsPaymentDetailsExpanded] = useState(false);
  const [keyboardPadding, setKeyboardPadding] = useState(0);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isAddCardModalVisible, setIsAddCardModalVisible] = useState(false);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || null;

  // Listen for keyboard events to adjust bottom padding inside the modal
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onKeyboardShow = (e: { endCoordinates: { height: number } }) => {
      setKeyboardPadding(e.endCoordinates.height);
      // Scroll to bottom so card inputs are visible
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    };
    const onKeyboardHide = () => {
      setKeyboardPadding(0);
    };

    const sub1 = Keyboard.addListener(showEvent, onKeyboardShow);
    const sub2 = Keyboard.addListener(hideEvent, onKeyboardHide);
    return () => {
      sub1.remove();
      sub2.remove();
    };
  }, []);

  const fetchCards = async () => {
    setIsLoadingCards(true);
    try {
      const response = await paymentService.getSavedCards();

      // Store the publishable key AND re-initialize Stripe SDK for card operations.
      // initStripe() is safe here because fetchCards runs early (on modal open),
      // well before any Apple Pay interaction. Card operations (createPaymentMethod,
      // confirmPayment) need the SDK initialized immediately.
      if (response.publishableKey) {
        useAuthStore.getState().setStripePublishableKey(response.publishableKey);
        try {
          await initStripe({
            publishableKey: response.publishableKey,
            merchantIdentifier: 'merchant.com.rallysports',
          });
          logger.info('Stripe SDK initialized with key from getSavedCards');
        } catch (initError) {
          logger.error('Failed to initialize Stripe SDK in fetchCards:', initError);
        }
      }

      if (response.success && response.data.cards) {
        setSavedCards(response.data.cards);
        // Set default or first card if none selected
        if (!selectedCardId) {
          const defaultCard = response.data.cards.find((c) => c.isDefault);
          if (defaultCard) {
            setSelectedCardId(defaultCard.cardId);
          } else if (response.data.cards.length > 0) {
            setSelectedCardId(response.data.cards[0].cardId);
          }
        }
      }
    } catch (err) {
      logger.error('Failed to fetch cards:', err);
    } finally {
      setIsLoadingCards(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchCards();
    }
  }, [visible]);

  const onCardAdded = () => {
    setIsAddCardModalVisible(false);
    fetchCards();
  };

  const handleAddCard = async (cardData: {
    paymentMethodId: string;
    cardHolderName: string;
    isDefault: boolean;
  }) => {
    try {
      const response = await paymentService.saveCard(cardData);
      if (response.success) {
        onCardAdded();
      } else {
        Alert.alert('Error', response.message || 'Failed to save card');
      }
    } catch (err) {
      logger.error('Failed to save card:', err);
      Alert.alert('Error', 'An unexpected error occurred while saving the card.');
    }
  };

  const renderAmount = (value: string, textStyle: object) =>
    currency === 'AED' ? (
      <FlexView width={60} flexDirection="row" alignItems="center" gap={spacing.xs}>
        <ImageDs image="dhiramGrayIcon" size={16} style={styles.priceIcon} />
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
  const subtotalBeforeVAT = reservationCharge - promoDiscount;
  // const subtotalBeforeVAT = reservationCharge - promoDiscount + platformFee;
  const vat = Math.round(subtotalBeforeVAT * vatRate * 100) / 100; // Calculate VAT
  const finalTotal = subtotalBeforeVAT + vat;

  const { confirmPayment, isPlatformPaySupported, confirmPlatformPayPayment } = useStripe();
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);

  // Check if Apple Pay is supported on this device
  useEffect(() => {
    if (Platform.OS === 'ios') {
      isPlatformPaySupported().then((supported) => {
        setIsApplePayAvailable(supported);
        logger.info(`Apple Pay supported: ${supported}`);
      }).catch(() => setIsApplePayAvailable(false));
    }
  }, []);

  const handlePrimaryAction = async () => {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      // If no eventId provided (e.g., package purchase), skip booking API calls
      // and just collect payment details for the parent component to handle
      if (!eventId) {
        logger.info('No eventId provided - collecting payment details only');
        setIsProcessing(false);
        onBookEvent({
          promoCode: appliedPromoCode || (promoCode.trim() || null),
          amount: finalTotal,
          currency,
          subtotal: subtotalBeforeVAT,
          vatAmount: vat,
          discountAmount: promoDiscount,
        });
        return;
      }

      // Step 1: Create booking and get Stripe Payment Intent
      logger.info(`Creating booking for event: ${eventId}, guests: ${guestsCount}`);
      const bookingResponse = await paymentService.createBookingWithPayment(
        eventId,
        appliedPromoCode || (promoCode.trim() || null),
        Math.max(1, guestsCount),
        occurrenceStart ?? null,
        occurrenceEnd ?? null,
        deviceTimeZone,
        'card'
      );

      if (!bookingResponse.success) {
        throw new Error(bookingResponse.message || 'Failed to create booking');
      }

      const { data } = bookingResponse;

      if (data.publishableKey) {
        useAuthStore.getState().setStripePublishableKey(data.publishableKey);
        try {
          await initStripe({
            publishableKey: data.publishableKey,
            merchantIdentifier: 'merchant.com.rallysports',
          });
          logger.info('Stripe SDK re-initialized for card payment');
        } catch (initError) {
          logger.error('Failed to re-initialize Stripe SDK:', initError);
        }
      }

      // Check if it's a free event
      if (data.isFreeEvent || !data.paymentRequired) {
        logger.info('Free event - no payment required');
        setIsProcessing(false);
        onBookEvent({
          promoCode: appliedPromoCode || (promoCode.trim() || null),
          amount: 0,
          currency,
          bookingId: data.booking.bookingId,
        });
        return;
      }

      // Step 2: Confirm Payment via Stripe Direct Flow
      const selectedCard = savedCards.find((c) => c.cardId === selectedCardId);
      if (!selectedCard) {
        Alert.alert('Payment Required', 'Please select a payment method or add a new card.');
        setIsProcessing(false);
        return;
      }

      logger.info(`Confirming payment with card: ${selectedCard.cardId}`);
      const { error: confirmError } = await confirmPayment(data.paymentIntent.clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          paymentMethodId: selectedCard.stripePaymentMethodId,
        },
      });

      if (confirmError) {
        // User canceled or payment failed
        if (confirmError.code === 'Canceled') {
          logger.info('Payment canceled by user');
        } else {
          logger.error('Payment failed:', confirmError);
          Alert.alert('Payment Error', confirmError.message || 'Your payment could not be processed.');
        }
        setIsProcessing(false);
        return;
      }

      // Step 4: Verify payment on backend
      logger.info('Verifying payment on backend');
      const verifyResponse = await paymentService.verifyPayment(data.paymentIntent.id);

      if (!verifyResponse.success) {
        throw new Error(verifyResponse.message || 'Failed to verify payment');
      }

      logger.info('Payment verified successfully');
      setIsProcessing(false);

      // Call onBookEvent to handle final navigation
      onBookEvent({
        promoCode: appliedPromoCode || (promoCode.trim() || null),
        amount: data.payment.finalAmount,
        currency: data.payment.currency,
        paymentIntentId: data.paymentIntent.id,
        bookingId: data.booking.bookingId,
        subtotal: subtotalBeforeVAT,
        vatAmount: vat,
        discountAmount: promoDiscount,
      });
    } catch (error: any) {
      logger.error('Booking error:', error);

      let alertTitle = 'Booking Failed';
      let alertMessage = 'An unexpected error occurred. Please try again.';

      // Extract error from backend response if available (Axios)
      const backendError = error.response?.data?.error || error.message;

      if (backendError) {
        if (backendError.includes('past occurrence')) {
          alertTitle = 'Invalid Date';
          alertMessage = 'You cannot book an event that has already started.';
        } else if (backendError.includes('Already joined')) {
          alertTitle = 'Already Booked';
          alertMessage = 'You have already registered for this event.';
        } else if (backendError.includes('at least')) {
          alertTitle = 'Payment Amount Too Low';
          alertMessage = 'Stripe requires a minimum payment of 2.00 AED. Please check the event price or number of guests.';
        } else if (backendError.toLowerCase().includes('age') || backendError.toLowerCase().includes('old')) {
          alertTitle = 'Age Restriction';
          alertMessage = backendError;
        } else if (backendError.toLowerCase().includes('promo code')) {
          alertTitle = 'Promo Code Error';
          alertMessage = backendError;
        } else if (backendError.includes('occurrenceStart is required')) {
          alertTitle = 'Selection Required';
          alertMessage = 'Please select a date and time for this event.';
        } else {
          alertMessage = backendError;
        }
      }

      Alert.alert(alertTitle, alertMessage);
      setIsProcessing(false);
    }
  };

  const handleApplePayPress = async () => {
    if (isProcessing) {
      return;
    }

    if (!eventId) {
      Alert.alert('Error', 'Event ID is required for Apple Pay booking.');
      return;
    }

    setIsProcessing(true);

    let pendingBookingId: string | null = null;

    try {
      // Step 1: Create booking and get Stripe Payment Intent
      logger.info(`Creating booking for event: ${eventId}, guests: ${guestsCount} via Apple Pay`);
      const bookingResponse = await paymentService.createBookingWithPayment(
        eventId,
        appliedPromoCode || (promoCode.trim() || null),
        Math.max(1, guestsCount),
        occurrenceStart ?? null,
        occurrenceEnd ?? null,
        deviceTimeZone,
        'apple_pay'
      );

      if (!bookingResponse.success) {
        throw new Error(bookingResponse.message || 'Failed to create booking');
      }

      const { data } = bookingResponse;
      pendingBookingId = data.booking?.bookingId || null;

      // Update the global Stripe publishable key if provided by backend
      // NOTE: Do NOT call initStripe() here — the StripeProvider in App.tsx
      // handles initialization reactively. Calling initStripe() tears down the
      // native PKPaymentAuthorizationCoordinator, causing Apple Pay to instantly
      // auto-cancel with "failed to register payment listener endpoint".
      if (data.publishableKey) {
        useAuthStore.getState().setStripePublishableKey(data.publishableKey);
        logger.info('Stripe publishable key updated in store for Apple Pay');
      }

      // Check if it's a free event
      if (data.isFreeEvent || !data.paymentRequired) {
        logger.info('Free event - no payment required');
        setIsProcessing(false);
        onBookEvent({
          promoCode: appliedPromoCode || (promoCode.trim() || null),
          amount: 0,
          currency,
          bookingId: data.booking.bookingId,
        });
        return;
      }

      // Step 2: Present Apple Pay sheet and confirm payment in one call
      logger.info('Presenting Apple Pay and confirming payment...');
      const { error: applePayError } = await confirmPlatformPayPayment(
        data.paymentIntent.clientSecret,
        {
          applePay: {
            cartItems: [
              {
                label: `Event Booking (${guestsCount} ${guestsCount === 1 ? 'guest' : 'guests'})`,
                amount: String(data.payment.finalAmount),
                paymentType: PlatformPay.PaymentType.Immediate,
              },
            ],
            merchantCountryCode: 'AE',
            currencyCode: data.payment.currency || 'AED',
          },
        },
      );

      if (applePayError) {
        // Clean up the pending booking since payment won't complete
        try {
          logger.info(`Cleaning up pending booking ${data.booking.bookingId} after Apple Pay failure`);
          await bookingService.cancelBooking(data.booking.bookingId);
        } catch (cleanupErr) {
          logger.error('Failed to clean up pending booking:', cleanupErr);
        }

        if (applePayError.code === 'Canceled') {
          logger.info('Apple Pay cancelled by user');
        } else {
          logger.error('Apple Pay error:', applePayError);
          Alert.alert('Apple Pay Error', applePayError.message || 'Apple Pay payment could not be completed.');
        }
        setIsProcessing(false);
        return;
      }

      // Step 3: Verify payment on backend
      logger.info('Verifying Apple Pay payment on backend...');
      const verifyResponse = await paymentService.verifyPayment(data.paymentIntent.id);

      if (!verifyResponse.success) {
        throw new Error(verifyResponse.message || 'Failed to verify payment');
      }

      logger.info('Apple Pay payment verified successfully');
      setIsProcessing(false);

      onBookEvent({
        promoCode: appliedPromoCode || (promoCode.trim() || null),
        amount: data.payment.finalAmount,
        currency: data.payment.currency,
        paymentIntentId: data.paymentIntent.id,
        bookingId: data.booking.bookingId,
        subtotal: subtotalBeforeVAT,
        vatAmount: vat,
        discountAmount: promoDiscount,
      });
    } catch (error: any) {
      logger.error('Apple Pay booking error:', error);

      // Clean up pending booking if one was created before the error
      if (pendingBookingId) {
        try {
          logger.info(`Cleaning up pending booking ${pendingBookingId} after error`);
          await bookingService.cancelBooking(pendingBookingId);
        } catch (cleanupErr) {
          logger.error('Failed to clean up pending booking:', cleanupErr);
        }
      }

      let alertTitle = 'Booking Failed';
      let alertMessage = 'An unexpected error occurred. Please try again.';
      const backendError = error.response?.data?.error || error.message;

      if (backendError) {
        if (backendError.includes('past occurrence')) {
          alertTitle = 'Invalid Date';
          alertMessage = 'You cannot book an event that has already started.';
        } else if (backendError.includes('Already joined')) {
          alertTitle = 'Already Booked';
          alertMessage = 'You have already registered for this event.';
        } else {
          alertMessage = backendError;
        }
      }

      Alert.alert(alertTitle, alertMessage);
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
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: keyboardPadding > 0 ? keyboardPadding : undefined }]}
            keyboardShouldPersistTaps="handled"
          >
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

            {/* Payment Details Section */}
            <FlexView style={styles.section}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsPaymentDetailsExpanded(!isPaymentDetailsExpanded)}
              >
                <FlexView style={styles.paymentDetailsHeader}>
                  <TextDs style={[styles.sectionTitle, { marginBottom: 0 }]}>Payment Details</TextDs>
                  {isPaymentDetailsExpanded ? (
                    <ChevronUp size={20} color={colors.text.secondary} />
                  ) : (
                    <ChevronDown size={20} color={colors.text.secondary} />
                  )}
                </FlexView>
              </TouchableOpacity>

              <FlexView style={styles.paymentDetailsContent}>
                {isPaymentDetailsExpanded && (
                  <>
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
                            <ImageDs image="dhiramIcon" size={16} style={styles.priceIcon} />
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
                    {/* <FlexView style={styles.paymentRow}>
                      <TextDs style={styles.paymentLabel}>Platform Fee</TextDs>
                      {renderAmount(platformFee.toFixed(2), styles.paymentAmount)}
                    </FlexView> */}

                    {/* VAT */}
                    <FlexView style={styles.paymentRow}>
                      <TextDs style={styles.paymentLabel}>VAT</TextDs>
                      {renderAmount(vat.toFixed(2), styles.paymentAmount)}
                    </FlexView>

                    {/* Divider */}
                    <FlexView style={styles.paymentDivider} />
                  </>
                )}

                {/* Total */}
                <FlexView style={[styles.totalRow, !isPaymentDetailsExpanded && { marginTop: 0 }]}>
                  <TextDs style={styles.totalLabel}>Total ({guestsCount})</TextDs>
                  {currency === 'AED' ? (
                    <FlexView width={60} flexDirection="row" alignItems="center" gap={spacing.xs}>
                      <ImageDs image="dhiramIcon" size={16} style={styles.priceIcon} />
                      <TextDs style={styles.totalPrice}>{finalTotal.toFixed(2)}</TextDs>
                    </FlexView>
                  ) : (
                    <TextDs style={styles.totalPrice}>{currency} {finalTotal.toFixed(2)}</TextDs>
                  )}
                </FlexView>
              </FlexView>
            </FlexView>

            {/* Saved Cards Section */}
            <FlexView style={styles.section}>
              <FlexView style={styles.paymentDetailsHeader}>
                <TextDs style={styles.sectionTitle}>Saved Cards</TextDs>
                <TouchableOpacity onPress={() => setIsAddCardModalVisible(true)} activeOpacity={0.7}>
                  <TextDs style={styles.addCardText}>+ Add New</TextDs>
                </TouchableOpacity>
              </FlexView>

              {isLoadingCards ? (
                <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.md }} />
              ) : savedCards.length > 0 ? (
                savedCards.map((card) => (
                  <Pressable
                    key={card.cardId}
                    style={[
                      styles.cardItem,
                      selectedCardId === card.cardId && styles.selectedCardItem,
                    ]}
                    onPress={() => setSelectedCardId(card.cardId)}
                  >
                    <FlexView flexDirection="row" alignItems="center" gap={spacing.sm} flex={1}>
                      <TextDs style={styles.cardBrand}>{card.brand}</TextDs>
                      <TextDs style={styles.cardLast4}>•••• {card.last4}</TextDs>
                    </FlexView>
                    <FlexView
                      style={[
                        styles.radioButton,
                        selectedCardId === card.cardId && styles.radioButtonSelected,
                      ]}
                    />
                  </Pressable>
                ))
              ) : (
                <TextDs style={styles.noCardsText}>No cards saved yet.</TextDs>
              )}
            </FlexView>

            {/* Disclaimer */}
            <TextDs style={styles.disclaimer}>
              By joining the session, you agree that you fit all the requirements of this event.
            </TextDs>

            {/* Apple Pay stays at the bottom of the scroll or below */}
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={[styles.applePayButton, isProcessing && { opacity: 0.6 }]}
                onPress={handleApplePayPress}
                activeOpacity={0.8}
                disabled={isProcessing}
              >
                <TextDs style={styles.applePayButtonText}>
                  {isProcessing ? 'Processing Payment...' : ' Pay with Apple Pay'}
                </TextDs>
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

      <AddCardModal
        visible={isAddCardModalVisible}
        onClose={() => setIsAddCardModalVisible(false)}
        onAddCard={handleAddCard}
      />
    </Modal>
  );
};
