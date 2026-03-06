import React from 'react';
import { FlexView, ImageDs } from '@components';
import { TextInput } from 'react-native';
import { colors } from '@theme';
import type { SearchInputProps } from './SearchInput.types';
import { styles } from './style/SearchInput.styles';

export const SearchInput: React.FC<SearchInputProps> = ({
  style,
  ...textInputProps
}) => {
  return (
    <FlexView gap={6} style={[styles.container]}>
      <ImageDs image="search" size={16} />
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.text.white}
        {...textInputProps}
      />
    </FlexView>
  );
};

