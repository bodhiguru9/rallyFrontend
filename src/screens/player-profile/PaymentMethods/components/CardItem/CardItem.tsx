import React from 'react';
import { TextDs,  FlexView } from '@components';
import {TouchableOpacity} from 'react-native';
import { colors } from '@theme';
import type { CardItemProps } from './CardItem.types';
import { styles } from './style/CardItem.styles';

export const CardItem: React.FC<CardItemProps> = ({
  cardNumber,
  expiryDate,
  onRemove,
}) => {
  return (
    <FlexView style={styles.container}>
      <FlexView style={styles.cardInfo}>
        <TextDs style={styles.cardNumber}>{cardNumber}</TextDs>
        <TextDs style={styles.expiryDate}>{expiryDate}</TextDs>
      </FlexView>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={onRemove}
        activeOpacity={0.7}
      >
        <TextDs style={styles.removeButtonText}>Remove</TextDs>
      </TouchableOpacity>
    </FlexView>
  );
};

