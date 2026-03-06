import React from 'react';
import { TextDs,  FlexView } from '@components';
import {Pressable, Platform, StyleSheet} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, getFontStyle } from '@theme';

export const PlanHeader: React.FC = () => {
  const navigation = useNavigation();

  return (
    <FlexView style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.backButton,
          Platform.OS === 'ios' && pressed && { opacity: 0.7 },
        ]}
        onPress={() => navigation.goBack()}
        android_ripple={{ color: `${colors.primary  }30`, borderless: true, radius: 20 }}
      >
        <FlexView style={styles.backButtonCircle}>
          <ArrowLeft size={20} color={colors.text.primary} />
        </FlexView>
      </Pressable>
      <TextDs style={styles.title}>Plan Details</TextDs>
      <FlexView style={styles.placeholder} />
    </FlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface.background,
  },
  backButton: {
    width: 40,
  },
  backButtonCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
});
