import React from 'react';
import { TextDs,  FlexView } from '@components';
import {TextInput, TouchableOpacity, Pressable} from 'react-native';
import { colors } from '@theme';
import type { UpdateableFieldProps } from './UpdateableField.types';
import { styles } from './style/UpdateableField.styles';

export const UpdateableField: React.FC<UpdateableFieldProps> = ({
  title,
  description,
  value,
  onChangeText,
  onUpdate,
  onInputPress,
  placeholder,
  keyboardType = 'default',
  editable = true,
}) => {
  const handleInputPress = () => {
    if (onInputPress) {
      onInputPress();
    }
  };

  return (
    <FlexView style={styles.container}>
      <TextDs style={styles.title}>{title}</TextDs>
      {description && <TextDs style={styles.description}>{description}</TextDs>}
      <FlexView style={styles.inputRow}>
        {onInputPress ? (
          <Pressable onPress={handleInputPress} style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor={colors.text.tertiary}
              keyboardType={keyboardType}
              editable={false}
              pointerEvents="none"
            />
          </Pressable>
        ) : (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.text.tertiary}
            keyboardType={keyboardType}
            editable={editable}
          />
        )}
        <TouchableOpacity
          style={styles.updateButton}
          onPress={onUpdate}
          activeOpacity={0.7}
        >
          <TextDs style={styles.updateButtonText}>Update</TextDs>
        </TouchableOpacity>
      </FlexView>
    </FlexView>
  );
};

