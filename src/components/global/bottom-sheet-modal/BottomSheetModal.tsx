import React, { useEffect, useMemo, useCallback } from 'react';
import { FlexView } from '@designSystem/atoms/FlexView';
import {
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import type { BottomSheetModalProps } from './BottomSheetModal.types';
import { styles } from './style/BottomSheetModal.styles';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  visible,
  onClose,
  children,
  snapPoints = ['90%'],
  enablePanDownToClose = true,
  containerStyle,
  contentContainerStyle,
  showHandleIndicator = true,
  handleIndicatorStyle,
  backgroundStyle,
  keyboardBehavior = 'padding',
}) => {
  // Use useMemo for Animated.Value to avoid recreating on each render
  const translateY = useMemo(() => new Animated.Value(SCREEN_HEIGHT), []);

  // Convert snap point percentage to pixel value
  const getSnapPointHeight = (snapPoint: string | number): number => {
    if (typeof snapPoint === 'number') {
      return snapPoint;
    }
    const percentage = parseInt(snapPoint.replace('%', ''), 10);
    return (SCREEN_HEIGHT * percentage) / 100;
  };

  const mainSnapPoint = getSnapPointHeight(snapPoints[0]);

  const openModal = useCallback(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [translateY]);

  const closeModal = useCallback(() => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  }, [translateY, onClose]);

  // Pan responder for drag gesture
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        // Important: don't steal normal taps inside the sheet.
        // Only become responder when the user actually drags down.
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Only activate pan responder for downward drags
          return enablePanDownToClose && gestureState.dy > 5;
        },
        onPanResponderMove: (_, gestureState) => {
          // Only allow dragging down
          if (gestureState.dy > 0) {
            translateY.setValue(gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          const threshold = mainSnapPoint * 0.3; // 30% of sheet height

          if (gestureState.dy > threshold || gestureState.vy > 0.5) {
            // Close the modal
            closeModal();
          } else {
            // Snap back to open position
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
              tension: 50,
              friction: 8,
            }).start();
          }
        },
      }),
    [enablePanDownToClose, translateY, mainSnapPoint, closeModal],
  );

  useEffect(() => {
    if (visible) {
      openModal();
    } else {
      translateY.setValue(SCREEN_HEIGHT);
    }
  }, [visible, openModal, translateY]);

  const handleBackdropPress = () => {
    if (enablePanDownToClose) {
      closeModal();
    }
  };


  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeModal}
      statusBarTranslucent
    >
      <FlexView style={styles.modalOverlay}>
        {/* Backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleBackdropPress}
        />

        {/* Bottom Sheet */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? keyboardBehavior : 'height'}
          style={styles.keyboardAvoid}
        >
          <Animated.View
            style={[
              styles.container,
              backgroundStyle,
              containerStyle,
              {
                height: mainSnapPoint,
                transform: [{ translateY }],
              },
            ]}
            {...(enablePanDownToClose ? panResponder.panHandlers : {})}
          >
            {/* Handle Indicator */}
            {showHandleIndicator && (
              <FlexView style={styles.handleContainer}>
                <FlexView style={[styles.handleIndicator, handleIndicatorStyle]} />
              </FlexView>
            )}

            {/* Content */}
            <FlexView style={[styles.contentContainer, contentContainerStyle]}>
              {children}
            </FlexView>
          </Animated.View>
        </KeyboardAvoidingView>
      </FlexView>
    </Modal>
  );
};
