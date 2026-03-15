import React, { useCallback } from 'react';
import { Trophy, type LucideIcon } from 'lucide-react-native'; // Added a fallback icon
import type { ImageKey } from '@assets/images';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { spacing, borderRadius, getFontStyle, colors, withOpaqueForAndroid } from '@theme';
import type { IconTagProps, IconTagVariant } from './IconTag.types';
import { ImageDs } from '@designSystem/atoms/image';

export const IconTag: React.FC<IconTagProps> = ({
  title,
  icon, // This now acts as an optional override
  variant = 'orange',
  size = 'medium',
  searchType,
  value: valueProp,
  onPress,
  disabled = false,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'TagSearch'>>();

  // 1. This regex removes ALL spaces, hyphens, and special characters.
  // "Table Tennis", "Table-Tennis", and "table_tennis" will ALL become "tabletennis"
  const normalizedValue = (valueProp ?? title).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  const resolvedVariant = valueToVariantMap[normalizedValue] ?? variant;
  const resolvedIcon = icon ?? valueToIconMap[normalizedValue] ?? Trophy;

  const displayTitle =
    title === "Attendees"
      ? title
      : title.length > 12
        ? `${title.slice(0, 6)}…`
        : title;

  const containerStyle = [
    styles.container,
    size === 'xxSmall' && styles.containerXxSmall,
    size === 'extraSmall' && styles.containerExtraSmall,
    size === 'small' && styles.containerSmall,
    size === 'large' && styles.containerLarge,
    { backgroundColor: variantStyles[resolvedVariant].background },
  ];

  const iconSize =
    size === 'xxSmall'
      ? 8
      : size === 'extraSmall'
        ? 10
        : size === 'small'
          ? 12
          : size === 'large'
            ? 20
            : 16;

  const textStyle = [
    styles.text,
    size === 'xxSmall' && styles.textXxSmall,
    size === 'extraSmall' && styles.textExtraSmall,
    size === 'small' && styles.textSmall,
    size === 'large' && styles.textLarge,
    { color: variantStyles[resolvedVariant].text },
  ];

  const isImageKey = typeof resolvedIcon === 'string';

  const payloadValue = valueProp ?? title;

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress({
        searchType: searchType ?? 'sport',
        value: payloadValue,
      });
    } else if (searchType) {
      navigation.navigate('TagSearch', { searchType, value: payloadValue });
    }
  }, [onPress, searchType, payloadValue, navigation]);

  const content = (
    <FlexView style={containerStyle}>
      {isImageKey ? (
        <ImageDs image={resolvedIcon as ImageKey} size={iconSize} />
      ) : (
        (() => {
          const IconComponent = resolvedIcon as LucideIcon;
          return <IconComponent size={iconSize} color={variantStyles[resolvedVariant].icon} />;
        })()
      )}
      <TextDs style={textStyle}>{displayTitle}</TextDs>
    </FlexView>
  );

  const isPressable = onPress != null || searchType != null;

  if (isPressable) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={styles.touchable}
        disabled={disabled}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

// --- MAPPINGS ---

const valueToVariantMap: Record<string, IconTagVariant> = {
  social: 'teal',
  tournament: 'purple',
  class: 'indigo',
  training: 'green',
  group: 'orange',
  private: 'gray',
};

// Add your specific sport mapping here.
// Note: normalizedValue removes spaces/special chars and lowercases (e.g. "Table Tennis" -> "tabletennis")
const valueToIconMap: Record<string, string | LucideIcon> = {
  volleyball: 'volleyball',
  basketball: 'basketballYellow',
  football: 'footballIcon',
  soccer: 'footballIcon',
  tennis: 'tennisYellow',
  running: 'sport-running',
  yoga: 'sport-yoga',
  cycling: 'sport-cycling',
  pilates: 'pilatesYellow',
  baseball: 'sport-baseball',
  badminton: 'badmintonYellow',
  pickleball: 'pickleballYellow',
  cricket: 'cricketYellow',
  tabletennis: 'tableTennisYellow',
  'tabletennis': 'tableTennisYellow',
  padel: 'padelYellow',
  padeltennis: 'padelYellow',
  social: 'socialIcon',
  class: 'classIcon',
  tournament: 'tournamentIcon',
  training: 'trainingIcon',
  group: 'groupIcon',
  private: 'privateIcon',
};

const variantStyles: Record<IconTagVariant, { background: string; text: string; icon: string }> = {
  orange: {
    background: withOpaqueForAndroid('rgba(248, 238, 200, 0.50)'),
    text: '#C87516',
    icon: '#C87516',
  },
  teal: {
    background: withOpaqueForAndroid('rgba(155, 237, 233, 0.50)'),
    text: '#0A7588',
    icon: '#0A7588',
  },
  purple: {
    background: withOpaqueForAndroid('rgba(182, 160, 219, 0.50)'),
    text: '#5B0A76',
    icon: '#5B0A76',
  },
  yellow: {
    background: withOpaqueForAndroid('rgba(224, 218, 169, 0.50)'),
    text: '#988700',
    icon: '#988700',
  },
  indigo: {
    background: withOpaqueForAndroid('rgba(155, 209, 237, 0.50)'),
    text: '#32469F',
    icon: '#32469F',
  },
  green: {
    background: withOpaqueForAndroid('rgba(206, 237, 195, 0.26)'),
    text: '#639059',
    icon: '#639059',
  },
  gray: {
    background: withOpaqueForAndroid('rgba(200, 200, 200, 0.40)'),
    text: 'black',
    icon: 'black',
  },
};

const styles = StyleSheet.create({
  touchable: {
    alignSelf: 'flex-start',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.xxl,
    gap: spacing.xs,
    alignSelf: 'flex-start',
    boxShadow: colors.glass.boxShadow.light,
  },
  containerXxSmall: {
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.xs,
    gap: spacing.xxs,
  },
  containerExtraSmall: {
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
  },
  containerSmall: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  containerLarge: {
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xxl,
    gap: spacing.lg,
  },
  text: {
    ...getFontStyle(14, 'medium'),
    textTransform: 'capitalize',
  },
  textXxSmall: {
    ...getFontStyle(8, 'medium'),
    textTransform: 'capitalize',
  },
  textExtraSmall: {
    ...getFontStyle(10, 'medium'),
    textTransform: 'capitalize',
  },
  textSmall: {
    ...getFontStyle(12, 'medium'),
    textTransform: 'capitalize',
  },
  textLarge: {
    ...getFontStyle(16, 'semibold'),
    textTransform: 'capitalize',
  },
});
