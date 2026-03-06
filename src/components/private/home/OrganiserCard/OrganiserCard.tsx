import React from 'react';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { TouchableOpacity, Image } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors } from '@theme';
import type { OrganiserCardProps } from './OrganiserCard.types';
import { styles } from './style/OrganiserCard.styles';

export const OrganiserCard: React.FC<OrganiserCardProps> = ({
  id,
  name,
  avatar,
  isVerified,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={() => onPress(id)} style={styles.container} activeOpacity={0.7}>
      <FlexView style={styles.avatarContainer}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        {isVerified && (
          <FlexView style={styles.badge}>
            <Check color={colors.text.white} size={10} />
          </FlexView>
        )}
      </FlexView>
      <TextDs style={styles.name} numberOfLines={2}>
        {name}
      </TextDs>
    </TouchableOpacity>
  );
};
