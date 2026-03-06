import React, { useState } from 'react';
import { TextDs,  FlexView } from '@components';
import {ScrollView, Pressable, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '@store';
import { colors } from '@theme';
import { ProfileHeader, ProfileSection, ProfileMenuItem } from '@components/global';
import { useDeleteAccount } from '@hooks/use-delete-account';
import { useUpdateProfileImage } from '@hooks/use-update-profile-image';
import { showImagePickerOptions } from '@utils/image-picker';
import { DeleteAccountModal } from './components/DeleteAccountModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import type { RootStackParamList } from '@navigation';
import { styles } from './style/OrganiserSettingsScreen.styles';
import { getUserInitials } from '@utils';
import { images } from '@assets/images';
import { ArrowIcon } from '@components/global/ArrowIcon';

type OrganiserSettingsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrganiserSettings'
>;

export const OrganiserSettingsScreen: React.FC = () => {
  const navigation = useNavigation<OrganiserSettingsScreenNavigationProp>();
  const { user, logout } = useAuthStore();
  const { deleteAccount, isLoading: isDeleting } = useDeleteAccount();
  const { updateProfileImage } = useUpdateProfileImage();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  if (!user) {
    return null;
  }

  // Map user sports to display format
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

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    const success = await deleteAccount();
    if (success) {
      setShowDeleteModal(false);
      // Navigate to sign in screen after successful deletion
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    }
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
    }
  };

  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
  };

  const handleCloseChangePasswordModal = () => {
    setShowChangePasswordModal(false);
  };

  const handleForgotPassword = () => {
    setShowChangePasswordModal(false);
    navigation.navigate('ForgotPassword');
  };

  const handleEditProfileImage = async () => {
    const imageResult = await showImagePickerOptions();
    if (imageResult && imageResult.uri) {
      await updateProfileImage(imageResult.uri);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with back button */}
      <FlexView style={styles.header}>
        <ArrowIcon variant='left' onClick={() => navigation.goBack()} />
      </FlexView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {/* Profile Header */}
        <ProfileHeader
          imageUri={user.profilePic as string}
          initials={getUserInitials(user.fullName)}
          name={user.fullName}
          sports={sports}
          onEditProfile={handleEditProfileImage}
          onQRCodePress={() => {
          }}
        />


        {/* PROFILE Section */}
        <ProfileSection title="PROFILE">
          <ProfileMenuItem
            iconImage={images.personEdit}
            title="Edit Profile"
            onPress={() => {
              navigation.navigate('EditProfile');
            }}
          />
          <ProfileMenuItem
            iconImage={images.colorPalette}
            title="Preferences"
            onPress={() => {
              navigation.navigate('Preferences');
            }}
          />
          <ProfileMenuItem
            iconImage={images.fallingCoins}
            title="Purchased Packages"
            onPress={() => {
              navigation.navigate('PurchasedPackages');
            }}
          />
        </ProfileSection>

        {/* ACCOUNTS Section */}
        <ProfileSection title="ACCOUNTS">
          <ProfileMenuItem
            iconImage={images.key}
            title="Change Password"
            onPress={handleChangePassword}
          />
          <ProfileMenuItem
            iconImage={images.creditCard}
            title="Payment Method"
            onPress={() => {
              navigation.navigate('PaymentMethods');
            }}
          />
          <ProfileMenuItem
            iconImage={images.barcodeReceipt}
            title="Transactions"
            onPress={() => {
              // TODO: Navigate to transactions
            }}
          />
        </ProfileSection>

        {/* LEGAL INFORMATION Section */}
        <ProfileSection title="LEGAL INFORMATION">
          <ProfileMenuItem
            iconImage={images.faq}
            title="FAQ's"
            onPress={() => {
              // TODO: Navigate to FAQ
            }}
          />
          <ProfileMenuItem
            icon="file-text"
            iconColor={colors.primary}
            title="Terms & Conditions"
            onPress={() => {
              // TODO: Navigate to terms & conditions
            }}
          />
          <ProfileMenuItem
            iconImage={images.headset}
            title="Contact Us"
            onPress={() => {
              // TODO: Navigate to contact us
            }}
          />
          <ProfileMenuItem
            iconImage={images.trashBin}
            title="Delete Account"
            onPress={handleDeleteAccount}
          />
        </ProfileSection>

        {/* Sign Out Button */}
        <Pressable
          style={({ pressed }) => [
            styles.signOutButton,
            Platform.OS === 'ios' && pressed && { opacity: 0.7 },
          ]}
          onPress={handleSignOut}
          android_ripple={{ color: `${colors.status.error}30`, borderless: false }}
        >
          <TextDs style={styles.signOutText}>Sign Out</TextDs>
        </Pressable>
      </ScrollView>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        visible={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        visible={showChangePasswordModal}
        onClose={handleCloseChangePasswordModal}
        onForgotPassword={handleForgotPassword}
      />
    </SafeAreaView>
  );
};
