import React, { useMemo } from 'react';
import { TextDs, FlexView } from '@components';
import type { ProgressBarProps } from './ProgressBar.types';
import { styles } from './style/ProgressBar.styles';

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  containerStyle,
  barStyle,
  showLabel = false,
  labelStyle,
}) => {
  const percentage = useMemo(() => {
    if (total === 0) { return 0; }
    return Math.min((current / total) * 100, 100);
  }, [current, total]);

  return (
    <FlexView style={[styles.container, containerStyle]}>
      {showLabel && (
        <TextDs style={[styles.label, labelStyle]}>
          {current}/{total}
        </TextDs>
      )}
      <FlexView style={styles.track}>
        <FlexView
          style={[
            styles.bar,
            { width: `${percentage}%` },
            barStyle,
          ]}
        />
      </FlexView>
    </FlexView>
  );
};

