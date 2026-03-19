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
import { ArrowRight, ChevronUp, ChevronDown, X, Check, Plus } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '@theme';
import type { IBookingModalProps } from './BookingModal.types';
import { styles } from './style/BookingModal.styles';
import { useStripe } from '@stripe/stripe-react-native';
import { paymentService, cardService } from '@services';
import { logger } from '@dev-tools/logger';
import type { CardResponse } from '../../../types/api/card.types';
import { AddCardModal } from '../../player-profile/PaymentMethods/components/AddCardModal';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentDetailsExpanded, setIsPaymentDetailsExpanded] = useState(false);
  const [keyboardPadding, setKeyboardPadding] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Saved cards state
  const [savedCards, setSavedCards] = useState<CardResponse[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  const { confirmPayment } = useStripe();

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

  // Fetch saved cards when modal becomes visible
  useEffect(() => {
    if (visible) {
      fetchSavedCards();
    }
  }, [visible]);

  const fetchSavedCards = async () => {
    try {
      setIsLoadingCards(true);
      const cards = await cardService.getCards();
      setSavedCards(cards);
      // Auto-select the default card or first card
      const defaultCard = cards.find(c => c.isDefault) || cards[0];
      if (defaultCard) {
        setSelectedCardId(defaultCard.cardId);
      }
    } catch (error) {
      logger.error('Failed to fetch cards:', error);
    } finally {
      setIsLoadingCards(false);
    }
  };

  const handleAddCardSubmit = async (cardData: {
    paymentMethodId: string;
    cardHolderName: string;
    isDefault: boolean;
  }) => {
    try {
      const newCard = await cardService.addCard(cardData);
      setSavedCards(prev => [...prev, newCard]);
      setSelectedCardId(newCard.cardId);
      setShowAddCardModal(false);
    } catch (error) {
      logger.error('Failed to add card:', error);
      Alert.alert('Error', 'Failed to add card. Please try again.');
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
  const subtotalBeforeVAT = reservationCharge - promoDiscount + platformFee;
  const vat = Math.round(subtotalBeforeVAT * vatRate * 100) / 100; // Calculate VAT
  const finalTotal = subtotalBeforeVAT + vat;

  const formatCardExpiry = (month: number, year: number): string => {
    const m = String(month).padStart(2, '0');
    const y = String(year).slice(-2);
    return `${m}/${y}`;
  };

  const handlePrimaryAction = async () => {
    if (isProcessing) {
      return;
    }

    // Validate selected card
    const selectedCard = savedCards.find(c => c.cardId === selectedCardId);
    if (!selectedCard) {
      Alert.alert('No Card Selected', 'Please select a payment card or add a new one.');
      return;
    }

    // Saved cards must include Stripe payment method id so Stripe can charge them.
    if (!selectedCard.stripePaymentMethodId) {
      Alert.alert(
        'Card Setup Required',
        'This saved card is missing Stripe payment details. Please add the card again and retry payment.',
      );
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
          cardLast4: selectedCard.last4,
          expiryMonth: selectedCard.expMonth,
          expiryYear: selectedCard.expYear,
          amount: finalTotal,
          currency,
        });
        return;
      }

      // Step 1: Create booking and get Stripe Payment Intent
      logger.info(`Creating booking for event: ${eventId}, guests: ${guestsCount}`);
      console.log('DEBUG: createBookingWithPayment called with:', { eventId, guestsCount });
      const bookingResponse = await paymentService.createBookingWithPayment(
        eventId,
        appliedPromoCode || (promoCode.trim() || null),
        Math.max(1, guestsCount),
      );
      console.log('DEBUG: bookingResponse:', JSON.stringify(bookingResponse, null, 2));

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
          paymentMethodId: selectedCard.stripePaymentMethodId,
          billingDetails: {
            name: selectedCard.cardHolderName || data.user.fullName,
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
      onBookEvent({
        promoCode: appliedPromoCode || (promoCode.trim() || null),
        cardLast4: selectedCard.last4,
        expiryMonth: selectedCard.expMonth,
        expiryYear: selectedCard.expYear,
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

            {/* Credit/Debit Card Section */}
            <FlexView style={styles.section}>
              <TextDs style={styles.sectionTitle}>Credit/Debit Card</TextDs>
              {isLoadingCards ? (
                <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: spacing.md }} />
              ) : savedCards.length > 0 ? (
                savedCards.map((card) => (
                  <TouchableOpacity
                    key={card.cardId}
                    activeOpacity={0.7}
                    onPress={() => setSelectedCardId(card.cardId)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: spacing.sm,
                      gap: spacing.sm,
                    }}
                  >
                    {/* Checkbox */}
                    <FlexView
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 4,
                        borderWidth: 2,
                        borderColor: selectedCardId === card.cardId ? colors.primary : colors.border.medium,
                        backgroundColor: selectedCardId === card.cardId ? colors.primary : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {selectedCardId === card.cardId && (
                        <Check size={14} color={colors.text.white} />
                      )}
                    </FlexView>
                    {/* Card Info */}
                    <FlexView style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <TextDs style={{ color: colors.text.primary, fontSize: 14 }}>
                        {card.last4 ? `${card.last4.slice(0,2)}** **** **** **${card.last4.slice(-2)}` : '•••• •••• •••• ••••'}
                      </TextDs>
                      <TextDs style={{ color: colors.text.secondary, fontSize: 13 }}>
                        {formatCardExpiry(card.expMonth, card.expYear)}
                      </TextDs>
                    </FlexView>
                  </TouchableOpacity>
                ))
              ) : (
                <TextDs style={{ color: colors.text.tertiary, fontSize: 13, marginVertical: spacing.sm }}>No saved cards</TextDs>
              )}

              {/* Add New Card Button */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowAddCardModal(true)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.xs,
                  marginTop: spacing.sm,
                  backgroundColor: colors.primary,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  borderRadius: borderRadius.full,
                  alignSelf: 'flex-start',
                }}
              >
                <Plus size={16} color={colors.text.white} />
                <TextDs style={{ color: colors.text.white, fontSize: 13, fontWeight: '600' }}>Add New Card</TextDs>
              </TouchableOpacity>
            </FlexView>

            {/* Disclaimer */}
            <TextDs style={styles.disclaimer}>
              By joining the session, you agree that you fit all the requirements of this event.
            </TextDs>

            {/* Apple Pay stays at the bottom of the scroll or below */}
            {onApplePay && Platform.OS === 'ios' && (
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

      {/* Add Card Modal */}
      <AddCardModal
        visible={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        onAddCard={handleAddCardSubmit}
      />
    </Modal>
  );
};
