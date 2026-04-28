// Export all components here
export { TextDs } from '@designSystem/atoms/TextDs';
export { FlexView } from '@designSystem/atoms/FlexView';
export type { FlexViewProps } from '@designSystem/atoms/FlexView';

// Global components (used across multiple screens)
export { Button } from '@designSystem/atoms/button';
export { ImageDs } from '@designSystem/atoms/image';
export type { ImageDsProps, ImageDsImageName, ImageFit } from '@designSystem/atoms/image';
export { FormInput } from './global/FormInput';
export { WhatsAppInput } from './global/WhatsAppInput';
export { TextArea } from './global/text-area';
export { MultiSelectInput } from './global/multi-select-input';
export { LoadingOverlay } from './global/loading-overlay';
export type { LoadingOverlayProps } from './global/loading-overlay';
export { LoadingScreen } from './global/loading-screen';
export { LoadingIndicator } from './global/LoadingIndicator';
export { Seperator } from './global/Seperator';
export type { SeperatorProps } from './global/Seperator';
export { EventCard } from './global/EventCard';
export type { EventCardProps } from './global/EventCard';
export { FilterDropdown } from './global/filter-dropdown';
export type { FilterDropdownProps, FilterDropdownOption } from './global/filter-dropdown';
export { Carousel, CarouselItem } from './global/Carousel';
export type {
  CarouselProps,
  CarouselRenderItemInfo,
  CarouselAnimatedIndex,
  CarouselItemProps,
} from './global/Carousel';

// Layout components
export { Header } from './global/layout';
export type { HeaderProps } from './global/layout';

// Private components - Home screen
export { FeaturedEventCard } from './private/home/FeaturedEventCard';
export { FilterChip } from './private/home/FilterChip';
export { DateFilter } from './private/home/DateFilter';
export { OrganiserCard } from './private/home/OrganiserCard';
export { UserProfileModal } from './private/home/user-profile-modal';
export type { UserProfileModalProps } from './private/home/user-profile-modal';

// Private components - SignUp screen
export { UserTypeSelector } from './private/sign-up/UserTypeSelector';
export type { UserType } from './private/sign-up/UserTypeSelector';
export { SocialLoginButtons } from './private/sign-up/SocialLoginButtons';

// Private components - ProfileSetup screen
export { AvatarUpload } from './private/sign-up/profile-setup/AvatarUpload';
export { SelectInput } from './private/sign-up/profile-setup/SelectInput';
export { DateInput } from './private/sign-up/profile-setup/DateInput';
export { Calendar } from './private/sign-up/profile-setup/Calendar';
export { Avatar } from './global/avatar';
export type { AvatarProps, AvatarSizeKey } from './global/avatar';

// Private components - VerifyOTP screen
export { OTPInput } from './private/verify-otp/OTPInput';

export { BottomSheetModal } from './global/bottom-sheet-modal';
