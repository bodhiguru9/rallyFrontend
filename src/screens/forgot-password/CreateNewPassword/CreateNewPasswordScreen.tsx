import React from 'react';
import { ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Eye, EyeOff } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing } from '@theme';
import { FormInput, Button, TextDs, FlexView } from '@components';
import { ImageDs } from '@designSystem/atoms/image';
import { ArrowIcon } from '@components/global/ArrowIcon';
import type { RootStackParamList } from '@navigation';
import { useCreateNewPassword } from '@hooks/auth/use-create-new-password';
import { styles } from './style/CreateNewPasswordScreen.styles';

type TCreateNewPasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CreateNewPassword'
>;

export const CreateNewPasswordScreen: React.FC = () => {
  const navigation = useNavigation<TCreateNewPasswordScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const {
    password,
    setPassword,
    reEnterPassword,
    setReEnterPassword,
    showPassword,
    showReEnterPassword,
    isLoading,
    handleSetPassword,
    toggleShowPassword,
    toggleShowReEnterPassword,
  } = useCreateNewPassword();

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
          <TextDs style={styles.heading} align="center">Create New Password</TextDs>
          <TextDs style={styles.subtitle} align="center">Create a new 8 digit password</TextDs>

          {/* Password Input */}
          <FormInput
            label="Password"
            placeholder="Set an 8 digit password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            containerStyle={styles.passwordContainer}
            rightIcon={
              <TouchableOpacity onPress={toggleShowPassword} activeOpacity={0.7}>
                {showPassword ? (
                  <EyeOff size={20} color={colors.text.secondary} />
                ) : (
                  <Eye size={20} color={colors.text.secondary} />
                )}
              </TouchableOpacity>
            }
          />

          <FlexView height={16} width={"100%"} />

          {/* Re Enter Password Input */}
          <FormInput
            label="Re Enter Password"
            placeholder="Re enter the above set password"
            value={reEnterPassword}
            onChangeText={setReEnterPassword}
            secureTextEntry={!showReEnterPassword}
            containerStyle={styles.passwordContainer}
            rightIcon={
              <TouchableOpacity onPress={toggleShowReEnterPassword} activeOpacity={0.7}>
                {showReEnterPassword ? (
                  <EyeOff size={20} color={colors.text.secondary} />
                ) : (
                  <Eye size={20} color={colors.text.secondary} />
                )}
              </TouchableOpacity>
            }
          />
        </FlexView>
      </ScrollView>

      {/* Set Password Button */}
      <FlexView style={[styles.footer, { paddingBottom: spacing.xl + insets.bottom }]}>
        <Button
          onPress={handleSetPassword}
          variant="primary"
          style={styles.setPasswordButton}
          disabled={password.length < 8 || reEnterPassword.length < 8 || isLoading}
          loading={isLoading}
        >
          <TextDs size={14} weight="semibold" color="white">
            Set Password
          </TextDs>
        </Button>
      </FlexView>
    </SafeAreaView>
  );
};
