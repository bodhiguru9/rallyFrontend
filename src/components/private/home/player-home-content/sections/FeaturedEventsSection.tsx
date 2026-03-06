import React, { useEffect, useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { Carousel, FeaturedEventCard, TextDs } from '@components';
import { styles } from '../style/PlayerHomeContent.styles';
import { EventData } from '@app-types';
import { FlexView } from '@designSystem/atoms/FlexView';
import { spacing } from '@theme';
import { logger } from '@dev-tools';

interface FeaturedEventsSectionProps {
  events: EventData[];
  onEventPress: (id: string) => void;
  onBookmark: (id: string) => void;
}

export const FeaturedEventsSection: React.FC<FeaturedEventsSectionProps> = ({
  events,
  onEventPress,
  onBookmark,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  // Compute the initial active index based on events
  const initialActiveIndex = useMemo(() => {
    const index = events.length > 0 ? Math.floor(events.length / 2) : 0
    logger.debug('Computed initial active index', { value: index, eventsLength: events.length })
    return index
  }, [events.length])
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex)
  const cardWidth = 250
  const overlapOffset = 20
  const sidePadding = Math.max(0, (screenWidth - cardWidth) / 2)

  useEffect(() => {
    setActiveIndex(initialActiveIndex)
  }, [initialActiveIndex])

  return (
    <FlexView mb={10}>
      <FlexView px={spacing.base}>
        <TextDs size={16} weight='semibold'>Featured Events</TextDs>
      </FlexView>

      <Carousel
        data={events}
        itemWidth={cardWidth}
        itemSpacing={-overlapOffset}
        initialIndex={initialActiveIndex}
        onIndexChange={setActiveIndex}
        contentContainerStyle={[
          styles.horizontalScroll,
          { paddingHorizontal: sidePadding },
        ]}
        renderItem={({ item, index, animatedIndex }) => (
          <FlexView style={index === 0 ? undefined : { marginLeft: -overlapOffset }}>
            <FeaturedEventCard
              id={item.eventId}
              onPress={onEventPress}
              onBookmark={onBookmark}
              event={item}
              width={cardWidth}
              index={index}
              animatedIndex={animatedIndex}
              isActive={index === activeIndex}
            />
          </FlexView>
        )}
      />
    </FlexView>
  )
};
