import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View, Platform } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SplashVideoScreenProps {
  /** Called when the splash animation is completely finished (video done + fade out) */
  onFinish: () => void;
}

/**
 * Full-screen video splash overlay.
 *
 * Plays `RALLLY_02_TRANSPARENT-cmprsd.mov` on iOS for transparency,
 * and `RALLLY_02.mp4` on other platforms.
 * This component is meant to be rendered *on top of* the main app
 * so the transition from native splash → video → app is seamless.
 */
export const SplashVideoScreen: React.FC<SplashVideoScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [isVideoReady, setIsVideoReady] = useState(false);
  const finishedRef = useRef(false);

  const safeFinish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    console.log('🏁 [SPLASH VIDEO] Finishing and fading out');

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      onFinish();
    });
  }, [fadeAnim, onFinish]);

  // Safety timeout: if video doesn't finish in 6 seconds, just proceed
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!finishedRef.current) {
        console.warn('⚠️ [SPLASH VIDEO] Timeout reached, proceeding without video finish');
        safeFinish();
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [safeFinish]);

  const handlePlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded) {
        if (status.error) {
          console.error('❌ [SPLASH VIDEO] Playback error:', status.error);
          safeFinish();
        }
        return;
      }

      if (status.didJustFinish) {
        console.log('✅ [SPLASH VIDEO] Playback finished naturally');
        safeFinish();
      }
    },
    [safeFinish],
  );

  const handleVideoLoad = useCallback(() => {
    console.log('🎥 [SPLASH VIDEO] Video loaded successfully');
    setIsVideoReady(true);
  }, []);

  const handleVideoError = useCallback((error: string) => {
    console.error('❌ [SPLASH VIDEO] Video load error:', error);
    safeFinish();
  }, [safeFinish]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]} pointerEvents="none">
      <View style={styles.videoContainer}>
        <Video
          source={
            Platform.OS === 'ios'
              ? require('../../assets/images/loading-gifs/RALLLY_02_TRANSPARENT-cmprsd.mov')
              : require('../../assets/images/loading-gifs/RALLLY_02.mp4')
          }
          style={[styles.video, { backgroundColor: 'transparent' }]}
          videoStyle={{ backgroundColor: 'transparent' }}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping={false}
          isMuted
          onLoad={handleVideoLoad}
          onError={handleVideoError}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#ffffff',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#ffffff',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
