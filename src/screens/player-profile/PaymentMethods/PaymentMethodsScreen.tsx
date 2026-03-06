import React, { useState, useEffect } from 'react';
import { TextDs,  FlexView } from '@components';
import { ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '@theme';
import type { RootStackParamList } from '@navigation';
import type { PaymentCard } from './PaymentMethodsScreen.types';
import { styles } from './style/PaymentMethodsScreen.styles';
import { CardItem } from './components/CardItem';
import { AddCardModal } from './components/AddCardModal';
import { cardService } from '@services';
import { parseApiError } from '@utils/error-handler';

type PaymentMethodsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PaymentMethods'
>;

export const PaymentMethodsScreen: React.FC = () => {
  const navigation = useNavigation<PaymentMethodsScreenNavigationProp>();
  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingCard, setIsAddingCard] = useState(false);

  // Fetch cards on mount
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setIsLoading(true);
      const fetchedCards = await cardService.getCards();
      // Map API response to PaymentCard format
      const mappedCards: PaymentCard[] = fetchedCards.map((card) => ({
        id: card.id,
        cardHolderName: card.cardHolderName,
        last4: card.last4,
        expiryMonth: card.expiryMonth,
        expiryYear: card.expiryYear,
        brand: card.brand,
        isDefault: card.isDefault,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
      }));
      setCards(mappedCards);
    } catch (error) {
      const parsedError = parseApiError(error, 'Failed to load cards');
      console.error('Error fetching cards:', parsedError);
      // TODO: Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    navigation.goBack();
  };

  const handleAddCard = () => {
    setShowAddCardModal(true);
  };

  const handleCloseAddCardModal = () => {
    setShowAddCardModal(false);
  };

  const handleAddCardSubmit = async (cardData: {
    cardNumber: string;
    cardHolderName: string;
    isDefault: boolean;
    expiry: string;
  }) => {
    try {
      setIsAddingCard(true);
      const newCard = await cardService.addCard(cardData);
      
      // Map API response to PaymentCard format
      const mappedCard: PaymentCard = {
        id: newCard.id,
        cardHolderName: newCard.cardHolderName,
        last4: newCard.last4,
        expiryMonth: newCard.expiryMonth,
        expiryYear: newCard.expiryYear,
        brand: newCard.brand,
        isDefault: newCard.isDefault,
        createdAt: newCard.createdAt,
        updatedAt: newCard.updatedAt,
      };
      
      setCards((prevCards) => [...prevCards, mappedCard]);
      setShowAddCardModal(false);
    } catch (error) {
      const parsedError = parseApiError(error, 'Failed to add card');
      console.error('Error adding card:', parsedError);
      // TODO: Show error message to user
    } finally {
      setIsAddingCard(false);
    }
  };

  const handleRemoveCard = (cardId: string) => {
    // TODO: Show confirmation dialog
    setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
  };

  const formatCardNumber = (last4: string): string => {
    return `XXXX XXXX XXXX ${last4}`;
  };

  const formatExpiryDate = (month: number, year: number): string => {
    if (month === undefined || month === null || year === undefined || year === null) {
      return 'MM/YY';
    }
    const formattedMonth = String(month).padStart(2, '0');
    const formattedYear = String(year).slice(-2);
    return `${formattedMonth}/${formattedYear}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <FlexView style={styles.header}>
        <FlexView style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <TextDs style={styles.headerTitle}>Payment Methods</TextDs>
        </FlexView>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <TextDs style={styles.saveButtonText}>Save</TextDs>
        </TouchableOpacity>
      </FlexView>

      {/* Drag Handle */}
      <FlexView style={styles.dragHandle} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Added Cards Section */}
        <FlexView style={styles.section}>
          <TextDs style={styles.sectionTitle}>Added Cards</TextDs>

          {/* Loading State */}
          {isLoading ? (
            <FlexView style={styles.emptyState}>
              <ActivityIndicator size="large" color={colors.primary} />
            </FlexView>
          ) : (
            <>
              {/* Card List */}
              {cards.length > 0 ? (
                <FlexView style={styles.cardsContainer}>
                  {cards.map((card) => (
                    <CardItem
                      key={card.id}
                      cardNumber={formatCardNumber(card.last4)}
                      expiryDate={formatExpiryDate(card.expiryMonth, card.expiryYear)}
                      onRemove={() => handleRemoveCard(card.id)}
                    />
                  ))}
                </FlexView>
              ) : (
                <FlexView style={styles.emptyState}>
                  <TextDs style={styles.emptyStateText}>No cards added yet</TextDs>
                </FlexView>
              )}

              {/* Add Card Button */}
              <TouchableOpacity
                style={styles.addCardButton}
                onPress={handleAddCard}
                activeOpacity={0.7}
                disabled={isAddingCard}
              >
                <Plus size={20} color={colors.primary} />
                <TextDs style={styles.addCardText}>Add Card</TextDs>
              </TouchableOpacity>
            </>
          )}
        </FlexView>
      </ScrollView>

      {/* Add Card Modal */}
      <AddCardModal
        visible={showAddCardModal}
        onClose={handleCloseAddCardModal}
        onAddCard={handleAddCardSubmit}
      />
    </SafeAreaView>
  );
};

