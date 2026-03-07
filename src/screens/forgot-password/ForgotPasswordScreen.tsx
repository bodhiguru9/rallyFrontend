import React from 'react';
import { ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing } from '@theme';
import { WhatsAppInput, FormInput, Button, TextDs, FlexView } from '@components';
import { ImageDs } from '@designSystem/atoms/image';
import type { RootStackParamList } from '@navigation';
import { useForgotPassword } from '@hooks/auth/use-forgot-password';
import { styles } from './style/ForgotPasswordScreen.styles';
import { ArrowIcon } from '@components/global/ArrowIcon';

type TForgotPasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ForgotPassword'
>;

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<TForgotPasswordScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const {
    phoneNumber,
    setPhoneNumber,
    email,
    setEmail,
    useEmail,
    isLoading,
    handleSendCode,
    handleUseEmail,
    handleUseWhatsApp,
  } = useForgotPassword();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.cream} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ArrowIcon variant='left' onClick={() => navigation.goBack()} />

        {/* Logo Section */}
        <FlexView style={styles.logoSection}>
          <ImageDs
            image="BlackBigLogo"
            style={styles.logo}
            fit="contain"
          />
        </FlexView>

        {/* Main Content */}
        <FlexView style={styles.mainContent}>
          <TextDs style={styles.heading} align="center">Forgotten Your Password</TextDs>
          <TextDs style={styles.subtitle}>
            Enter your WhatsApp Number or Email to receive a code.
          </TextDs>

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
                    <ImageDs image="WhatsappIcon" size={14} />
                  <TextDs style={styles.whatsappLinkText}> 
                    Use WhatsApp
                    </TextDs>
                </TouchableOpacity>
              </FlexView>
              <FormInput
                label=""
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={styles.inputContainer}
              />
            </FlexView>
          )}
        </FlexView>
      </ScrollView>

      {/* Send Code Button */}
      <FlexView style={[styles.footer, { paddingBottom: spacing.xl + insets.bottom }]}>
        <Button
          onPress={handleSendCode}
          variant="primary"
          style={styles.sendCodeButton}
          disabled={isLoading}
          loading={isLoading}
        >
          <TextDs size={14} weight="semibold" color="white">
            Send Code
          </TextDs>
        </Button>
      </FlexView>
    </SafeAreaView>
  );
};
