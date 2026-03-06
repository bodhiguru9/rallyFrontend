import React from 'react';
import { TextDs,  FlexView } from '@components';
import type { ProfileSectionProps } from './ProfileSection.types';
import { styles } from './style/ProfileSection.styles';

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  children,
}) => {
  return (
    <FlexView style={styles.container}>
      <TextDs style={styles.title}>{title}</TextDs>
      <FlexView style={styles.content}>{children}</FlexView>
    </FlexView>
  );
};

