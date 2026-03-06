import React from 'react';
import { ImageDs } from '@designSystem/atoms/image';
import { TextDs } from '@designSystem/atoms/TextDs';
import { TouchableOpacity } from 'react-native';
import type { SocialLoginButtonsProps } from './SocialLoginButtons.types';
import { styles } from './style/SocialLoginButtons.styles';
import { FlexView } from '@designSystem/atoms/FlexView';

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGooglePress,
  onApplePress,
  onFacebookPress,
}) => {
  return (
    <FlexView>
      <TextDs style={styles.orText}>or</TextDs>
      <FlexView style={styles.buttonsContainer}>
        <TouchableOpacity onPress={onGooglePress} style={styles.button} activeOpacity={0.8}>
          <ImageDs image="GoogleIcon" style={styles.bottonIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onApplePress} style={styles.button} activeOpacity={0.8}>
          <ImageDs image="AppleIcon" style={styles.bottonIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onFacebookPress} style={styles.button} activeOpacity={0.8}>
          <ImageDs image="FacebookIcon" style={styles.bottonIcon} />
        </TouchableOpacity>
      </FlexView>
    </FlexView>
  );
};
