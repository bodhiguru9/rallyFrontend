export interface AddCardModalProps {
  visible: boolean;
  onClose: () => void;
  onAddCard: (cardData: {
    paymentMethodId: string;
    cardHolderName: string;
    isDefault: boolean;
  }) => void | Promise<void>;
}

