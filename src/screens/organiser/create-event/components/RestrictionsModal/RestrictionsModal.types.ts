export interface RestrictionsData {
  gender: string;
  sportsLevel: string;
  ageRange: {
    min: number;
    max: number;
  };
  levelRestriction?: string;
}

export interface RestrictionsModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (restrictions: RestrictionsData) => void;
  initialGender?: string;
  initialSportsLevel?: string;
  initialAgeRange?: { min: number; max: number };
  initialLevelRestriction?: string;
}

