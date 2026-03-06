export interface ProfileEventCardProps {
  id: string;
  title: string;
  image: string;
  categories: Array<{
    label: string;
    icon: string;
    color: string;
  }>;
  date: string;
  time: string;
  location: string;
  participants: Array<{
    id: string;
    avatar?: string;
  }>;
  spotsAvailable?: number;
  views: number;
  onPress: (id: string) => void;
  onShare?: (id: string) => void;
}

