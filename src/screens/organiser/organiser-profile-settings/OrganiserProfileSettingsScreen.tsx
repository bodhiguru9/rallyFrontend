import React, { useState, useEffect } from 'react';
import { TextDs, FlexView } from '@components';
import { ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '@store';
import type { RootStackParamList } from '@navigation';
import { ProfileHeader, ProfileSection, ProfileMenuItem, Toggle } from '@components/global';
import { images } from '@assets/images';
import { getUserInitials } from '@utils';
import { DeleteAccountModal } from './components/DeleteAccountModal';
import { ChangePasswordModal } from '../organiser-settings/components/ChangePasswordModal';
import { useUpdateProfile } from '@hooks/use-update-profile';
import { styles } from './style/OrganiserProfileSettingsScreen.styles';

type OrganiserProfileSettingsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrganiserProfileSettings'
>;

export const OrganiserProfileSettingsScreen: React.FC = () => {
  const navigation = useNavigation<OrganiserProfileSettingsNavigationProp>();
  const { user, logout } = useAuthStore();
  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const { updateProfile } = useUpdateProfile();

  // Initialize toggle state from user profile only once
  useEffect(() => {
    if (user?.profileVisibility && isPrivateAccount !== (user.profileVisibility === 'private')) {
      // Use queueMicrotask to defer state update outside of current render cycle
      queueMicrotask(() => {
        setIsPrivateAccount(user.profileVisibility === 'private');
      });
    }
  }, [user?.profileVisibility, isPrivateAccount]);

  const handlePrivateAccountToggle = async (value: boolean) => {
    setIsPrivateAccount(value);
    await updateProfile({
      profileVisibility: value ? 'private' : 'public',
    });
  };

  if (!user) {
    return null;
  }

  const sports = [
    { name: user.sport1, icon: 'activity' },
    ...(user.sport2 ? [{ name: user.sport2, icon: 'activity' }] : []),
  ];

  const handleSignOut = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          imageUri={user.profilePic as string}
          initials={getUserInitials(user.fullName)}
          name={user.fullName}
          sports={sports}
          onEditProfile={() => navigation.navigate('OrganiserProfileEdit')}
        />

        <Pressable style={styles.upgradeCard} onPress={() => navigation.navigate('OrganiserSubscription')}>
          <FlexView style={styles.upgradeIcon}>
            <TextDs style={styles.upgradeIconText}>★</TextDs>
          </FlexView>
          <FlexView style={styles.upgradeContent}>
            <TextDs style={styles.upgradeTitle}>Upgrade to Premium</TextDs>
            <TextDs style={styles.upgradeSubtitle}>
              Unlock premium features, bulk packages and extra premium tools
            </TextDs>
          </FlexView>
          <TextDs style={styles.upgradeArrow}>›</TextDs>
        </Pressable>

        <ProfileSection title="PROFILE">
          <ProfileMenuItem
            iconImage={images.personEdit}
            title="Edit Profile"
            onPress={() => navigation.navigate('OrganiserProfileEdit')}
          />
          <ProfileMenuItem
            iconImage={images.colorPalette}
            title="Preferences"
            onPress={() => navigation.navigate('Preferences')}
          />
          <ProfileMenuItem
            iconImage={images.fallingCoins}
            title="Packages"
            onPress={() => navigation.navigate('OrganiserPackages')}
          />
        </ProfileSection>

        <ProfileSection title="ACCOUNTS">
          <ProfileMenuItem
            iconImage={images.key}
            title="Password"
            onPress={() => setChangePasswordModalVisible(true)}
          />
          <ProfileMenuItem
            iconImage={images.creditCard}
            title="Bank Details"
            onPress={() => navigation.navigate('OrganiserBankDetails')}
          />
          <ProfileMenuItem
            iconImage={images.barcodeReceipt}
            title="Subscription"
            onPress={() => navigation.navigate('OrganiserSubscription')}
          />
          <Toggle
            label="Private Account"
            description="(Toggle-off for public)"
            value={isPrivateAccount}
            onValueChange={handlePrivateAccountToggle}
            containerStyle={styles.toggleRow}
          />
        </ProfileSection>

        <ProfileSection title="LEGAL INFORMATION">
          <ProfileMenuItem
            iconImage={images.faq}
            title="FAQ's"
            onPress={() => { }}
          />
          <ProfileMenuItem
            icon="file-text"
            title="Terms & Conditions"
            onPress={() => { }}
          />
          <ProfileMenuItem
            iconImage={images.headset}
            title="Contact Us"
            onPress={() => { }}
          />
          <ProfileMenuItem
            iconImage={images.trashBin}
            title="Delete Account"
            onPress={() => setDeleteAccountModalVisible(true)}
          />
        </ProfileSection>

        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <TextDs style={styles.signOutText}>Sign Out</TextDs>
        </Pressable>
      </ScrollView>

      <DeleteAccountModal
        visible={deleteAccountModalVisible}
        onClose={() => setDeleteAccountModalVisible(false)}
        onDeleteSuccess={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
          });
        }}
      />

      <ChangePasswordModal
        visible={changePasswordModalVisible}
        onClose={() => setChangePasswordModalVisible(false)}
        onForgotPassword={() => {
          setChangePasswordModalVisible(false);
          navigation.navigate('ForgotPassword');
        }}
      />
    </SafeAreaView>
  );
};
