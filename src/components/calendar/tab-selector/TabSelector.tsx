import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, Animated, Easing, Platform } from 'react-native';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { borderRadius, colors, spacing } from '@theme';
import type { CalendarTab } from '../calendar.types';
import { styles, TAB_WIDTH_PX } from './TabSelector.styles';

export interface CalendarTabOption {
  value: CalendarTab;
  label: string;
}

interface TabSelectorProps {
  title?: string;
  tabs: CalendarTabOption[];
  activeTab: CalendarTab;
  onTabChange: (tab: CalendarTab) => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({
  title = 'Your Calendar',
  tabs,
  activeTab,
  onTabChange,
}) => {
  const activeIndex = useMemo(
    () => Math.max(0, tabs.findIndex((t) => t.value === activeTab)),
    [tabs, activeTab],
  );
  const [leftPosition] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(leftPosition, {
      toValue: activeIndex * TAB_WIDTH_PX,
      duration: 250,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [activeIndex, leftPosition]);

  return (
    <FlexView
      px={spacing.base}
      width={'100%'}
      justifyContent="space-between"
      flexDirection="row"
      alignItems="center"
    >
      <TextDs size={14} weight="regular">
        {title}
      </TextDs>
      <FlexView
        flexDirection="row"
        marginTop={spacing.base}
        marginBottom={spacing.base}
        position="relative"
        borderWidth={1}
        borderColor={colors.border.white}
        borderRadius={borderRadius.full}
        backgroundColor={colors.background.white}
        overflow="hidden"
      >
        <Animated.View
          style={{
            width: TAB_WIDTH_PX,
            height: '100%',
            borderRadius: borderRadius.full,
            position: 'absolute',
            top: 0,
            left: leftPosition,
            backgroundColor: colors.primaryDark,
          }}
        />
        {tabs.map((tab, index) => (
          <Pressable
            key={tab.value}
            style={({ pressed }) => [
              styles.tab,
              Platform.OS === 'android' && pressed && { opacity: 0.7 },
            ]}
            onPress={() => onTabChange(tab.value)}
            android_ripple={{ color: colors.primary, borderless: false }}
          >
            <FlexView
              width={'100%'}
              height={'100%'}
              alignItems="center"
              justifyContent="center"
            >
              <TextDs
                size={14}
                weight="regular"
                color={activeIndex === index ? 'white' : 'secondary'}
              >
                {tab.label}
              </TextDs>
            </FlexView>
          </Pressable>
        ))}
      </FlexView>
    </FlexView>
  );
};

