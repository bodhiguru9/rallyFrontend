import React, { useState, useRef, useMemo } from 'react';
import { TextDs, FlexView } from '@components';
import {
    TouchableOpacity,
    View,
    Modal,
    FlatList,
    StyleSheet,
    Pressable,
    TextInput,
    Animated,
    Platform,
    Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Check, ChevronDown, ChevronUp, Search } from 'lucide-react-native';
import { colors, borderRadius, spacing, getFontStyle } from '@theme';
import type { DropdownProps, DropdownOption } from './Dropdown.types';
import { ImageDs } from '@designSystem/atoms/image/ImageDs';

export const Dropdown: React.FC<DropdownProps> = (props) => {
    const {
        label,
        placeholder = 'Select an option',
        options,
        position = 'bottom',
        disabled = false,
        containerStyle,
        dropdownStyle,
        optionStyle,
        selectedOptionStyle,
        labelStyle,
        triggerStyle,
        triggerTextStyle,
        icon,
        leftIcon,
        maxHeight = 300,
        searchable = false,
        searchPlaceholder = 'Search...',
    } = props;

    const isMulti = props.multiSelect === true;
    const valueSingle = !isMulti ? (props.value as string | undefined) : undefined;
    const valueMulti = isMulti ? (props.value as string[] | undefined) ?? [] : undefined;
    const onSelectSingle = !isMulti ? (props.onSelect as (value: string) => void) : undefined;
    const onSelectMulti = isMulti ? (props.onSelect as (values: string[]) => void) : undefined;
    const maxSelections = isMulti ? (props.maxSelections ?? 99) : 1;

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownPosition, setDropdownPosition] = useState<{
        top?: number;
        bottom?: number;
        left: number;
        width: number;
    }>({ left: 0, width: 0 });
    const triggerRef = useRef<View>(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fadeAnim = useMemo(() => new Animated.Value(0), []);

    const selectedOption = !isMulti
        ? options.find((opt) => opt.value === valueSingle)
        : undefined;
    const selectedOptionsMulti = isMulti
        ? options.filter((opt) => valueMulti?.includes(opt.value))
        : [];
    const triggerLabel = !isMulti
        ? (selectedOption?.label ?? placeholder)
        : (selectedOptionsMulti.length > 0
            ? selectedOptionsMulti.map((o) => o.label).join(', ')
            : placeholder);

    const filteredOptions = searchable
        ? options.filter((opt) =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        : options;

    const handleTriggerPress = () => {
        if (disabled) {
            return;
        }
        if (isOpen) {
            handleClose();
            return;
        }

        triggerRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
            const screenHeight = Dimensions.get('window').height;
            const spaceBelow = screenHeight - (y + height);
            const spaceAbove = y;

            let finalPosition = position;
            // If space below is tighter than maxHeight + small buffer, flip to top if space exists.
            if (position === 'bottom' && spaceBelow < maxHeight + 40 && spaceAbove > spaceBelow) {
                finalPosition = 'top';
            }

            setDropdownPosition({
                top: finalPosition === 'bottom' ? y + height + 8 : undefined,
                bottom: finalPosition === 'top' ? screenHeight - y + 8 : undefined,
                left: x,
                width,
            });
        });

        setIsOpen(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const handleClose = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            setIsOpen(false);
            setSearchQuery('');
        });
    };

    const handleSelect = (optionValue: string) => {
        if (isMulti && onSelectMulti && valueMulti) {
            const isSelected = valueMulti.includes(optionValue);
            const next = isSelected
                ? valueMulti.filter((v) => v !== optionValue)
                : valueMulti.length >= maxSelections
                    ? valueMulti
                    : [...valueMulti, optionValue];
            onSelectMulti(next);
        } else if (onSelectSingle) {
            onSelectSingle(optionValue);
            handleClose();
        }
    };

    const renderOption = ({ item }: { item: DropdownOption }) => {
        const isSelected = !isMulti
            ? item.value === valueSingle
            : valueMulti?.includes(item.value) ?? false;
        const atMaxAndNotSelected =
            isMulti && (valueMulti?.length ?? 0) >= maxSelections && !isSelected;
        const optionDisabled = item.disabled || atMaxAndNotSelected;

        return (
            <TouchableOpacity
                style={[
                    styles.option,
                    optionStyle,
                    isSelected && [styles.selectedOption, selectedOptionStyle],
                    optionDisabled && styles.disabledOption,
                ]}
                onPress={() => {
                    if (!optionDisabled) {
                        handleSelect(item.value);
                    }
                }}
                disabled={optionDisabled}
            >
                {item.icon && (
                    <ImageDs image={item.icon as any} size={16} style={styles.optionIcon} />
                )}
                <TextDs
                    style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                        item.color && { color: item.color },
                        optionDisabled && styles.disabledOptionText,
                    ]}
                >
                    {item.label}
                </TextDs>
                {isSelected && <Check size={18} color={colors.primary} />}
            </TouchableOpacity>
        );
    };

    return (
        <FlexView style={[styles.container, containerStyle]}>
            {label && (
                <TextDs style={[styles.label, labelStyle]}>
                    {label}
                </TextDs>
            )}

            <TouchableOpacity
                style={[
                    styles.trigger,
                    triggerStyle,
                    disabled && styles.disabledTrigger,
                    isOpen && styles.openTrigger,
                ]}
                onPress={handleTriggerPress}
                disabled={disabled}
                activeOpacity={0.7}
            >
                <View ref={triggerRef} collapsable={false} style={StyleSheet.absoluteFill} pointerEvents="none" />
                {leftIcon ? (
                    <FlexView style={styles.leftIconContainer}>{leftIcon}</FlexView>
                ) : (
                    !isMulti && selectedOption?.icon && (
                        <FlexView style={styles.leftIconContainer}>
                            <ImageDs image={selectedOption.icon as any} size={20} />
                        </FlexView>
                    )
                )}
                <TextDs
                    style={[
                        styles.triggerText,
                        triggerTextStyle,
                        triggerLabel === placeholder && styles.placeholderText,
                        disabled && styles.disabledText,
                    ]}
                >
                    {triggerLabel}
                </TextDs>
                {icon ||
                    (isOpen ? (
                        <ChevronUp size={20} color={disabled ? colors.text.tertiary : colors.text.secondary} />
                    ) : (
                        <ChevronDown size={20} color={disabled ? colors.text.tertiary : colors.text.secondary} />
                    ))
                }
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent
                animationType="none"
                onRequestClose={handleClose}
            >
                <View style={styles.modalOverlay} pointerEvents="box-none">
                    <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
                    <Animated.View
                        pointerEvents="auto"
                        style={[
                            styles.dropdownMenu,
                            dropdownStyle,
                            {
                                top: dropdownPosition.top,
                                bottom: dropdownPosition.bottom,
                                left: dropdownPosition.left,
                                width: dropdownPosition.width,
                                maxHeight,
                                opacity: fadeAnim,
                                transform: [
                                    {
                                        translateY: fadeAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: position === 'bottom' ? [-10, 0] : [10, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        {Platform.OS === 'android' ? (
                            <View style={styles.blurContainer}>
                                {searchable && (
                                    <FlexView style={styles.searchContainer}>
                                        <Search
                                            size={16}
                                            color={colors.text.tertiary}
                                            style={styles.searchIcon}
                                        />
                                        <TextInput
                                            style={styles.searchInput}
                                            placeholder={searchPlaceholder}
                                            placeholderTextColor={colors.text.tertiary}
                                            value={searchQuery}
                                            onChangeText={setSearchQuery}
                                            autoFocus
                                        />
                                    </FlexView>
                                )}

                                <FlatList
                                    data={filteredOptions}
                                    renderItem={renderOption}
                                    keyExtractor={(item) => item.value}
                                    showsVerticalScrollIndicator={true}
                                    style={{ maxHeight }}
                                    ListEmptyComponent={
                                        <FlexView style={styles.emptyContainer}>
                                            <TextDs style={styles.emptyText}>No options found</TextDs>
                                        </FlexView>
                                    }
                                />
                            </View>
                        ) : (
                            <BlurView intensity={80} tint="light" style={styles.blurContainer}>
                                {searchable && (
                                    <FlexView style={styles.searchContainer}>
                                        <Search
                                            size={16}
                                            color={colors.text.tertiary}
                                            style={styles.searchIcon}
                                        />
                                        <TextInput
                                            style={styles.searchInput}
                                            placeholder={searchPlaceholder}
                                            placeholderTextColor={colors.text.tertiary}
                                            value={searchQuery}
                                            onChangeText={setSearchQuery}
                                            autoFocus
                                        />
                                    </FlexView>
                                )}

                                <FlatList
                                    data={filteredOptions}
                                    renderItem={renderOption}
                                    keyExtractor={(item) => item.value}
                                    showsVerticalScrollIndicator={true}
                                    style={{ maxHeight }}
                                    ListEmptyComponent={
                                        <FlexView style={styles.emptyContainer}>
                                            <TextDs style={styles.emptyText}>No options found</TextDs>
                                        </FlexView>
                                    }
                                />
                            </BlurView>
                        )}
                    </Animated.View>
                </View>
            </Modal>
        </FlexView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    label: {
        ...getFontStyle(14, 'medium'),
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    trigger: {
        boxShadow: colors.glass.boxShadow.light,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.glass.background.white,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.md,
        borderWidth: 1,
        borderColor: colors.border.white,
    },
    openTrigger: {
        borderColor: colors.primary,
        borderWidth: 1,
    },
    disabledTrigger: {
        opacity: 0.5,
    },
    triggerText: {
        ...getFontStyle(12, 'regular'),
        color: colors.text.primary,
        flex: 1,
    },
    placeholderText: {
        color: colors.text.secondary,
    },
    disabledText: {
        color: colors.text.tertiary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    dropdownMenuWrapper: {
        flex: 1,
    },
    dropdownMenu: {
        position: 'absolute',
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
    },
    blurContainer: {
        flex: 1,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border.white,
        backgroundColor: colors.glass.background.white,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
        backgroundColor: colors.glass.background.white,
    },
    searchIcon: {
        marginRight: spacing.sm,
    },
    searchInput: {
        flex: 1,
        ...getFontStyle(14, 'regular'),
        color: colors.text.primary,
        paddingVertical: spacing.xs,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.md,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border.light,
    },
    selectedOption: {
        backgroundColor: colors.interactive.hover,
        boxShadow: colors.glass.boxShadow.light,
    },
    disabledOption: {
        opacity: 0.5,
    },
    optionText: {
        ...getFontStyle(12, 'regular'),
        color: colors.text.primary,
        flex: 1,
    },
    selectedOptionText: {
        ...getFontStyle(14, 'medium'),
        color: colors.primary,
    },
    disabledOptionText: {
        color: colors.text.tertiary,
    },
    emptyContainer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        ...getFontStyle(14, 'regular'),
        color: colors.text.tertiary,
    },
    leftIconContainer: {
        marginRight: spacing.sm,
    },
    optionIcon: {
        marginRight: spacing.sm,
    },
});
