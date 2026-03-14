import React, { useState, useMemo } from 'react';
import { FlexView } from '@designSystem/atoms/FlexView';
import { ImageDs } from '@designSystem/atoms/image';
import { TextDs } from '@designSystem/atoms/TextDs';
import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList
} from 'react-native';
import { ChevronDown, Mail, Search } from 'lucide-react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';
import type { CountryCode, WhatsAppInputProps } from './WhatsAppInput.types';
import { countryCodes, defaultCountry } from './country-codes';

export const WhatsAppInput: React.FC<WhatsAppInputProps> = ({
  value,
  onChangeText,
  onUseEmailPress,
}) => {
  const [selectedCode, setSelectedCode] = useState<CountryCode>(defaultCountry);
  const [showCodePicker, setShowCodePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return countryCodes;
    }
    const query = searchQuery.toLowerCase();
    return countryCodes.filter(
      country =>
        country.code.toLowerCase().includes(query) ||
        country.country.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <FlexView style={styles.container}>
      <FlexView style={styles.labelRow}>
        <TextDs style={styles.label}>WhatsApp Number</TextDs>
        <TouchableOpacity onPress={onUseEmailPress} style={styles.emailLink} activeOpacity={0.7}>
          <Mail size={14} color={colors.primary} />
          <TextDs style={styles.emailLinkText}>Use Email ID</TextDs>
        </TouchableOpacity>
      </FlexView>

      <FlexView style={styles.inputContainer}>
        <TouchableOpacity
          onPress={() => setShowCodePicker(true)}
          style={styles.codeButton}
          activeOpacity={0.7}
        >
          <FlexView style={styles.whatsappIconContainer}>
            <ImageDs image="WhatsappIcon" size={20} />
          </FlexView>
          <TextDs style={styles.codeText}>{selectedCode.code}</TextDs>
          <ChevronDown size={16} color={colors.text.primary} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="50 123 4567"
          placeholderTextColor={colors.text.tertiary}
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
        />
      </FlexView>

      <Modal
        visible={showCodePicker}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowCodePicker(false);
          setSearchQuery('');
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowCodePicker(false);
            setSearchQuery('');
          }}
        >
          <FlexView style={styles.modalContent}>
            <FlexView style={styles.searchContainer}>
              <Search size={20} color={colors.text.secondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by country or code..."
                placeholderTextColor={colors.text.tertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </FlexView>
            <FlatList
              data={filteredCountries}
              keyExtractor={(item, index) => `${item.code}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.codeItem}
                  onPress={() => {
                    setSelectedCode(item);
                    setShowCodePicker(false);
                    setSearchQuery('');
                  }}
                  activeOpacity={0.7}
                >
                  <TextDs style={styles.flag}>{item.flag}</TextDs>
                  <TextDs style={styles.codeItemText}>{item.code}</TextDs>
                  <TextDs style={styles.countryText}>{item.country}</TextDs>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <FlexView style={styles.emptyContainer}>
                  <TextDs style={styles.emptyText}>No countries found</TextDs>
                </FlexView>
              }
            />
          </FlexView>
        </TouchableOpacity>
      </Modal>
    </FlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.primary,
  },
  emailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  emailLinkText: {
    ...getFontStyle(12, 'medium'),
    color: colors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffdef78',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.white,
    overflow: 'hidden',
  },
  codeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRightWidth: 1,
    borderRightColor: colors.border.default,
  },
  whatsappIconContainer: {
    marginRight: spacing.xs,
  },
  codeText: {
    ...getFontStyle(16, 'medium'),
    color: colors.text.primary,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    ...getFontStyle(16, 'regular'),
    color: colors.text.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.surface.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    width: '80%',
    maxHeight: '60%',
    padding: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass.background.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
  },
  emptyContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.secondary,
  },
  codeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  flag: {
    ...getFontStyle(20, 'regular'),
  },
  codeItemText: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.primary,
    minWidth: 60,
  },
  countryText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
});
