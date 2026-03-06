import React, { useState } from 'react';
import { TextDs, FlexView } from '@components';
import {
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FormInput } from '@components/global';
import { colors } from '@theme';
import type { RootStackParamList } from '@navigation';
import { styles } from './style/ChangePasswordScreen.styles';


type ChangePasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ChangePassword'
>;


export const ChangePasswordScreen: React.FC = () => {
  const navigation = useNavigation<ChangePasswordScreenNavigationProp>();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');


  const handleConfirm = () => {
    if (!currentPassword) return Alert.alert('Error', 'Please enter your current password');
    if (newPassword.length < 8) return Alert.alert('Error', 'Password must be at least 8 characters long');
    if (newPassword !== reEnterPassword) return Alert.alert('Error', 'New passwords do not match');


    Alert.alert('Success', 'Password changed successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };


  const handleForgotPassword = () => navigation.navigate('ForgotPassword');


  const isFormValid =
    currentPassword && newPassword.length >= 8 && newPassword === reEnterPassword;


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
          <TextDs style={styles.headerTitle}>Change Password</TextDs>
        </FlexView>
      </FlexView>


      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // if you have a stack header, tweak this (e.g. 60-100)
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          // helps prevent last button being hidden
          contentInsetAdjustmentBehavior="always"
        >
          <FlexView style={styles.contentContainer}>
            <FlexView style={styles.contentHeader}>
              <TextDs style={styles.title}>Password</TextDs>
              <TextDs style={styles.subtitle}>Create a new password</TextDs>
            </FlexView>


            <FlexView style={styles.inputsContainer}>
              <FormInput
                label="Enter Current Password"
                placeholder="Enter your current password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                containerStyle={styles.inputContainer}
              />


              <FormInput
                label="Create Password"
                placeholder="Enter an 8 digit password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                containerStyle={styles.inputContainer}
              />


              <FormInput
                label="Re-enter Password"
                placeholder="Enter an 8 digit password"
                value={reEnterPassword}
                onChangeText={setReEnterPassword}
                secureTextEntry
                containerStyle={styles.inputContainer}
              />
            </FlexView>


            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotPasswordContainer}
              activeOpacity={0.7}
            >
              <TextDs style={styles.forgotPasswordText}>Forgot Password?</TextDs>
            </TouchableOpacity>


            <TouchableOpacity
              style={[styles.confirmButton, isFormValid && styles.confirmButtonActive]}
              onPress={handleConfirm}
              activeOpacity={0.8}
              disabled={!isFormValid}
            >
              <TextDs
                style={[
                  styles.confirmButtonText,
                  !isFormValid && styles.confirmButtonTextDisabled,
                ]}
              >
                Confirm
              </TextDs>
            </TouchableOpacity>
          </FlexView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
