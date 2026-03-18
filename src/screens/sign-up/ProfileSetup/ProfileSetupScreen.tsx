import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Info, Plus } from 'lucide-react-native';
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
import { images } from '@assets/images';

type ProfileSetupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProfileSetup'
>;

const ProfileSetupScreenContent: React.FC = () => {
  const navigation = useNavigation<ProfileSetupScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const [organiserStep, setOrganiserStep] = React.useState<1 | 2>(1);
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
    confirmPassword,
    setConfirmPassword,
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
    showAdditionalSport,
    setShowAdditionalSport,
    additionalSportText,
    setAdditionalSportText,
    avatar,
    isLoading,
    handleCompleteSignUp,
    handleAvatarSelect,
    handleDateChange,
  } = useProfileSetupContext();

  const { data: filterOptions } = useFilterOptions();

  // Sport value → ImageKey string lookup for dropdown icons
  const sportIconLookup: Record<string, string> = {
    'tennis': 'tennisBlue',
    'badminton': 'badmintonBlue',
    'basketball': 'basketballBlue',
    'padel': 'padelBlue',
    'football': 'footballBlue',
    'cricket': 'cricketBlue',
    'indoor-cricket': 'indoorCricketBlue',
    'pilates': 'pilatesBlue',
    'running': 'runningBlue',
    'table-tennis': 'tableTennisBlue',
    'pickleball': 'pickleballBlue'
  };

  // Transform API sports data to Dropdown option format
  // We merge with a local PRIMARY_SPORTS list to ensure all 11+ sports 
  // are always available even if the backend is selective.
  const dynamicSportOptions = React.useMemo(() => {
    const PRIMARY_SPORTS = [
      'Padel', 'Badminton', 'Cricket', 'Indoor Cricket', 'Pickleball',
      'Tennis', 'Football', 'Table-tennis', 'Pilates', 'Basketball',
      'Running'
    ];

    const backendSports = filterOptions?.sports || [];
    const combinedSports = [...PRIMARY_SPORTS];

    backendSports.forEach(bs => {
      if (!combinedSports.some(cs => cs.toLowerCase() === bs.toLowerCase())) {
        combinedSports.push(bs);
      }
    });

    return combinedSports.map(sport => {
      const sportValue = sport.toLowerCase().replace(/\s+/g, '-');
      // Normalize value for icon lookup
      const lookupKey = sportValue === 'table-tennis' ? 'table-tennis' : sportValue;
      const iconKey = sportIconLookup[lookupKey] || sportIconLookup[sport.toLowerCase()];

      return {
        label: sport,
        value: sportValue,
        icon: iconKey || 'basketballBlue',
        color: '#3D6F92',
      };
    }).sort((a, b) => {
      const indexA = PRIMARY_SPORTS.indexOf(a.label);
      const indexB = PRIMARY_SPORTS.indexOf(b.label);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.label.localeCompare(b.label);
    });
  }, [filterOptions]);

  // Transform API locations data to Dropdown option format for City
  const cityOptions = React.useMemo(() => {
    if (!filterOptions?.locations?.length) {
      return [];
    }

    const transformedOptions = filterOptions.locations.map((location: string) => ({
      label: location,
      value: location,
    }));

    // Remove duplicates by value
    return transformedOptions.filter(
      (option: { label: string; value: string }, index: number, self: { label: string; value: string }[]) =>
        index === self.findIndex((t: { label: string; value: string }) => t.value === option.value)
    );
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

  // Step-1 validation for the organiser "Continue" button
  const handleOrganiserContinue = () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }
    if (!yourBest) {
      Alert.alert('Error', 'Please select your role');
      return;
    }
    if (!communityName.trim()) {
      Alert.alert('Error', 'Please enter your community name');
      return;
    }
    if (!yourCity.trim()) {
      Alert.alert('Error', 'Please select your city');
      return;
    }
    setOrganiserStep(2);
  };

  // Back arrow handler — go to step 1 for organisers on step 2, otherwise navigate back
  const handleBackPress = () => {
    if (userType === 'organiser' && organiserStep === 2) {
      setOrganiserStep(1);
    } else {
      navigation.goBack();
    }
  };

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
          <ArrowIcon variant="left" onClick={handleBackPress} />

          {/* Avatar Upload */}
          <FlexView style={{ marginBottom: spacing.xxl }}>
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
          </FlexView>

          {/* Form Fields */}
          <FlexView style={styles.formContainer}>
            {/* Full Name - shown on step 1 for organisers, always for players */}
            {(userType === 'player' || organiserStep === 1) && (
              <FormInput
                label="Full Name"
                placeholder="Amalya Rogers"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            )}

            {/* Email or Phone Number - show the opposite of what was used for signup (player only; organiser has it in step 1) */}
            {userType === 'player' && (
              initialPhoneNumber ? (
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
              )
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
                {/* ─── ORGANISER STEP 1 ─── */}
                {organiserStep === 1 && (
                  <>
                    {/* Role - pill toggles */}
                    <FlexView gap={spacing.sm}>
                      <TextDs size={14} weight="semibold">What Describes you best</TextDs>
                      <FlexView row gap={spacing.sm}>
                        {(['Organiser', 'Coach', 'Club'] as const).map((role) => (
                          <TouchableOpacity
                            key={role}
                            onPress={() => setYourBest(role === 'Coach' ? 'coach' : role === 'Club' ? 'club' : 'Organiser')}
                            style={[
                              styles.rolePill,
                              yourBest === (role === 'Coach' ? 'coach' : role === 'Club' ? 'club' : 'Organiser') && styles.rolePillActive,
                            ]}
                            activeOpacity={0.7}
                          >
                            <TextDs
                              size={12}
                              weight="medium"
                              color={yourBest === (role === 'Coach' ? 'coach' : role === 'Club' ? 'club' : 'Organiser') ? 'white' : 'tertiary'}
                            >
                              {role}
                            </TextDs>
                          </TouchableOpacity>
                        ))}
                      </FlexView>
                    </FlexView>

                    {/* Community Name */}
                    <FormInput
                      label="Community Name"
                      placeholder="Enter your community or organization name"
                      value={communityName}
                      onChangeText={setCommunityName}
                    />

                    {/* Email or Phone Number - show the opposite of what was used for signup */}
                    {initialPhoneNumber ? (
                      <FormInput
                        label="Email"
                        placeholder="For your invoices/reminders"
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

                    {/* City */}
                    <Dropdown
                      label="Your City"
                      placeholder="Select where you will be hosting events"
                      options={cityOptions}
                      value={yourCity}
                      onSelect={setYourCity}
                    />
                  </>
                )}

                {/* ─── ORGANISER STEP 2 ─── */}
                {organiserStep === 2 && (
                  <>
                    {/* Primary Sport and Secondary Sport */}
                    <FlexView gap={spacing.base}>
                      <FlexView>
                        <FlexView style={styles.labelRow}>
                          <TextDs size={14} weight="semibold">Sport 1</TextDs>
                          {!showAdditionalSport && (
                            <TouchableOpacity
                              style={styles.addSportButton}
                              onPress={() => setShowAdditionalSport(true)}
                              activeOpacity={0.7}
                            >
                              <Plus size={14} color={colors.text.white} />
                              <TextDs style={styles.addSportButtonText}>Add Sport</TextDs>
                            </TouchableOpacity>
                          )}
                        </FlexView>
                        <Dropdown
                          placeholder="Select Sport"
                          options={primarySportOptions}
                          value={primarySport}
                          onSelect={setPrimarySport}
                        />
                      </FlexView>

                      <Dropdown
                        label="Sport 2"
                        placeholder="Select Sport"
                        options={secondarySportOptions}
                        value={secondarySport}
                        onSelect={setSecondarySport}
                      />
                    </FlexView>

                    {/* Additional Sport Text Field (shown when "Add Sport" is clicked) */}
                    {showAdditionalSport && (
                      <FormInput
                        label="Additional Sport"
                        placeholder="Enter another sport (e.g. Golf)"
                        value={additionalSportText}
                        onChangeText={setAdditionalSportText}
                      />
                    )}

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

                    {/* Password */}
                    <FormInput
                      label="Password"
                      placeholder="Set an 8 digit password"
                      value={password}
                      onChangeText={setPassword}
                      isPassword
                    />

                    {/* Confirm Password */}
                    <FormInput
                      label="Re Enter"
                      placeholder="Re enter the above set password"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      isPassword
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
              </>
            )}
          </FlexView>
        </ScrollView>

      </KeyboardAvoidingView>

      {/* Footer Button - outside KeyboardAvoidingView so it stays fixed */}
      <FlexView style={[styles.footer, { paddingBottom: spacing.xl + insets.bottom }]}>
        {userType === 'organiser' && organiserStep === 1 ? (
          <TouchableOpacity
            onPress={handleOrganiserContinue}
            style={styles.confirmButton}
            activeOpacity={0.8}
          >
            <TextDs style={styles.confirmButtonText}>Continue</TextDs>
          </TouchableOpacity>
        ) : (
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
        )}
      </FlexView>
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
