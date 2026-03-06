import React from 'react';
import { FlexView } from '@designSystem/atoms/FlexView';
import { ImageDs } from '@designSystem/atoms/image';
import { TextDs } from '@designSystem/atoms/TextDs';
import { TouchableOpacity } from 'react-native';
import type { UserTypeSelectorProps } from './UserTypeSelector.types';
import { styles } from './style/UserTypeSelector.styles';

export type { UserType } from './UserTypeSelector.types';

export const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({
  selectedType,
  onSelectType,
}) => {
  return (
    <FlexView style={styles.container}>
      <TextDs style={styles.label}>User Type</TextDs>
      <FlexView style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => onSelectType('player')}
          style={[styles.button, selectedType === 'player' && styles.buttonActive]}
          activeOpacity={0.8}
        >
          {selectedType === 'player' ? (
            <ImageDs image="UserWhite" size={24} />
          ) : (
            <ImageDs image="UserGray" size={24} />
          )}
          <TextDs style={[styles.buttonText, selectedType === 'player' && styles.buttonTextActive]}>
            Player
          </TextDs>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSelectType('organiser')}
          style={[styles.button, selectedType === 'organiser' && styles.buttonActive]}
          activeOpacity={0.8}
        >
          {selectedType === 'organiser' ? (
            <ImageDs image="UserOrgWhite" size={24} />
          ) : (
            <ImageDs image="UserOrgGray" size={24} />
          )}
          <TextDs
            style={[styles.buttonText, selectedType === 'organiser' && styles.buttonTextActive]}
          >
            Organiser
          </TextDs>
        </TouchableOpacity>
      </FlexView>
    </FlexView>
  );
};
