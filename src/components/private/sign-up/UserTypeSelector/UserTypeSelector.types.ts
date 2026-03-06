export type UserType = 'player' | 'organiser';

export interface UserTypeSelectorProps {
  selectedType: UserType;
  onSelectType: (type: UserType) => void;
}
