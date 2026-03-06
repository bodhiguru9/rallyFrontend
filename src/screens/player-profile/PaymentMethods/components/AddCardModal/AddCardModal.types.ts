export interface AddCardModalProps {
  visible: boolean;
  onClose: () => void;
  onAddCard: (cardData: {
    cardNumber: string;
    cardHolderName: string;
    isDefault: boolean;
    expiry: string; // Format: MM/YY
  }) => void;
}

