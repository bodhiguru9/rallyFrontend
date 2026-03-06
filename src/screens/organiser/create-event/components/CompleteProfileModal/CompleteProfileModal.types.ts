export interface CompleteProfileData {
  bankName: string;
  iban: string;
  accountHolderName: string;
  emiratesIdFront: string | null;
  emiratesIdBack: string | null;
}

export interface CompleteProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CompleteProfileData) => void;
  initialData?: Partial<CompleteProfileData>;
}

