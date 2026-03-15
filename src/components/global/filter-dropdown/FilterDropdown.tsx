import React, { useState, useRef } from 'react';
import { TouchableOpacity, Modal, StyleSheet, Pressable, Dimensions, ScrollView, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, spacing, borderRadius } from '@theme';
import type { FilterDropdownProps } from './FilterDropdown.types';
import { TextDs } from '@designSystem/atoms/TextDs';
import { ChevronDown, ChevronUp, Check } from 'lucide-react-native';
import { FlexView } from '@designSystem/atoms/FlexView';
import { ImageDs } from '@designSystem/atoms/image/ImageDs';

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  selectedIds,
  onToggle,
  align = "left",
  isMultiSelect = true,
  buttonIcon: ButtonIcon,
}) => {
  const buttonRef = useRef<View>(null);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState<number | undefined>(undefined);
  const [dropdownRight, setDropdownRight] = useState<number | undefined>(undefined);

  const openDropdown = () => {
    buttonRef.current?.measure((_fx: number, _fy: number, _w: number, h: number, px: number, py: number) => {
      setDropdownTop(py + h + 4);
      if (align === 'right') {
        setDropdownRight(Dimensions.get('window').width - px - _w);
        setDropdownLeft(undefined);
      } else {
        setDropdownLeft(px);
        setDropdownRight(undefined);
      }
      setShowModal(true);
    });
  };
  const [showModal, setShowModal] = useState(false);

  const selectedCount = selectedIds.filter(id => !id.startsWith('all-')).length;
  const hasSelection = selectedCount > 0;

  // Check if this is the price filter
  const isPriceFilter = label.toLowerCase() === 'price';

  // For single-select, show selected option label instead of count
  // For price filter, remove "AED" from the label
  const getDisplayLabel = (optionLabel: string) => {
    if (isPriceFilter) {
      return optionLabel.replace(/\s*AED\s*$/i, '');
    }
    return optionLabel;
  };

  const displayLabel = isMultiSelect
    ? (hasSelection ? `${label} (${selectedCount})` : label)
    : (hasSelection ? getDisplayLabel(options.find(opt => selectedIds.includes(opt.id))?.label || label) : label);

  const handleToggle = (id: string) => {
    if (!isMultiSelect) {
      // Single-select: if clicking the already selected item, deselect it
      // Otherwise, deselect all others first, then toggle this one
      const isCurrentlySelected = selectedIds.includes(id);
      if (isCurrentlySelected) {
        // Deselect the current item
        onToggle(id);
      } else {
        // Deselect all others, then select this one
        selectedIds.forEach(selectedId => {
          if (selectedId !== id) {
            onToggle(selectedId);
          }
        });
        // Then toggle the new one
        onToggle(id);
      }
    } else {
      // Multi-select: normal toggle behavior
      onToggle(id);
    }
  };

  // Check if selected value is not "0" (Free)
  const selectedOption = options.find(opt => selectedIds.includes(opt.id));
  const isNotFree = selectedOption?.value !== "0";

  return (
    <FlexView position="relative">
      <TouchableOpacity
        ref={buttonRef as any}
        style={[styles.filterButton]}
        onPress={() => showModal ? setShowModal(false) : openDropdown()}
        activeOpacity={0.7}
      >
        {isPriceFilter && hasSelection && isNotFree && (
          <ImageDs image="dhiramWhiteIcon" size={16} style={styles.buttonIcon} />
        )}
        <TextDs size={14} weight="regular" color="white">
          {displayLabel}
        </TextDs>
        {showModal ? (
          <ChevronUp size={16} color={colors.text.white} />
        ) : (
          <ChevronDown size={16} color={colors.text.white} />
        )}
      </TouchableOpacity>

      {showModal && (
        <Modal
          transparent
          animationType="none"
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <Pressable
            style={StyleSheet.absoluteFillObject}
            onPress={() => setShowModal(false)}
          />
          <View
            style={[
              styles.dropdownList,
              {
                top: dropdownTop,
                ...(dropdownRight !== undefined ? { right: dropdownRight } : { left: dropdownLeft }),
              },
            ]}
          >
            <ScrollView
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              bounces={false}
            >
              {options.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const displayText = getDisplayLabel(item.label);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.optionItem}
                    onPress={() => handleToggle(item.id)}
                    activeOpacity={0.7}
                  >
                    {isMultiSelect ? (
                      <FlexView
                        width={20}
                        height={20}
                        borderRadius={4}
                        borderWidth={2}
                        borderColor={isSelected ? colors.primary : colors.border.medium}
                        backgroundColor={isSelected ? colors.text.blueGray : 'transparent'}
                        alignItems="center"
                        justifyContent="center"
                        mr={spacing.sm}
                      >
                        {isSelected && <Check size={16} color={colors.text.white} />}
                      </FlexView>
                    ) : isPriceFilter && item.value !== "0" ? (
                      <>
                        <ImageDs image="dhiramWhiteIcon" size={16} style={styles.priceIcon} />
                        <TextDs size={16} weight="regular" color="white" style={styles.lessThanSign}>
                          {'<'}
                        </TextDs>
                      </>
                    ) : null}
                    <FlexView flexDirection='row' alignItems='center' gap={spacing.xs} flex={1}>
                      {item.icon && (
                        <ImageDs image={item.icon as any} size={15} style={styles.sportIcon} />
                      )}
                      <TextDs
                        size={16}
                        weight={isSelected ? 'medium' : 'regular'}
                        color="white"
                        style={styles.optionText}
                      >
                        {displayText}
                      </TextDs>
                      {!isMultiSelect && isSelected && (
                        <Check size={14} color={colors.primary} style={styles.checkIcon} />
                      )}
                    </FlexView>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </Modal>
      )}
    </FlexView>
  );
};

const styles = StyleSheet.create({
  dropdownList: {
    position: 'absolute',
    minWidth: 210,
    maxHeight: 350,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    backgroundColor: colors.primaryDark,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    marginRight: spacing.xs,
    gap: spacing.xs,
  },
  backdrop: {
    position: 'absolute',
    zIndex: 999,
  },
  optionsList: {
    maxHeight: 240,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    justifyContent: 'space-between',
  },
  optionText: {
    flex: 1,
    flexShrink: 1,
    marginRight: spacing.xs,
  },
  checkIcon: {
    marginLeft: spacing.sm,
  },
  priceIcon: {
    marginRight: spacing.xs,
  },
  lessThanSign: {
    marginRight: spacing.xs,
  },
  buttonIcon: {
    marginRight: spacing.xs,
  },
  sportIcon: {
    marginRight: spacing.sm,
  },
});
