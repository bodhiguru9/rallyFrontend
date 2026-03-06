export interface ProfileMenuItemProps {
  icon?: string;
  iconImage?: any; // Image source for custom icons
  iconColor?: string;
  title: string;
  onPress: () => void;
  showArrow?: boolean;
  isLast?: boolean;
}

