import React, { useState, useEffect } from 'react';
import { Pressable, Animated, Easing, Platform } from 'react-native';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { borderRadius, colors, spacing } from '@theme';
import type { CalendarTab } from '../../CalendarScreen.types';
import { styles } from './TabSelector.styles';

interface TabSelectorProps {
  activeTab: CalendarTab;
  onTabChange: (tab: CalendarTab) => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({
  activeTab: _activeTab,
  onTabChange: _onTabChange,
}) => {
  const [active, setActive] = useState(0);
  const [leftPosition] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(leftPosition, {
      toValue: active === 0 ? 0 : 100,
      duration: 250,
      easing: Easing.linear,
      useNativeDriver: false, // Required for layout properties like 'left'
    }).start();
  }, [active, leftPosition]);

  return (
    <FlexView
      px={spacing.base}
      width={'100%'}
      justifyContent="space-between"
      flexDirection="row"
      alignItems="center"
    >
      <TextDs size={14} weight="regular">Your Calendar</TextDs>
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
            width: 100,
            height: '100%',
            borderRadius: borderRadius.full,
            position: 'absolute',
            top: 0,
            left: leftPosition,
            backgroundColor: colors.primaryDark,
          }}
        />
        <Pressable
          style={({ pressed }) => [
            styles.tab,
            Platform.OS === 'android' && pressed && { opacity: 0.7 },
          ]}
          onPress={() => setActive(0)}
          android_ripple={{ color: colors.primary, borderless: false }}
        >
          <FlexView width={'100%'} height={'100%'} alignItems="center" justifyContent="center">
            <TextDs size={14} weight="regular" color={active === 0 ? 'white' : 'secondary'}>
              Upcoming
            </TextDs>
          </FlexView>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.tab,
            Platform.OS === 'android' && pressed && { opacity: 0.7 },
          ]}
          onPress={() => setActive(1)}
          android_ripple={{ color: colors.primary, borderless: false }}
        >
          <FlexView width={'100%'} height={'100%'} alignItems="center" justifyContent="center">
            <TextDs size={14} weight="regular" color={active === 1 ? 'white' : 'secondary'}>
              Past
            </TextDs>
          </FlexView>
        </Pressable>
      </FlexView>
    </FlexView>
  );
};
