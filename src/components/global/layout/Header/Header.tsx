import React from 'react';
import { TouchableOpacity } from 'react-native';
import { borderRadius, colors, spacing } from '@theme';
import { Avatar } from '@components';
import type { HeaderProps } from './Header.types';
import { styles } from './style/Header.styles';
import { useHeader } from './use-header';
import { FlexView } from '@designSystem/atoms/FlexView';
import { ImageDs } from '@designSystem/atoms/image';
import { TextDs } from '@designSystem/atoms/TextDs';
import { ChevronDown } from 'lucide-react-native';

export const Header: React.FC<HeaderProps> = (props) => {
  const {
    userType,
    isAuthenticated,
    userAvatar,
    userInitials,
    selectedLocation,
    locations,
    showLocationDropdown,
    notificationCount,
    handleSearchPress,
    handleNotificationPress,
    handleProfilePress,
    handleSignUpPress,
    toggleLocationDropdown,
    selectLocation,
  } = useHeader(props);

  if (userType === 'organiser') {
    return (
      <FlexView
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        padding={spacing.sm}
        borderRadius={borderRadius.full}
        mx={spacing.base}
        mt={spacing.base}
        backgroundColor={colors.primaryDark}
        height={44}
      >
        {/* Logo */}
        <FlexView
          ml={spacing.sm}
          mr={spacing.md}
          height="100%"
          alignItems="center"
          justifyContent="center"
        >
          <ImageDs image="WhiteLogo" size={26} fit="contain" />
        </FlexView>

        {/* Right Section */}
        <FlexView style={styles.rightSection}>
          <TouchableOpacity
            onPress={handleNotificationPress}
            style={styles.notificationButton}
            activeOpacity={0.7}
          >
            <ImageDs image="Bell" style={styles.customIcon} fit="contain" />
            {notificationCount !== undefined && notificationCount > 0 && (
              <FlexView style={styles.badge}>
                <TextDs style={styles.badgeText}>
                  {notificationCount > 9 ? '9+' : notificationCount}
                </TextDs>
              </FlexView>
            )}
          </TouchableOpacity>

          <Avatar
            imageUri={userAvatar}
            initials={userInitials}
            size="sm"
            onPress={handleProfilePress}
          />
        </FlexView>
      </FlexView>
    );
  }

  // Player header
  return (
    <FlexView
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      padding={spacing.sm}
      borderRadius={borderRadius.full}
      mx={spacing.base}
      mt={spacing.base}
      height={44}
      backgroundColor={colors.primaryDark}
      zIndex={9999}
    >
      {/* Logo */}
      <FlexView flexDirection="row">
        <FlexView
          ml={spacing.sm}
          mr={spacing.md}
          height="100%"
          alignItems="center"
          justifyContent="center"
        >
          <ImageDs image="WhiteLogo" size={26} fit="contain" />
        </FlexView>

        {/* Location Dropdown (only for player) */}
        <FlexView flexDirection="row" alignItems="center" gap={spacing.sm}>
          <TouchableOpacity
            onPress={toggleLocationDropdown}
            style={styles.locationButton}
            activeOpacity={0.7}
          >
            <TextDs size={14} weight="regular" color="white">
              {selectedLocation}
            </TextDs>
            <ChevronDown color={colors.text.white} size={20} />
          </TouchableOpacity>

          {/* Dropdown Menu */}
          {showLocationDropdown && (
            <FlexView animation="fade-down" style={styles.dropdown}>
              {locations.map((loc: string) => (
                <TouchableOpacity
                  key={loc}
                  style={[
                    styles.dropdownItem,
                    loc === selectedLocation && styles.dropdownItemActive,
                  ]}
                  onPress={() => selectLocation(loc)}
                  activeOpacity={0.7}
                >
                  <TextDs
                    style={[
                      styles.dropdownItemText,
                      loc === selectedLocation && styles.dropdownItemTextActive,
                    ]}
                  >
                    {loc}
                  </TextDs>
                </TouchableOpacity>
              ))}
            </FlexView>
          )}
        </FlexView>
      </FlexView>

      {/* Right Section */}
      <FlexView style={styles.rightSection}>
        <TouchableOpacity
          onPress={handleSearchPress}
          style={styles.searchButton}
          activeOpacity={0.7}
        >
          <ImageDs image="Search" style={styles.customIcon} />
        </TouchableOpacity>

        {isAuthenticated ? (
          <>
            <TouchableOpacity
              onPress={handleNotificationPress}
              style={styles.notificationButton}
              activeOpacity={0.7}
            >
              <ImageDs image="Bell" style={styles.customIcon} />
              {notificationCount !== undefined && notificationCount > 0 && (
                <FlexView style={styles.badge}>
                  <TextDs size={10} weight="semibold" color="white">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </TextDs>
                </FlexView>
              )}
            </TouchableOpacity>

            <Avatar
              imageUri={userAvatar}
              initials={userInitials}
              size="sm"
              onPress={handleProfilePress}
            />
          </>
        ) : (
          <TouchableOpacity
            onPress={handleSignUpPress}
            style={styles.signUpButton}
            activeOpacity={0.8}
          >
            <TextDs style={styles.signUpText}>Sign Up</TextDs>
          </TouchableOpacity>
        )}
      </FlexView>
    </FlexView>
  );
};
