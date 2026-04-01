import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { TextDs, FlexView } from '@components';
import { colors } from '@theme';
import { logger } from '@dev-tools/logger';
import { searchLocation } from '@services/location-search-service';
import { debounce } from '@utils/debounce';
import type { EventLocation } from '@app-types/location.types';
import type { EventLocationSearchProps } from './EventLocationSearch.types';
import { styles } from './style/EventLocationSearch.styles';

/** Google Maps API allows more requests, so we can reduce debounce and min length. */
const MIN_SEARCH_LENGTH = 3;
const DEBOUNCE_MS = 500;

export const EventLocationSearch: React.FC<EventLocationSearchProps> = ({
  value,
  onChange,
  onInputChange,
  placeholder = 'Location',
  leftIcon,
  minSearchLength = MIN_SEARCH_LENGTH,
  debounceMs = DEBOUNCE_MS,
  containerStyle,
  onDropdownVisibilityChange,
}) => {
  const [inputText, setInputText] = useState(value?.name ?? value?.displayName ?? '');
  const [suggestions, setSuggestions] = useState<EventLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmptyState, setShowEmptyState] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const isSelectingRef = useRef(false);
  const inputTextRef = useRef(inputText);
  inputTextRef.current = inputText;

  // Sync input text when value is set externally (e.g. form reset)
  useEffect(() => {
    setInputText(value?.name ?? value?.displayName ?? '');
  }, [value?.name, value?.displayName]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const performSearch = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (trimmed.length < minSearchLength) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        const results = await searchLocation({
          query: trimmed,
          signal: controller.signal,
        });
        if (isMountedRef.current && !controller.signal.aborted) {
          setSuggestions(results);
          setShowEmptyState(results.length === 0);
        }
      } catch (err: unknown) {
        if (isMountedRef.current && !controller.signal.aborted) {
          const message =
            err instanceof Error ? err.message : 'Failed to search location';
          setError(message);
          setSuggestions([]);
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    [minSearchLength],
  );

  const debouncedSearch = useMemo(
    () => debounce((q: string) => performSearch(q), debounceMs),
    [debounceMs, performSearch],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputChange = useCallback(
    (text: string) => {
      setInputText(text);
      onInputChange?.(text);
      setError(null);
      if (text.trim().length >= minSearchLength) {
        debouncedSearch(text);
      } else {
        debouncedSearch.cancel();
        setSuggestions([]);
        setShowEmptyState(false);
      }
    },
    [minSearchLength, debouncedSearch, onInputChange],
  );

  const handleSelectSuggestion = useCallback(
    (location: EventLocation) => {
      isSelectingRef.current = true;
      logger.info('Place selected', {
        displayName: location.displayName,
        name: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
        city: location.city,
        country: location.country,
      });
      setInputText(location.name || location.displayName);
      setSuggestions([]);
      setShowEmptyState(false);
      setError(null);
      Keyboard.dismiss();
      onChange(location);
      // Reset flag after a short delay
      setTimeout(() => {
        isSelectingRef.current = false;
      }, 100);
    },
    [onChange],
  );

  const handleInputBlur = useCallback(() => {
    // Sync typed text to form immediately (so validation on submit gets it)
    const trimmed = inputTextRef.current.trim();
    if (!isSelectingRef.current) {
      if (trimmed.length >= 3 && value?.name !== trimmed && value?.displayName !== trimmed) {
        onChange({
          name: trimmed,
          displayName: trimmed,
          latitude: 0,
          longitude: 0,
        });
      } else if (trimmed.length === 0 && value !== null) {
        onChange(null);
      }
    }
    // Close dropdown after delay so that tapping a suggestion runs first
    setTimeout(() => {
      if (!isSelectingRef.current) {
        setSuggestions([]);
        setShowEmptyState(false);
      }
    }, 200);
  }, [value?.name, value?.displayName, value, onChange]);

  const handleInputFocus = useCallback(() => {
    isSelectingRef.current = false;
  }, []);

  const showDropdown =
    suggestions.length > 0 || isLoading || error !== null || showEmptyState;

  useEffect(() => {
    onDropdownVisibilityChange?.(showDropdown);
  }, [showDropdown, onDropdownVisibilityChange]);

  useEffect(() => {
    return () => {
      onDropdownVisibilityChange?.(false);
    };
  }, [onDropdownVisibilityChange]);

  const renderSuggestion = useCallback(
    ({ item, index }: { item: EventLocation; index: number }) => (
      <Pressable
        style={({ pressed }) => [
          styles.suggestionItem,
          index === suggestions.length - 1 && styles.suggestionItemLast,
          pressed && styles.suggestionItemPressed,
        ]}
        onPress={() => handleSelectSuggestion(item)}
        hitSlop={{ top: 4, bottom: 4, left: 0, right: 0 }}
      >
        <TextDs size={12} weight="regular" color="primary" numberOfLines={1}>
          {item.name}
        </TextDs>
        {item.displayName !== item.name && (
          <TextDs
            size={10}
            weight="regular"
            color="secondary"
            numberOfLines={1}
            style={styles.suggestionSubtext}
          >
            {item.displayName}
          </TextDs>
        )}
      </Pressable>
    ),
    [suggestions.length, handleSelectSuggestion],
  );

  return (
    <View style={[styles.container, containerStyle]} collapsable={false}>
      <FlexView style={styles.inputRow}>
        {leftIcon && <FlexView style={styles.leftIconContainer}>{leftIcon}</FlexView>}
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.text.secondary}
          returnKeyType="search"
          onSubmitEditing={() =>
            inputText.trim().length >= minSearchLength && debouncedSearch(inputText)
          }
        />
      </FlexView>

      {showDropdown && (
        <View
          style={styles.dropdown}
        >
          {isLoading && (
            <FlexView style={styles.loadingRow}>
              <ActivityIndicator size="small" color={colors.primary} />
            </FlexView>
          )}
          {!isLoading && error && (
            <FlexView style={styles.errorRow}>
              <TextDs size={14} style={styles.errorText}>
                {error}
              </TextDs>
            </FlexView>
          )}
          {!isLoading && !error && showEmptyState && (
            <FlexView style={styles.emptyRow}>
              <TextDs size={14} color="secondary">
                No places found
              </TextDs>
            </FlexView>
          )}
          {!isLoading && !error && suggestions.length > 0 && (
            <View style={styles.dropdownListWrap} pointerEvents="box-none">
              <FlatList
                data={suggestions}
                keyExtractor={(item) =>
                  `${item.placeId ?? item.latitude}-${item.longitude}`
                }
                renderItem={renderSuggestion}
                keyboardShouldPersistTaps="always"
                nestedScrollEnabled
                scrollEnabled
                showsVerticalScrollIndicator
                removeClippedSubviews={false}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};
