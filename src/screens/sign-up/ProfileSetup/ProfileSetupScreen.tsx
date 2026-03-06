import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Info } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { borderRadius, colors, spacing } from '@theme';
import {
  AvatarUpload,
  FormInput,
  DateInput,
  TextArea,
  TextDs,
  ImageDs,
} from '@components';
import { Dropdown } from '@designSystem/molecules/dropdown';
import type { RootStackParamList } from '@navigation';
import { ProfileSetupProvider, useProfileSetupContext } from './context/ProfileSetup.context';
import { styles } from './style/ProfileSetupScreen.styles';
import { genderOptions, sportOptions, yourBestOptions, profileVisibilityOptions } from '@data';
import { ArrowIcon } from '@components/global/ArrowIcon';
import { showImagePickerOptions } from '@utils';
import { FlexView } from '@designSystem/atoms/FlexView';
import { useFilterOptions } from '@hooks';

type ProfileSetupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProfileSetup'
>;

const ProfileSetupScreenContent: React.FC = () => {
  const navigation = useNavigation<ProfileSetupScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const {
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
    initialPhoneNumber,
    userType,
    fullName,
    setFullName,
    password,
    setPassword,
    // Player-specific
    dateOfBirth,
    gender,
    setGender,
    // Organiser-specific
    yourBest,
    setYourBest,
    communityName,
    setCommunityName,
    yourCity,
    setYourCity,
    additionalSports,
    setAdditionalSports,
    bio,
    setBio,
    instagramLink,
    setInstagramLink,
    profileVisibility,
    setProfileVisibility,
    // Common
    primarySport,
    setPrimarySport,
    secondarySport,
    setSecondarySport,
    avatar,
    isLoading,
    handleCompleteSignUp,
    handleAvatarSelect,
    handleDateChange,
  } = useProfileSetupContext();

  const { data: filterOptions } = useFilterOptions();

  // Transform API sports data to Dropdown option format
  const dynamicSportOptions = React.useMemo(() => {
    if (!filterOptions?.sports) {
      return sportOptions; // Fallback to hardcoded options
    }

    // Transform and deduplicate to prevent duplicate keys
    const transformedOptions = filterOptions.sports.map((sport: string) => ({
      label: sport,
      value: sport.toLowerCase().replace(/\s+/g, '-'), // Convert "Table-tennis" to "table-tennis"
    }));

    // Remove duplicates by value
    const uniqueOptions = transformedOptions.filter(
      (option: { label: string; value: string }, index: number, self: { label: string; value: string }[]) =>
        index === self.findIndex((t: { label: string; value: string }) => t.value === option.value)
    );

    return uniqueOptions;
  }, [filterOptions]);

  // Primary sport options: exclude secondary sport so it does not appear in primary dropdown
  const primarySportOptions = React.useMemo(
    () =>
      secondarySport
        ? dynamicSportOptions.filter((opt) => opt.value !== secondarySport)
        : dynamicSportOptions,
    [dynamicSportOptions, secondarySport]
  );

  // Secondary sport options: exclude primary sport so it does not appear in secondary dropdown
  const secondarySportOptions = React.useMemo(
    () =>
      primarySport
        ? dynamicSportOptions.filter((opt) => opt.value !== primarySport)
        : dynamicSportOptions,
    [dynamicSportOptions, primarySport]
  );

  // Additional sports options: exclude primary and secondary so they are not duplicated
  const additionalSportOptions = React.useMemo(
    () =>
      dynamicSportOptions.filter(
        (opt) => opt.value !== primarySport && opt.value !== secondarySport
      ),
    [dynamicSportOptions, primarySport, secondarySport]
  );

  const getInitials = (name: string): string => {
    if (!name || name.trim().length === 0) {
      return 'AR'; // Default initials
    }

    // Split by space and filter out empty strings (handles multiple spaces)
    const parts = name.trim().split(/\s+/).filter(part => part.length > 0);

    if (parts.length >= 2) {
      // Get first letter of first and second name
      const firstInitial = parts[0][0] || '';
      const secondInitial = parts[1][0] || '';
      return `${firstInitial}${secondInitial}`.toUpperCase();
    }

    // If only one name, use first two characters
    const trimmedName = name.trim();
    if (trimmedName.length >= 2) {
      return trimmedName.substring(0, 2).toUpperCase();
    }

    // If name is too short, pad with first character
    return trimmedName.substring(0, 1).toUpperCase().padEnd(2, trimmedName[0] || 'A');
  };

  // Wrapper for avatar press - opens image picker
  const handleAvatarPress = async () => {
    const result = await showImagePickerOptions();
    if (result) {
      handleAvatarSelect(result.uri);
    }
  };

  // Wrapper for date change (component passes Date, hook expects string)
  const handleDateSelect = (date: Date) => {
    // Convert Date to YYYY-MM-DD format for API (use local date, not UTC)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    handleDateChange(formattedDate);
  };

  // Convert string dateOfBirth to Date for component (parse as local date to avoid timezone issues)
  const dateValue = dateOfBirth ? (() => {
    const [year, month, day] = dateOfBirth.split('-').map(Number);
    return new Date(year, month - 1, day);
  })() : undefined;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.cream} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <ArrowIcon variant="left" onClick={() => navigation.goBack()} />

          {/* Avatar Upload */}
          <AvatarUpload
            initials={getInitials(fullName)}
            imageUri={avatar || undefined}
            onPress={handleAvatarPress}
            size="xxxl"
          />
          {userType === 'organiser' && (
            <TextDs size={12} weight="regular" color="blueGray" style={styles.avatarRequiredHint}>
              Profile photo is required for organisers
            </TextDs>
          )}

          {/* Form Fields */}
          <FlexView style={styles.formContainer}>
            {/* Full Name */}
            <FormInput
              label="Full Name"
              placeholder="Amalya Rogers"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />

            {/* Email or Phone Number - show the opposite of what was used for signup */}
            {initialPhoneNumber ? (
              <FormInput
                label="Email"
                placeholder="your.email@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <FormInput
                label="Whatsapp Number"
                placeholder="+91 98765 43210"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            )}

            {/* Conditional Fields Based on User Type */}
            {userType === 'player' ? (
              <>
                <FlexView style={styles.row}>
                  <FlexView style={styles.halfWidth}>
                    <DateInput
                      label="Date of Birth"
                      placeholder="DD/MM/YYYY"
                      value={dateValue}
                      onChange={handleDateSelect}
                      format="DD/MM/YYYY"
                    />
                  </FlexView>
                  <FlexView style={styles.halfWidth}>
                    <Dropdown
                      label="Gender"
                      placeholder="Select Gender"
                      options={genderOptions}
                      value={gender}
                      onSelect={(value) => setGender(value as 'male' | 'female' | 'other')}
                    />
                  </FlexView>
                </FlexView>

                {/* Password */}
                <FormInput
                  label="Password"
                  placeholder="Set an 8 digit password"
                  value={password}
                  onChangeText={setPassword}
                  isPassword
                />

                {/* Primary Sport and Secondary Sport Row */}
                <FlexView style={styles.row}>
                  <FlexView style={styles.halfWidth}>
                    <Dropdown
                      label="Primary Sport"
                      placeholder="Select Sport"
                      options={primarySportOptions}
                      value={primarySport}
                      onSelect={setPrimarySport}
                    />
                  </FlexView>
                  <FlexView style={styles.halfWidth}>
                    <Dropdown
                      label="Secondary Sport"
                      placeholder="Select Sport"
                      options={secondarySportOptions}
                      value={secondarySport}
                      onSelect={setSecondarySport}
                    />
                  </FlexView>
                </FlexView>

                {/* Info Text */}
                <FlexView width={"100%"} alignItems='center' justifyContent='center'>
                  <FlexView
                    alignSelf="flex-start"
                    borderRadius={borderRadius.sm}
                    backgroundColor={colors.glass.background.white}
                    borderWidth={1}
                    borderColor="white"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    gap={spacing.xs}
                  >
                    <ImageDs image="InfoIcon" size={16} />
                    <TextDs size={10} weight="regular" color="blueGray">
                      The more we know, the better we connect you with events you enjoy.
                    </TextDs>
                  </FlexView>
                </FlexView>
              </>
            ) : (
              <>
                {/* Organiser-Specific Fields */}
                <Dropdown
                  label="You are best described as"
                  placeholder="Select Role"
                  options={yourBestOptions}
                  value={yourBest}
                  onSelect={(value) => setYourBest(value as 'Organiser' | 'coach' | 'club')}
                />

                {/* Community Name */}
                <FormInput
                  label="Community Name"
                  placeholder="Enter your community or organization name"
                  value={communityName}
                  onChangeText={setCommunityName}
                />

                {/* City */}
                <FormInput
                  label="City"
                  placeholder="Enter your city"
                  value={yourCity}
                  onChangeText={setYourCity}
                />

                {/* Password */}
                <FormInput
                  label="Password"
                  placeholder="Set an 8 digit password"
                  value={password}
                  onChangeText={setPassword}
                  isPassword
                />

                {/* Primary Sport and Secondary Sport Row */}
                <FlexView style={styles.row}>
                  <FlexView style={styles.halfWidth}>
                    <Dropdown
                      label="Primary Sport"
                      placeholder="Select Sport"
                      options={primarySportOptions}
                      value={primarySport}
                      onSelect={setPrimarySport}
                    />
                  </FlexView>
                  <FlexView style={styles.halfWidth}>
                    <Dropdown
                      label="Secondary Sport"
                      placeholder="Select Sport"
                      options={secondarySportOptions}
                      value={secondarySport}
                      onSelect={setSecondarySport}
                    />
                  </FlexView>
                </FlexView>

                {/* Additional Sports (Optional) */}
                <Dropdown
                  label="Additional Sports (Optional)"
                  placeholder="Select additional sports"
                  options={additionalSportOptions}
                  value={additionalSports}
                  onSelect={setAdditionalSports}
                  multiSelect
                  maxSelections={5}
                />

                {/* Bio */}
                <TextArea
                  label="Bio"
                  placeholder="Describe your community"
                  value={bio}
                  onChangeText={setBio}
                  minHeight={120}
                  maxLength={500}
                  showCharCount
                />

                {/* Instagram Link (Optional) */}
                <FormInput
                  label="Instagram Link (Optional)"
                  placeholder="https://instagram.com/yourprofile"
                  value={instagramLink}
                  onChangeText={setInstagramLink}
                  keyboardType="url"
                  autoCapitalize="none"
                />

                {/* Profile Visibility */}
                <Dropdown
                  label="Profile Visibility"
                  placeholder="Select Visibility"
                  options={profileVisibilityOptions}
                  value={profileVisibility}
                  onSelect={(value) => setProfileVisibility(value as 'public' | 'private')}
                />

                {/* Info Text */}
                <FlexView row alignItems='center'>
                  <FlexView style={styles.infoIcon}>
                    <Info size={16} color={colors.text.secondary} />
                  </FlexView>
                  <TextDs size={10}>
                    The more we know, the better we connect you with players looking for events.
                  </TextDs>
                </FlexView>
              </>
            )}
          </FlexView>
        </ScrollView>

        {/* Confirm Button */}
        <FlexView style={[styles.footer, { paddingBottom: spacing.xl + insets.bottom }]}>
          <TouchableOpacity
            onPress={handleCompleteSignUp}
            style={[
              styles.confirmButton,
              (isLoading || (userType === 'organiser' && !avatar)) && styles.confirmButtonDisabled,
            ]}
            activeOpacity={0.8}
            disabled={isLoading || (userType === 'organiser' && !avatar)}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.text.white} />
            ) : (
              <TextDs style={styles.confirmButtonText}>Confirm</TextDs>
            )}
          </TouchableOpacity>
        </FlexView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export const ProfileSetupScreen: React.FC = () => {
  return (
    <ProfileSetupProvider>
      <ProfileSetupScreenContent />
    </ProfileSetupProvider>
  );
};
