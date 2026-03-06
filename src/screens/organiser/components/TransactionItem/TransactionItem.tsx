import React from 'react';
import { Image } from 'react-native';
import { User } from 'lucide-react-native';
import { colors, spacing } from '@theme';
import type { TransactionItemProps } from './TransactionItem.types';
import { styles } from './style/TransactionItem.styles';
import { Card } from '@components/global/Card';
import { FlexView } from '@designSystem/atoms/FlexView';
import { ImageDs, TextDs } from '@components';

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
}) => {
  return (
    <Card>
      <FlexView flexDirection='row' alignItems='center' justifyContent='space-between'>
        <FlexView style={styles.avatarContainer}>
          {transaction.memberAvatar ? (
            <Image
              source={{ uri: transaction.memberAvatar }}
              style={styles.avatar}
            />
          ) : (
            <FlexView style={styles.avatarPlaceholder}>
              <User size={16} color={colors.text.secondary} />
            </FlexView>
          )}
        </FlexView>

        <FlexView style={styles.infoContainer}>
          <TextDs style={styles.memberName}>{transaction.memberName}</TextDs>
          <TextDs style={styles.bookedInfo}>
            Booked: {transaction.bookedDate}, {transaction.bookedTime}
          </TextDs>
        </FlexView>

        <FlexView flexDirection='row' alignItems='center' gap={spacing.xs}>
          <ImageDs image="DhiramIcon" size={14} />
          <TextDs size={16} weight="semibold" color='blueGray'>
            {transaction.amount}
          </TextDs>
        </FlexView>
      </FlexView>
    </Card>
  );
};

