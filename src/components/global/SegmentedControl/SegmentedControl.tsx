import React from 'react';
import { TextDs, FlexView } from '@components';
import { TouchableOpacity } from 'react-native';
import type { SegmentedControlProps } from './SegmentedControl.types';
import { styles } from './style/SegmentedControl.styles';

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  tabs,
  activeTab,
  onTabChange,
  containerStyle,
}) => {
  return (
    <FlexView style={[styles.container, containerStyle]}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.tab,
            activeTab === index && styles.tabActive,
          ]}
          onPress={() => onTabChange(index)}
          activeOpacity={0.7}
        >
          <TextDs
            size={14}
            weight="medium"
            color={activeTab === index ? 'white' : 'secondary'}
          >
            {tab}
          </TextDs>
        </TouchableOpacity>
      ))}
    </FlexView>
  );
};

