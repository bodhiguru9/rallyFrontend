import React from 'react';
import { FlexView } from '@designSystem/atoms/FlexView';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Header } from '@components/global/layout/Header';
import { BottomNavigation } from '@components/global/layout/BottomNavigation';
import { ArrowIcon } from '@components/global/ArrowIcon';
import type { ContainerProps } from './Container.types';
import { styles } from './Container.styles';

/**
 * Container Component
 *
 * A flexible, reusable layout container that provides:
 * - Optional gradient background
 * - Optional SafeAreaView wrapper
 * - Optional back button
 * - Optional Header component
 * - Optional BottomNavigation component
 * - Optional keyboard avoiding behavior
 *
 * @example
 * ```tsx
 * // Simple container with gradient
 * <Container>
 *   <TextDs>Content here</TextDs>
 * </Container>
 *
 * // Container with header and bottom nav
 * <Container
 *   showHeader
 *   showBottomNav
 *   userType="player"
 *   isAuthenticated={true}
 *   activeTab="explore"
 *   onExplorePress={handleExplorePress}
 *   onProfilePress={handleProfilePress}
 * >
 *   <ScrollView>
 *     <TextDs>Content here</TextDs>
 *   </ScrollView>
 * </Container>
 *
 * // Container with back button
 * <Container showBackButton>
 *   <TextDs>Detail screen content</TextDs>
 * </Container>
 * ```
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  showBackButton = false,
  onBackPress,
  showHeader = false,
  userType = 'player',
  notificationCount,
  onSearchPress,
  onNotificationPress,
  onProfilePress,
  onSignUpPress,
  showBottomNav = false,
  activeTab,
  useGradientBackground = true,
  useSafeArea = true,
  style,
  contentStyle,
  keyboardAvoiding = false,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  // Determine container style based on gradient preference
  const containerStyle = [
    useGradientBackground ? styles.containerWithGradient : styles.container,
    style,
  ];

  // Content wrapper: use KeyboardAvoidingView only on iOS; Android handles keyboard via windowSoftInputMode
  const useKeyboardAvoiding = keyboardAvoiding && Platform.OS === 'ios';
  const ContentWrapper = useKeyboardAvoiding ? KeyboardAvoidingView : View;
  const contentWrapperProps = useKeyboardAvoiding
    ? {
        behavior: 'padding' as const,
        style: [styles.contentContainer, contentStyle],
      }
    : {
        style: [styles.contentContainer, contentStyle],
      };

  // Render content
  const renderContent = () => (
    <>
      {/* Back Button */}
      {showBackButton && (
        <FlexView style={styles.backButtonContainer}>
          <ArrowIcon onClick={handleBackPress} variant="left" />
        </FlexView>
      )}

      {/* Header */}
      {showHeader && (
        <Header
          notificationCount={notificationCount}
          onSearchPress={onSearchPress}
          onNotificationPress={onNotificationPress}
          onProfilePress={onProfilePress}
          onSignUpPress={onSignUpPress}
        />
      )}

      {/* Main Content */}
      <ContentWrapper {...contentWrapperProps}>{children}</ContentWrapper>

      {/* Bottom Navigation */}
      {showBottomNav && activeTab && (
        <BottomNavigation
          userType={userType}
          activeTab={activeTab}
        />
      )}
    </>
  );

  // Render with or without SafeAreaView
  if (useSafeArea) {
    return (
      <SafeAreaView style={[styles.safeArea, containerStyle]} edges={['top']}>
        {renderContent()}
      </SafeAreaView>
    );
  }

  return <FlexView style={containerStyle}>{renderContent()}</FlexView>;
};
