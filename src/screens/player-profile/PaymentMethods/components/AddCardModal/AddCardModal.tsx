import React, { useState, useEffect } from 'react';
import { TextDs, FlexView } from '@components';
import { Modal, TouchableOpacity, Animated, Platform, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import { FormInput, Checkbox } from '@components/global';
import { CardField, useStripe, initStripe } from '@stripe/stripe-react-native';
import type { AddCardModalProps } from './AddCardModal.types';
import { styles } from './style/AddCardModal.styles';
import { colors } from '@theme';
import { useAuthStore } from '@store';
import { paymentService } from '@services';
import { logger } from '@dev-tools/logger';

export const AddCardModal: React.FC<AddCardModalProps> = ({
  visible,
  onClose,
  onAddCard,
}) => {
  const [cardHolderName, setCardHolderName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));
  const { createPaymentMethod } = useStripe();

  /**
   * Ensures the Stripe SDK is initialized with a valid publishable key.
   * This guards against race conditions where initStripe() from another screen
   * hasn't completed, or competing initStripe() calls left the SDK without a key.
   */
  const ensureStripeInitialized = async (): Promise<boolean> => {
    // 1. Try key from Zustand store (set by prior backend responses)
    let key = useAuthStore.getState().stripePublishableKey;

    // 2. If not in store, fetch from backend (GET /api/cards returns publishableKey)
    if (!key) {
      logger.info('AddCardModal: No Stripe key in store, fetching from backend...');
      try {
        const response = await paymentService.getSavedCards();
        if (response.publishableKey) {
          key = response.publishableKey;
          useAuthStore.getState().setStripePublishableKey(key);
        }
      } catch (err) {
        logger.error('AddCardModal: Failed to fetch publishable key from backend:', err);
      }
    }

    if (!key) {
      logger.error('AddCardModal: No Stripe publishable key available from any source');
      return false;
    }

    // 3. Re-initialize the SDK to ensure it has the correct key
    try {
      await initStripe({
        publishableKey: key,
        merchantIdentifier: 'merchant.com.rally.app',
      });
      logger.info('AddCardModal: Stripe SDK initialized successfully');
      return true;
    } catch (err) {
      logger.error('AddCardModal: Failed to initialize Stripe SDK:', err);
      return false;
    }
  };

  // Handle animation
  useEffect(() => {
    if (visible) {
      // Pre-initialize Stripe when modal opens (fire-and-forget)
      ensureStripeInitialized();

      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleClose = () => {
    // Reset form when modal closes
    setCardHolderName('');
    setIsDefault(false);
    setIsCardComplete(false);
    setIsSubmitting(false);
    onClose();
  };

  const handleAddCard = async () => {
    if (isSubmitting) {
      return;
    }

    if (!cardHolderName.trim()) {
      Alert.alert('Missing Details', 'Please enter the card holder name.');
      return;
    }
    if (!isCardComplete) {
      Alert.alert('Incomplete Card', 'Please complete card number, expiry date, and CVC.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Pre-flight: ensure Stripe SDK has a valid key before calling createPaymentMethod
      const stripeReady = await ensureStripeInitialized();
      if (!stripeReady) {
        Alert.alert(
          'Payment Setup Error',
          'Could not initialize the payment system. Please close this screen and try again.',
        );
        setIsSubmitting(false);
        return;
      }

      const { paymentMethod, error } = await createPaymentMethod({
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            name: cardHolderName.trim(),
          },
        },
      });

      if (error || !paymentMethod?.id) {
        const message = error?.message || 'Could not create payment method. Please try again.';
        const normalized = message.toLowerCase();
        if (normalized.includes('api key') || normalized.includes('invalid')) {
          Alert.alert(
            'Card Error',
            'Payment system configuration issue. Please restart the app and try again.',
          );
        } else {
          logger.error('createPaymentMethod error:', error);
          Alert.alert('Card Error', message);
        }
        setIsSubmitting(false);
        return;
      }

      await onAddCard({
        paymentMethodId: paymentMethod.id,
        cardHolderName: cardHolderName.trim(),
        isDefault,
      });

      setCardHolderName('');
      setIsDefault(false);
      setIsCardComplete(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    cardHolderName.trim().length > 0 &&
    isCardComplete;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [{ translateY }],
              },
            ]}
          >
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              {/* Drag Handle */}
              <FlexView style={styles.dragHandle} />

              {/* Header */}
              <FlexView style={styles.header}>
                <TextDs style={styles.title}>Add Card</TextDs>
              </FlexView>

              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
              >
                {/* Card Holder Name */}
                <FormInput
                  label="Card Holder Name"
                  placeholder="Enter card holder name"
                  value={cardHolderName}
                  onChangeText={setCardHolderName}
                  autoCapitalize="words"
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.cardHolderInputContainer}
                />

                <TextDs style={styles.cardFieldLabel}>Card Details</TextDs>
                <CardField
                  postalCodeEnabled={false}
                  placeholders={{
                    number: '4242 4242 4242 4242',
                  }}
                  cardStyle={{
                    backgroundColor: colors.background.secondary,
                    textColor: '#000000',
                    placeholderColor: '#6B6B6B',
                    borderWidth: 1,
                    borderColor: '#D7D7D7',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  style={styles.cardField}
                  onCardChange={(cardDetails) => {
                    setIsCardComplete(!!cardDetails.complete);
                  }}
                />

                {/* Set as Default Card */}
                <Checkbox
                  label="Set as default card"
                  value={isDefault}
                  onValueChange={setIsDefault}
                  containerStyle={styles.inputContainer}
                />
              </ScrollView>

              {/* Add Card Button */}
              <TouchableOpacity
                style={[styles.addButton, isFormValid && styles.addButtonActive]}
                onPress={handleAddCard}
                activeOpacity={0.8}
                disabled={!isFormValid || isSubmitting}
              >
                <TextDs
                  style={[
                    styles.addButtonText,
                    (!isFormValid || isSubmitting) && styles.addButtonTextDisabled,
                  ]}
                >
                  {isSubmitting ? 'Saving Card...' : 'Add Card'}
                </TextDs>
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};

