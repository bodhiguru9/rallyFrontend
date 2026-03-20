import React, { useEffect, useMemo, useState } from 'react';
import { TextDs,  FlexView } from '@components';
import {ActivityIndicator, Alert, ScrollView, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@store';
import { colors, spacing } from '@theme';
import { useFilterOptions } from '@hooks';
import { sportOptions } from '@data';
import { useUpdateProfile } from '@hooks/use-update-profile';
import { useUpdateProfileImage } from '@hooks/use-update-profile-image';
import { Avatar, FormInput, Select, UpdateableField } from '@components/global';
import { Dropdown } from '@designSystem/molecules/dropdown';
import { DocumentUpload } from '../create-event/components/DocumentUpload/DocumentUpload';
import { showImagePickerOptions } from '@utils/image-picker';
import { getUserInitials } from '@utils';
import { styles } from './style/OrganiserProfileEditScreen.styles';
import { userService } from '@services/user-service';

type TNav = NativeStackNavigationProp<RootStackParamList, 'OrganiserProfileEdit'>;

const normalizeSportValue = (sport: string | undefined): string => {
  if (!sport) {return '';}
  const foundSport = sportOptions.find(
    (s) =>
      s.value === sport ||
      s.value.toLowerCase() === sport.toLowerCase() ||
      s.label.toLowerCase() === sport.toLowerCase(),
  );
  return foundSport ? foundSport.value : sport;
};

export const OrganiserProfileEditScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();
  const { user } = useAuthStore();
  const userId = useAuthStore((s) => s.user?.userId || 0);
  const { updateProfile, isLoading } = useUpdateProfile();
  const { updateProfileImage, isLoading: isUpdatingImage } = useUpdateProfileImage();

  const { data: userResponse, isLoading: isLoadingUser } = useQuery({
    queryKey: ['organiser-profile-edit', userId],
    queryFn: () => userService.getUserById(userId),
    enabled: userId > 0,
  });

  const fetchedUser = userResponse?.data?.user;

  const [fullName, setFullName] = useState('');
  const [communityName, setCommunityName] = useState('');
  const [bio, setBio] = useState('');
  const [instagramLink, setInstagramLink] = useState('');

  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');

  const [sport1, setSport1] = useState<string>('');
  const [sport2, setSport2] = useState<string>('');
  const [showAdditionalSport, setShowAdditionalSport] = useState<boolean>(false);
  const [additionalSportText, setAdditionalSportText] = useState<string>('');

  const [emiratesIdFront, setEmiratesIdFront] = useState<string | null>(null);
  const [emiratesIdBack, setEmiratesIdBack] = useState<string | null>(null);

  const sportsPayload = useMemo(() => {
    const list = [sport1, sport2, additionalSportText].filter(Boolean);
    return list.length ? list : undefined;
  }, [sport1, sport2, additionalSportText]);

  const { data: filterOptions } = useFilterOptions();

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

  const primarySportOptions = React.useMemo(
    () => sport2 ? dynamicSportOptions.filter((opt) => opt.value !== sport2) : dynamicSportOptions,
    [dynamicSportOptions, sport2]
  );

  const secondarySportOptions = React.useMemo(
    () => sport1 ? dynamicSportOptions.filter((opt) => opt.value !== sport1) : dynamicSportOptions,
    [dynamicSportOptions, sport1]
  );

  useEffect(() => {
    // We defer the updates using queueMicrotask to avoid React's cascading render warning
    queueMicrotask(() => {
      // If API data is available, it should always be the source of truth for prefilling.
      if (fetchedUser) {
        setFullName(fetchedUser.fullName || '');
        setCommunityName(fetchedUser.communityName || '');
        setBio(fetchedUser.bio || '');
        setInstagramLink(fetchedUser.instagramLink || '');
        setWhatsappNumber(fetchedUser.mobileNumber || '');
        setEmail(fetchedUser.email || '');

        const s1 = fetchedUser.sport1 || fetchedUser.sports?.[0] || '';
        const s2 = fetchedUser.sport2 || fetchedUser.sports?.[1] || '';
        const s3 = fetchedUser.sports?.[2] || '';
        setSport1(normalizeSportValue(s1));
        setSport2(normalizeSportValue(s2));
        if (s3) {
          setShowAdditionalSport(true);
          setAdditionalSportText(s3);
        }
        return;
      }

      // Fallback to auth-store only if API hasn't returned yet.
      if (!fetchedUser && user) {
        setFullName(user.fullName || '');
        setCommunityName(user.communityName || '');
        setBio(user.bio || '');
        setInstagramLink((user as any).instagramLink || '');
        setWhatsappNumber(user.mobileNumber || '');
        setEmail(user.email || '');

        const s1 = user.sport1 || user.sports?.[0] || '';
        const s2 = user.sport2 || user.sports?.[1] || '';
        const s3 = user.sports?.[2] || '';
        setSport1(normalizeSportValue(s1));
        setSport2(normalizeSportValue(s2));
        if (s3) {
          setShowAdditionalSport(true);
          setAdditionalSportText(s3);
        }
      }
    });
  }, [fetchedUser, user]);

  if (!user) {return null;}

  const handleSave = async () => {
    const updateData: Record<string, any> = {
      fullName: fullName.trim(),
      communityName: communityName.trim(),
      bio: bio.trim(),
      instagramLink: instagramLink.trim(),
      sport1: sport1 || undefined,
      sport2: sport2 || undefined,
      sports: sportsPayload,
    };

    // Remove empty strings/undefined
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === '' || updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Emirates ID upload UI only (no confirmed API field yet)
    if (emiratesIdFront || emiratesIdBack) {
      console.log('[OrganiserProfileEdit] Emirates ID selected (UI only)', {
        emiratesIdFront,
        emiratesIdBack,
      });
    }

    if (Object.keys(updateData).length === 0) {
      Alert.alert('Error', 'Please make at least one change before saving.');
      return;
    }

    const success = await updateProfile(updateData);
    if (success) {
      navigation.goBack();
    }
  };

  const handleEditProfileImage = async () => {
    const imageResult = await showImagePickerOptions();
    if (imageResult && imageResult.uri) {
      await updateProfileImage(imageResult.uri);
    }
  };

  const handleUpdateWhatsApp = async () => {
    if (!whatsappNumber.trim()) {return;}
    await updateProfile({ mobileNumber: whatsappNumber.trim() });
  };

  const handleUpdateEmail = async () => {
    if (!email.trim()) {return;}
    await updateProfile({ email: email.trim() });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlexView style={styles.header}>
        <FlexView style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={22} color={colors.text.primary} />
          </TouchableOpacity>
          <TextDs style={styles.headerTitle}>Edit Profile</TextDs>
        </FlexView>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          <TextDs style={styles.saveButtonText}>{isLoading ? 'Saving...' : 'Save'}</TextDs>
        </TouchableOpacity>
      </FlexView>

      {isLoadingUser ? (
        <FlexView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </FlexView>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <FlexView style={styles.section}>
          <FlexView style={{ alignItems: 'center', marginBottom: 24, paddingVertical: 16 }}>
             <TouchableOpacity activeOpacity={0.8} onPress={handleEditProfileImage} disabled={isUpdatingImage}>
                <Avatar 
                  imageUri={user.profilePic as string} 
                  initials={getUserInitials(user.fullName)} 
                  size="xxl" 
                />
                <FlexView style={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  backgroundColor: colors.background.light,
                  padding: 6,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: colors.background.primary,
                }}>
                  <TextDs size={10} color='blueGray' weight='medium'>Edit</TextDs>
                </FlexView>
             </TouchableOpacity>
             {isUpdatingImage && (
                <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 8 }} />
              )}
          </FlexView>

          <FormInput
            label="Full Name"
            placeholder="What should people remember you as?"
            value={fullName}
            onChangeText={setFullName}
            containerStyle={styles.inputContainer}
          />

          <FormInput
            label="Community Name"
            placeholder="What should people remember you as?"
            value={communityName}
            onChangeText={setCommunityName}
            containerStyle={styles.inputContainer}
          />

          <FormInput
            label="Bio"
            placeholder="Sharing glimpses of sports"
            value={bio}
            onChangeText={setBio}
            containerStyle={styles.inputContainer}
            multiline
            style={{ minHeight: 80, textAlignVertical: 'top' }}
          />

          <FormInput
            label="Instagram Profile Link"
            placeholder="instagram url"
            value={instagramLink}
            onChangeText={setInstagramLink}
            containerStyle={styles.inputContainer}
            autoCapitalize="none"
          />

          <UpdateableField
            title="WhatsApp Number"
            description="For you security, we will share an OTP for verification upon update"
            value={whatsappNumber}
            onChangeText={setWhatsappNumber}
            onUpdate={handleUpdateWhatsApp}
            placeholder="+971 123 4567890"
            keyboardType="phone-pad"
          />

          <UpdateableField
            title="Email ID"
            description="For you security, we will share an OTP for verification upon update"
            value={email}
            onChangeText={setEmail}
            onUpdate={handleUpdateEmail}
            placeholder="email@example.com"
            keyboardType="email-address"
            editable
          />

          <FlexView style={styles.emiratesSection}>
            <FlexView style={styles.emiratesHeader}>
              <TextDs style={styles.emiratesTitle}>Emirates ID</TextDs>
              <TouchableOpacity
                style={styles.emiratesUpdateButton}
                activeOpacity={0.7}
                onPress={() => Alert.alert('Info', 'Select front/back images below.')}
              >
                <TextDs style={styles.emiratesUpdateButtonText}>Update</TextDs>
              </TouchableOpacity>
            </FlexView>
            <FlexView style={styles.emiratesRow}>
              <DocumentUpload
                label="Front"
                imageUri={emiratesIdFront}
                onImageSelect={(uri) => setEmiratesIdFront(uri)}
                onRemove={() => setEmiratesIdFront(null)}
              />
              <DocumentUpload
                label="Back"
                imageUri={emiratesIdBack}
                onImageSelect={(uri) => setEmiratesIdBack(uri)}
                onRemove={() => setEmiratesIdBack(null)}
              />
            </FlexView>
          </FlexView>

          <TextDs style={styles.sectionTitle}>Sport</TextDs>

          <FlexView gap={spacing.base} mb={spacing.lg}>
            <FlexView>
              <FlexView row justifyContent="space-between" alignItems="center" mb={spacing.xs}>
                <TextDs size={14} weight="semibold">Sport 1</TextDs>
                {!showAdditionalSport && (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: colors.primary,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 100,
                    }}
                    onPress={() => setShowAdditionalSport(true)}
                    activeOpacity={0.7}
                  >
                    <Plus size={14} color={colors.text.white} />
                    <TextDs style={{ color: colors.text.white, marginLeft: 4, fontSize: 14, fontWeight: '500' }}>Add Sport</TextDs>
                  </TouchableOpacity>
                )}
              </FlexView>
              <Dropdown
                placeholder="Select Sport"
                options={primarySportOptions}
                value={sport1}
                onSelect={setSport1}
              />
            </FlexView>

            <Dropdown
              label="Sport 2"
              placeholder="Select Sport"
              options={secondarySportOptions}
              value={sport2}
              onSelect={setSport2}
            />

            {showAdditionalSport && (
              <FlexView mt={spacing.md}>
                <FormInput
                  label="Additional Sport"
                  placeholder="Enter another sport (e.g. Golf)"
                  value={additionalSportText}
                  onChangeText={setAdditionalSportText}
                />
              </FlexView>
            )}
          </FlexView>
        </FlexView>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

