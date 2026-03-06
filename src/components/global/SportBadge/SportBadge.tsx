import React from 'react';
import { TextDs, FlexView } from '@components';
import { type LucideIcon, Activity } from 'lucide-react-native';
import type { SportBadgeProps } from './SportBadge.types';
import { styles } from './style/SportBadge.styles';

const SPORT_ICON_MAP: Record<string, LucideIcon> = {
  activity: Activity,
};

export const SportBadge: React.FC<SportBadgeProps> = ({
  sport,
  icon,
}) => {
  const IconComponent = icon ? SPORT_ICON_MAP[icon] ?? Activity : null;
  return (
    <FlexView style={styles.container}>
      {IconComponent && (
        <FlexView style={styles.icon}>
          <IconComponent size={14} color="#FF8C42" />
        </FlexView>
      )}
      <TextDs style={styles.text}>{sport}</TextDs>
    </FlexView>
  );
};

