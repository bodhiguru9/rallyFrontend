import { EventData } from '@app-types';
import type { CarouselAnimatedIndex } from '@components/global/Carousel';

export interface FeaturedEventCardProps {
  id: string;
  onPress: (id: string) => void;
  onBookmark?: (id: string) => void;
  event: EventData;
  width: number;
  index: number;
  animatedIndex: CarouselAnimatedIndex;
  isActive?: boolean;
}
