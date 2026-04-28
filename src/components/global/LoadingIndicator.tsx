import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { colors } from '@theme';

interface LoadingIndicatorProps {
  size?: number | 'small' | 'large';
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  size = 60, 
  color = '#000000',
  style 
}) => {
  const numericSize = typeof size === 'number' ? size : size === 'large' ? 80 : 40;

  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.container, { width: numericSize, height: numericSize }, style]}>
        <Video
          source={require('../../assets/images/loading-gifs/RALLLY_LOOP_LOADING_02_TRANSPARENT-cmprsd.mov')}
          style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent' }]}
          videoStyle={{ backgroundColor: 'transparent' }}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping
          isMuted
        />
      </View>
    );
  }

  return (
    <ActivityIndicator 
      size={size} 
      color={color} 
      style={style} 
    />
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
