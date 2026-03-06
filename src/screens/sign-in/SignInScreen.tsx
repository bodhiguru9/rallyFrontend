import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing } from '@theme';
import { WhatsAppInput, FormInput, SocialLoginButtons, TextDs, ImageDs } from '@components';
import { useSignIn } from '@hooks/auth';
import { useRouteProtection } from '@hooks/use-navigation-guard';
import type { RootStackParamList } from '@navigation';
import { styles } from './style/SignInScreen.styles';
import { ArrowIcon } from '@components/global/ArrowIcon';
import { FlexView } from '@designSystem/atoms/FlexView';

type TSignInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;


export const SignInScreen: React.FC = () => {
  const navigation = useNavigation<TSignInScreenNavigationProp>();
  const insets = useSafeAreaInsets();

  // Redirect authenticated users to Home so they cannot access sign-in
  useRouteProtection('SignIn');

  const {
    useEmail,
    phoneNumber,
    setPhoneNumber,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleSignIn,
    handleGoogleSignIn,
    handleUseEmail,
    handleUseWhatsApp,
    handleForgotPassword,
    handleSignUp,
  } = useSignIn();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.cream} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
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
            <TextDs size={16} weight="bold">Welcome Back</TextDs>
            <TextDs size={14} weight="regular" color="secondary">
              Sign in to continue
            </TextDs>
          </FlexView>

          {/* WhatsApp/Email Input */}
          {!useEmail ? (
            <WhatsAppInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              onUseEmailPress={handleUseEmail}
            />
          ) : (
            <FlexView style={styles.emailContainer}>
              <FlexView style={styles.labelRow}>
                <TextDs style={styles.label}>Email</TextDs>
                <TouchableOpacity
                  onPress={handleUseWhatsApp}
                  style={styles.whatsappLink}
                  activeOpacity={0.7}
                >
                  <ImageDs image="WhatsappIcon" size={12} />
                  <TextDs style={styles.whatsappLinkText}>Use WhatsApp</TextDs>
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

          {/* Password Input */}
          <FormInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            containerStyle={styles.passwordContainer}
          />

          <FlexView height={24} />

          {/* Social Login Buttons */}
          <SocialLoginButtons
            onGooglePress={handleGoogleSignIn}
            onApplePress={() => Alert.alert('Coming Soon', 'Apple login will be available soon.')}
            onFacebookPress={() => Alert.alert('Coming Soon', 'Facebook login will be available soon.')}
          />

          {/* Forgot Password Link */}
          <FlexView style={styles.forgotPasswordContainer}>
            <TextDs align='center' size={14} color='secondary'>Forgot your password? </TextDs>
            <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
              <TextDs weight='medium' color="blueGray">Reset now</TextDs>
            </TouchableOpacity>
          </FlexView>
        </FlexView>
      </ScrollView>

      {/* Confirm Button */}
      <FlexView style={[styles.footer, { paddingBottom: 10 + insets.bottom }]}>
        <FlexView width={"100%"} mb={32} row alignItems='center' justifyContent='center'>
          <TextDs style={styles.signUpText}>{"Don't have an account?"} </TextDs>
          <TouchableOpacity onPress={handleSignUp} activeOpacity={0.7}>
            <TextDs style={styles.signUpLink}>Sign Up</TextDs>
          </TouchableOpacity>
        </FlexView>
        <TouchableOpacity
          onPress={handleSignIn}
          style={[styles.confirmButton, isLoading && styles.confirmButtonDisabled]}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.text.white} />
          ) : (
            <TextDs style={styles.confirmButtonText}>Sign In</TextDs>
          )}
        </TouchableOpacity>
      </FlexView>
    </SafeAreaView >
  );
};
