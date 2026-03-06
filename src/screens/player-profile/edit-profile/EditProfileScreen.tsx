import React, { useState, useEffect, useRef } from 'react';
import { TextDs,  FlexView } from '@components';
import {ScrollView, TouchableOpacity, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '@store';
import { colors } from '@theme';
import { sportOptions } from '@data';
import { useUpdateProfile } from '@hooks/use-update-profile';
import { logger } from '@dev-tools/logger';
import {
  FormInput,
  Select,
  DateInput,
  UpdateableField,
  SportDisplay,
  UpdateNumberModal,
  VerifyOTPModal,
} from '@components/global';
import type { RootStackParamList } from '@navigation';
import { styles } from './style/EditProfileScreen.styles';

type EditProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'EditProfile'
>;

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

// Convert sport options to include display names
const getSportLabel = (value: string): string => {
  const sport = sportOptions.find(s => s.value === value);
  return sport ? sport.label : value;
};

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const { user } = useAuthStore();
  const { updateProfile, isLoading } = useUpdateProfile();

  // Helper function to normalize sport value (handle both value format and label format)
  const normalizeSportValue = (sport: string | undefined): string => {
    if (!sport) {return '';}
    // Check if it's already a valid value in sportOptions
    const foundSport = sportOptions.find(
      s => s.value === sport || s.value.toLowerCase() === sport.toLowerCase() || s.label.toLowerCase() === sport.toLowerCase()
    );
    return foundSport ? foundSport.value : sport;
  };

  // Initialize sports from user data - prioritize sport1/sport2, fallback to sports array
  const getInitialSports = () => {
    const userSports = user?.sports || [];
    const primary = user?.sport1 
      ? normalizeSportValue(user.sport1) 
      : (userSports[0] ? normalizeSportValue(userSports[0]) : '');
    const secondary = user?.sport2 
      ? normalizeSportValue(user.sport2) 
      : (userSports[1] ? normalizeSportValue(userSports[1]) : '');
    // Additional sports are from index 2 onwards (up to 3 more)
    const additional = userSports.slice(2, 5).map(s => normalizeSportValue(s)).filter(Boolean);
    return { primary, secondary, additional };
  };

  const initialSports = getInitialSports();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
    user?.dob ? new Date(user.dob) : undefined
  );
  const [gender, setGender] = useState<string>(user?.gender || '');
  const [whatsappNumber, setWhatsappNumber] = useState(user?.mobileNumber || '');
  const [email, setEmail] = useState(user?.email || '');
  const [primarySport, setPrimarySport] = useState<string>(initialSports.primary);
  const [sport2, setSport2] = useState<string>(initialSports.secondary);
  const [additionalSports, setAdditionalSports] = useState<string[]>(initialSports.additional);
  const [showPrimarySportSelect, setShowPrimarySportSelect] = useState(false);
  const [showSport2Select, setShowSport2Select] = useState(false);
  const [showAddSportSelect, setShowAddSportSelect] = useState(false);
  const [showUpdateNumberModal, setShowUpdateNumberModal] = useState(false);
  const [showVerifyOTPModal, setShowVerifyOTPModal] = useState(false);
  const [pendingPhoneNumber, setPendingPhoneNumber] = useState<string>('');
  const prevUserIdRef = useRef(user?.id);

  // Sync form fields when user data changes
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (user && user.id !== prevUserIdRef.current) {
      prevUserIdRef.current = user.id;
      setFullName(user.fullName || '');
      setDateOfBirth(user.dob ? new Date(user.dob) : undefined);
      setGender(user.gender || '');
      setWhatsappNumber(user.mobileNumber || '');
      setEmail(user.email || '');
      
      // Update sports
      const userSports = user.sports || [];
      const primary = user.sport1 
        ? normalizeSportValue(user.sport1) 
        : (userSports[0] ? normalizeSportValue(userSports[0]) : '');
      const secondary = user.sport2 
        ? normalizeSportValue(user.sport2) 
        : (userSports[1] ? normalizeSportValue(userSports[1]) : '');
      const additional = userSports.slice(2, 5).map(s => normalizeSportValue(s)).filter(Boolean);
      
      setPrimarySport(primary);
      setSport2(secondary);
      setAdditionalSports(additional);
    }
  }, [user]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSave = async () => {
    console.log('========================================');
    console.log('🔄 [EditProfile] Save button clicked');
    console.log('========================================');

    if (!user) {
      console.log('❌ [EditProfile] No user found');
      logger.error('EditProfile - Save failed: No user found');
      return;
    }

    // Prepare sports array - combine primary, secondary, and additional sports
    const allSports: string[] = [];
    if (primarySport) {allSports.push(primarySport);}
    if (sport2) {allSports.push(sport2);}
    allSports.push(...additionalSports.filter(Boolean));

    // Format date of birth for API (ISO string format)
    const dobString = dateOfBirth ? dateOfBirth.toISOString() : undefined;

    // Log current values from user store
    console.log('📋 [EditProfile] Current User Data:');
    console.log({
      fullName: user.fullName,
      dob: user.dob,
      gender: user.gender,
      email: user.email,
      mobileNumber: user.mobileNumber,
      sport1: user.sport1,
      sport2: user.sport2,
      sports: user.sports,
    });

    // Log form values
    console.log('📝 [EditProfile] Form Values:');
    console.log({
      fullName,
      dateOfBirth: dateOfBirth?.toISOString(),
      gender,
      email,
      whatsappNumber,
      primarySport,
      sport2,
      additionalSports,
    });

    // Prepare update data - only include fields that have values
    const updateData: Record<string, any> = {};
    
    if (fullName.trim()) {
      updateData.fullName = fullName.trim();
    }
    if (dobString) {
      updateData.dob = dobString;
    }
    if (gender) {
      updateData.gender = gender;
    }
    if (email.trim()) {
      updateData.email = email.trim();
    }
    if (whatsappNumber.trim()) {
      updateData.mobileNumber = whatsappNumber.trim();
    }
    if (primarySport) {
      updateData.sport1 = primarySport;
    }
    if (sport2) {
      updateData.sport2 = sport2;
    }
    if (allSports.length > 0) {
      updateData.sports = allSports;
    }

    // Log what will be sent to API
    console.log('📤 [EditProfile] Data to be sent to API:');
    console.log(JSON.stringify(updateData, null, 2));
    logger.info('EditProfile - Preparing to update profile', {
      userId: user.userId || user.id,
      fieldsToUpdate: Object.keys(updateData),
      updateData,
    });

    // Ensure at least one field is being updated
    if (Object.keys(updateData).length === 0) {
      console.log('❌ [EditProfile] No fields to update');
      logger.warn('EditProfile - No fields changed');
      Alert.alert('Error', 'Please make at least one change before saving.');
      return;
    }

    console.log('🚀 [EditProfile] Calling updateProfile API...');
    const success = await updateProfile(updateData);
    
    if (success) {
      console.log('✅ [EditProfile] Profile updated successfully');
      logger.success('EditProfile - Profile updated successfully', {
        userId: user.userId || user.id,
        updatedFields: Object.keys(updateData),
      });
      navigation.goBack();
    } else {
      console.log('❌ [EditProfile] Profile update failed');
    }
    console.log('========================================');
  };

  const handleWhatsAppUpdate = () => {
    setShowUpdateNumberModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateNumberModal(false);
  };

  const handleSendOTP = (phoneNumber: string) => {
    // TODO: Implement OTP sending API call
    console.log('Send OTP to:', phoneNumber);
    setPendingPhoneNumber(phoneNumber);
    setShowUpdateNumberModal(false);
    setShowVerifyOTPModal(true);
  };

  const handleCloseOTPModal = () => {
    setShowVerifyOTPModal(false);
    setPendingPhoneNumber('');
  };

  const handleVerifyOTP = (otpCode: string) => {
    // TODO: Implement OTP verification API call
    console.log('Verify OTP:', otpCode, 'for phone:', pendingPhoneNumber);
    // On success, update the WhatsApp number directly
    setWhatsappNumber(pendingPhoneNumber);
    setShowVerifyOTPModal(false);
    setPendingPhoneNumber('');
    Alert.alert('Success', 'WhatsApp number updated successfully!');
  };

  const handleResendOTP = () => {
    // TODO: Implement resend OTP API call
    console.log('Resend OTP to:', pendingPhoneNumber);
    // The countdown is handled by VerifyOTPModal
  };

  const handleEmailUpdate = () => {
    // TODO: Implement Email update with OTP verification
    console.log('Update Email:', email);
  };

  const handleRemovePrimarySport = () => {
    setPrimarySport('');
  };

  const handleRemoveSport2 = () => {
    setSport2('');
  };

  const handleRemoveAdditionalSport = (index: number) => {
    setAdditionalSports(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddSport = () => {
    setShowAddSportSelect(true);
  };

  const handleSelectPrimarySport = (value: string) => {
    setPrimarySport(value);
    setShowPrimarySportSelect(false);
  };

  const handleSelectSport2 = (value: string) => {
    setSport2(value);
    setShowSport2Select(false);
  };

  const handleSelectAdditionalSport = (value: string) => {
    if (additionalSports.length < 3 && !additionalSports.includes(value)) {
      setAdditionalSports(prev => [...prev, value]);
    }
    setShowAddSportSelect(false);
  };

  const handleSportPress = (sportType: 'primary' | 'secondary') => {
    if (sportType === 'primary') {
      setShowPrimarySportSelect(true);
    } else {
      setShowSport2Select(true);
    }
  };


  // Get available sports for additional selection (exclude already selected)
  const getAvailableSportsForAdditional = () => {
    const selectedSports = [primarySport, sport2, ...additionalSports].filter(Boolean);
    return sportOptions.filter(sport => !selectedSports.includes(sport.value));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <FlexView style={styles.header}>
        <FlexView style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <TextDs style={styles.headerTitle}>Edit Profile</TextDs>
        </FlexView>
        <TouchableOpacity
          style={[styles.saveButton, isLoading && { opacity: 0.6 }]}
          onPress={handleSave}
          activeOpacity={0.7}
          disabled={isLoading}
        >
          <TextDs style={styles.saveButtonText}>{isLoading ? 'Saving...' : 'Save'}</TextDs>
        </TouchableOpacity>
      </FlexView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Edit Profile Section */}
        <FlexView style={styles.section}>
          <TextDs style={styles.sectionTitle}>Edit Profile</TextDs>

          <FormInput
            label="Full Name"
            placeholder="What should people remember you as?"
            value={fullName}
            onChangeText={setFullName}
            containerStyle={styles.inputContainer}
          />

          <DateInput
            label="Date of Birth"
            placeholder="MM/YYYY"
            value={dateOfBirth}
            onChange={setDateOfBirth}
            format="MM/YYYY"
            containerStyle={styles.inputContainer}
          />

          <Select
            label="Gender"
            placeholder="Select Gender"
            options={GENDER_OPTIONS}
            value={gender}
            onSelect={setGender}
            containerStyle={styles.inputContainer}
          />
        </FlexView>

        {/* WhatsApp Number Section */}
        <FlexView style={styles.section}>
          <UpdateableField
            title="WhatsApp Number"
            description="For you security, we will share an OTP for verification upon update."
            value={whatsappNumber}
            onChangeText={setWhatsappNumber}
            onUpdate={handleWhatsAppUpdate}
            onInputPress={handleWhatsAppUpdate}
            placeholder="+971 123 456789"
            keyboardType="phone-pad"
          />
        </FlexView>

        {/* Email ID Section */}
        <FlexView style={styles.section}>
          <UpdateableField
            title="Email ID"
            description="For you security, we will share an OTP for verification upon update."
            value={email}
            onChangeText={setEmail}
            onUpdate={handleEmailUpdate}
            placeholder="afifaakhtar@gmail.com"
            keyboardType="email-address"
          />
        </FlexView>

        {/* Contact Info Section */}
        <FlexView style={styles.section}>
          <FlexView style={styles.sectionHeader}>
            <TextDs style={styles.sectionTitle}>Contact Info</TextDs>
            <TouchableOpacity
              style={[styles.saveButtonSmall, isLoading && { opacity: 0.6 }]}
              onPress={handleSave}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <TextDs style={styles.saveButtonTextSmall}>{isLoading ? 'Saving...' : 'Save'}</TextDs>
            </TouchableOpacity>
          </FlexView>

          {primarySport ? (
            <SportDisplay
              label="Primary Sport"
              value={getSportLabel(primarySport)}
              onRemove={handleRemovePrimarySport}
              onPress={() => handleSportPress('primary')}
            />
          ) : (
            <Select
              label="Primary Sport"
              placeholder="Select Primary Sport"
              options={sportOptions}
              value={primarySport}
              onSelect={handleSelectPrimarySport}
              containerStyle={styles.inputContainer}
            />
          )}

          {showPrimarySportSelect && (
            <Select
              label="Primary Sport"
              placeholder="Select Primary Sport"
              options={sportOptions}
              value={primarySport}
              onSelect={handleSelectPrimarySport}
              containerStyle={styles.inputContainer}
              autoOpen={true}
              onModalClose={() => setShowPrimarySportSelect(false)}
            />
          )}

          {sport2 ? (
            <SportDisplay
              label="Sport 2"
              value={getSportLabel(sport2)}
              onRemove={handleRemoveSport2}
              onPress={() => handleSportPress('secondary')}
            />
          ) : (
            <Select
              label="Sport 2"
              placeholder="Select Sport 2"
              options={sportOptions.filter(s => s.value !== primarySport)}
              value={sport2}
              onSelect={handleSelectSport2}
              containerStyle={styles.inputContainer}
            />
          )}

          {showSport2Select && (
            <Select
              label="Sport 2"
              placeholder="Select Sport 2"
              options={sportOptions.filter(s => s.value !== primarySport)}
              value={sport2}
              onSelect={handleSelectSport2}
              containerStyle={styles.inputContainer}
              autoOpen={true}
              onModalClose={() => setShowSport2Select(false)}
            />
          )}

          {additionalSports.map((sport, index) => (
            <SportDisplay
              key={index}
              label={`Sport ${index + 3}`}
              value={getSportLabel(sport)}
              onRemove={() => handleRemoveAdditionalSport(index)}
              onPress={() => {
                // Allow changing additional sports
                const availableSports = getAvailableSportsForAdditional();
                if (availableSports.length > 0) {
                  // TODO: Implement change sport functionality
                }
              }}
            />
          ))}

          {showAddSportSelect && (
            <Select
              label="Add Another Sport"
              placeholder="Select Sport"
              options={getAvailableSportsForAdditional()}
              value=""
              onSelect={handleSelectAdditionalSport}
              containerStyle={styles.inputContainer}
              autoOpen={true}
              onModalClose={() => setShowAddSportSelect(false)}
            />
          )}

          {additionalSports.length < 3 && !showAddSportSelect && (
            <TouchableOpacity
              style={styles.addSportButton}
              onPress={handleAddSport}
              activeOpacity={0.7}
            >
              <Plus size={16} color={colors.primary} />
              <TextDs style={styles.addSportText}>Add Another Sport</TextDs>
            </TouchableOpacity>
          )}
        </FlexView>
      </ScrollView>

      {/* Update Number Modal */}
      <UpdateNumberModal
        visible={showUpdateNumberModal}
        onClose={handleCloseUpdateModal}
        onSendOTP={handleSendOTP}
        initialValue={whatsappNumber.replace(/^\+\d+\s/, '')} // Remove country code for initial value
      />

      {/* Verify OTP Modal */}
      <VerifyOTPModal
        visible={showVerifyOTPModal}
        onClose={handleCloseOTPModal}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
        phoneNumber={pendingPhoneNumber}
      />
    </SafeAreaView>
  );
};

 
