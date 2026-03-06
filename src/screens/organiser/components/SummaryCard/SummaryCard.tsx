import React from 'react';
import type { SummaryCardProps } from './SummaryCard.types';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@components';
import { colors } from '@theme';

export const SummaryCard: React.FC<SummaryCardProps> = ({ value, label }) => {
  return (
    <FlexView flex={1} backgroundColor={"#FFFDEF80"} borderWhite borderRadius={22} paddingVertical={10}>
      <FlexView alignItems='center' justifyContent='center' gap={4}>
        <FlexView flexDirection='row' alignItems='center' gap={2.5}>
          <TextDs size={18} weight="semibold" color="blueGray">{value}</TextDs>
        </FlexView>
        <TextDs size={12} weight="regular" color='blueGray' align='center'>{label}</TextDs>
      </FlexView>
    </FlexView>
  );
};

