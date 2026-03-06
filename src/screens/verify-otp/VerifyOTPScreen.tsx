import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing } from '@theme';
import { OTPInput, TextDs, ImageDs } from '@components';
import type { RootStackParamList } from '@navigation';
import { useVerifyOTP } from '@hooks';
import { styles } from './style/VerifyOTPScreen.styles';
import { ArrowIcon } from '@components/global/ArrowIcon';
import { FlexView } from '@designSystem/atoms/FlexView';

type TVerifyOTPScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VerifyOTP'>;

export const VerifyOTPScreen: React.FC = () => {
  const navigation = useNavigation<TVerifyOTPScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const {
    otpCode,
    setOtpCode,
    countdown,
    isLoading,
    handleVerifyOTP,
    handleResendOTP,
    handleOTPComplete,
    handleOTPFocus,
  } = useVerifyOTP();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.cream} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <ArrowIcon variant="left" onClick={() => navigation.goBack()} />

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
          <TextDs style={styles.heading}>Enter Code</TextDs>
          <TextDs style={styles.subtitle}>We have sent a code on your WhatsApp or Email.</TextDs>

          {/* OTP Input */}
          <OTPInput
            length={6}
            value={otpCode}
            onChangeText={setOtpCode}
            onComplete={handleOTPComplete}
            onFocus={handleOTPFocus}
          />

          {/* Resend Code Link - Only show after user has interacted with OTP input */}
          <TouchableOpacity
            onPress={handleResendOTP}
            style={styles.resendContainer}
            activeOpacity={countdown > 0 ? 1 : 0.7}
            disabled={countdown > 0}
          >
            <TextDs style={[styles.resendText, countdown > 0 && styles.resendTextDisabled]}>
              {countdown > 0 ? `Resend Code in ${countdown}s` : 'Resend Code'}
            </TextDs>
          </TouchableOpacity>
        </FlexView>
      </ScrollView>

      {/* Confirm Button */}
      <FlexView style={[styles.footer, { paddingBottom: spacing.xl + insets.bottom }]}>
        <TouchableOpacity
          onPress={handleVerifyOTP}
          style={[
            styles.confirmButton,
            otpCode.length === 6 && styles.confirmButtonActive,
            isLoading && styles.confirmButtonDisabled,
          ]}
          activeOpacity={0.8}
          disabled={otpCode.length !== 6 || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.text.white} />
          ) : (
            <TextDs
              style={[
                styles.confirmButtonText,
                otpCode.length !== 6 && styles.confirmButtonTextDisabled,
              ]}
            >
              Confirm
            </TextDs>
          )}
        </TouchableOpacity>
      </FlexView>
    </SafeAreaView>
  );
};
