export interface OrganiserCardProps {
  id: string;
  name: string;
  avatar: string;
  isVerified?: boolean;
  onPress: (id: string) => void;
}
