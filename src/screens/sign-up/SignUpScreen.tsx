import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing } from '@theme';
import {
  WhatsAppInput,
  FormInput,
  SocialLoginButtons,
  UserTypeSelector,
  TextDs,
  ImageDs,
} from '@components';
import type { RootStackParamList } from '@navigation';
import { useSignUp } from '@hooks';
import { useRouteProtection } from '@hooks/use-navigation-guard';
import { styles } from './style/SignUpScreen.styles';
import { ArrowIcon } from '@components/global/ArrowIcon';
import { FlexView } from '@designSystem/atoms/FlexView';

type TSignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
type SignUpNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

export const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<TSignUpScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const handleTermsPress = () => {
    navigation.navigate('TermsAndConditions');
  };

  // Redirect authenticated users to Home so they cannot access sign-up
  useRouteProtection('SignUp');

  const {
    userType,
    setUserType,
    phoneNumber,
    setPhoneNumber,
    email,
    setEmail,
    useEmail,
    isLoading,
    handleSignUp,
    handleUseEmail,
    handleUseWhatsApp,
    handleSocialLogin,
    handleSignIn,
  } = useSignUp();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.cream} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.contentContainer, { flexGrow: 1 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <ArrowIcon onClick={() => navigation.goBack()} variant="left" />

          {/* Logo Section */}
          <FlexView
            width={'100%'}
            alignItems="center"
            justifyContent="center"
            marginTop={48}
            marginBottom={58}
          >
            <ImageDs
              image="BlackBigLogo"
              style={{ width: 150, height: 57 }}
              fit="contain"
            />
          </FlexView>

          {/* Main Content */}
          <FlexView style={styles.mainContent}>
            <FlexView
              width={'100%'}
              marginBottom={spacing.lg}
              alignItems="center"
              justifyContent="center"
              gap={spacing.sm}
            >
              <TextDs size={20} weight="bold">Find your Sports Community</TextDs>
              <TextDs size={16} weight="regular" color="secondary">
                Sign in or sign up below
              </TextDs>
            </FlexView>

            {/* User Type Selector */}
            <UserTypeSelector selectedType={userType} onSelectType={setUserType} />

            {/* WhatsApp Input */}
            {!useEmail && (
              <WhatsAppInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                onUseEmailPress={handleUseEmail}
              />
            )}

            {/* email login */}
            {useEmail && (
              <FlexView style={styles.emailContainer}>
                <FlexView style={styles.labelRow}>
                  <TextDs size={14} weight="medium" color="primary">Email</TextDs>
                  <TouchableOpacity
                    onPress={handleUseWhatsApp}
                    style={styles.whatsappLink}
                    activeOpacity={0.7}
                  >
                    <ImageDs image="WhatsappIcon" size={12} />
                    <TextDs size={12} weight="medium" color="primary">Use WhatsApp</TextDs>
                  </TouchableOpacity>
                </FlexView>
                <FormInput
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  containerStyle={styles.inputContainer}
                />
              </FlexView>
            )}

            {/* Social Login Buttons */}
            <SocialLoginButtons
              onGooglePress={() => handleSocialLogin('google')}
              onApplePress={() => handleSocialLogin('apple')}
              onFacebookPress={() => handleSocialLogin('facebook')}
            />
          </FlexView>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Confirm Button */}
      <FlexView style={[styles.footer, { paddingBottom: 10 + insets.bottom }]}>
        <FlexView width={"100%"} mb={32} row alignItems='center' justifyContent='center'>
          <TextDs size={16} weight="regular" color="secondary">Already have an account? </TextDs>
          <TouchableOpacity onPress={handleSignIn} activeOpacity={0.7}>
            <TextDs size={16} weight="medium" color="blueGray">Sign in</TextDs>
          </TouchableOpacity>
        </FlexView>
        {/* Terms & Conditions */}
        <FlexView style={styles.termsContainer}>
          <TextDs size={10} weight="regular" color="tertiary">By registering you are accepting our </TextDs>
          <TouchableOpacity onPress={handleTermsPress} activeOpacity={0.7}>
            <TextDs size={10} weight="medium" color="blueGray">Terms & Conditions</TextDs>
          </TouchableOpacity>
        </FlexView>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.confirmButton, isLoading && styles.confirmButtonDisabled]}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.text.white} />
          ) : (
            <TextDs size={16} weight="semibold" color="white">Confirm</TextDs>
          )}
        </TouchableOpacity>
      </FlexView>
    </SafeAreaView>
  );
};
