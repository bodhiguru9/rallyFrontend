import React, { useState } from 'react';
import { TextDs,  FlexView } from '@components';
import {Pressable, Platform, StyleSheet} from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

interface PaymentFooterProps {
  total: number;
  currency?: string;
  onBuyNow: () => void;
}

export const PaymentFooter: React.FC<PaymentFooterProps> = ({
  total,
  currency = '฿',
  onBuyNow,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <FlexView style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.header,
          Platform.OS === 'ios' && pressed && { opacity: 0.7 },
        ]}
        onPress={() => setIsExpanded(!isExpanded)}
        android_ripple={{ color: `${colors.primary  }30`, borderless: false }}
      >
        <TextDs style={styles.headerText}>Payment Details</TextDs>
        {isExpanded ? (
          <ChevronUp size={20} color={colors.text.primary} />
        ) : (
          <ChevronDown size={20} color={colors.text.primary} />
        )}
      </Pressable>

      {isExpanded && (
        <FlexView style={styles.details}>
          <FlexView style={styles.totalRow}>
            <TextDs style={styles.totalLabel}>Total</TextDs>
            <TextDs style={styles.totalAmount}>
              {currency} {total.toFixed(2)}
            </TextDs>
          </FlexView>
        </FlexView>
      )}

      <Pressable
        style={({ pressed }) => [
          styles.buyButton,
          Platform.OS === 'ios' && pressed && { opacity: 0.8 },
        ]}
        onPress={onBuyNow}
        android_ripple={{ color: `${colors.text.white  }80`, borderless: false }}
      >
        <TextDs style={styles.buyButtonText}>Buy Now</TextDs>
      </Pressable>
    </FlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.card,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerText: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
  },
  details: {
    marginBottom: spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.secondary,
  },
  totalAmount: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
  },
  buyButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonText: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.white,
  },
});
