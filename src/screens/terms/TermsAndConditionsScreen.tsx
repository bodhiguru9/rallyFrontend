import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { styles } from './TermsAndConditionsScreen.styles';
import { TextDs, FlexView, ImageDs } from '@components';
import Svg, { G, Path, Defs, ClipPath, Rect } from 'react-native-svg';

export const TermsAndConditionsScreen: React.FC = () => {
  const navigation = useNavigation();

  const BackArrowIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <G clipPath="url(#clip0_1_16835)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.21974 9.53026C6.07913 9.38962 6.00015 9.19889 6.00015 9.00001C6.00015 8.80114 6.07913 8.61041 6.21974 8.46976L10.4625 4.22701C10.5317 4.15538 10.6144 4.09824 10.7059 4.05894C10.7974 4.01963 10.8959 3.99894 10.9954 3.99808C11.095 3.99721 11.1938 4.01619 11.286 4.0539C11.3781 4.09161 11.4619 4.1473 11.5323 4.21772C11.6027 4.28814 11.6584 4.37188 11.6961 4.46405C11.7338 4.55622 11.7528 4.65498 11.7519 4.75456C11.7511 4.85415 11.7304 4.95256 11.6911 5.04407C11.6518 5.13557 11.5946 5.21833 11.523 5.28751L7.81049 9.00001L11.523 12.7125C11.6596 12.854 11.7352 13.0434 11.7335 13.2401C11.7318 13.4367 11.6529 13.6248 11.5139 13.7639C11.3748 13.9029 11.1867 13.9818 11.99 13.9835C10.7934 13.9852 10.6039 13.9096 10.4625 13.773L6.21974 9.53026Z"
          fill="white"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1_16835">
          <Rect width="18" height="18" fill="white" transform="matrix(0 1 -1 0 18 0)" />
        </ClipPath>
      </Defs>
    </Svg>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <FlexView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <BackArrowIcon />
        </TouchableOpacity>
      </FlexView>

      {/* App Logo */}
      <FlexView style={styles.logoContainer}>
        <ImageDs image="BlackBigLogo" size={60} />
      </FlexView>

      {/* Title */}
      <TextDs style={styles.title}>Terms & Conditions</TextDs>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Last Updated */}
        <TextDs style={styles.lastUpdated}>Last updated August 06, 2024</TextDs>

        {/* Agreement Header */}
        <TextDs style={styles.sectionTitle}>AGREEMENT TO OUR LEGAL TERMS</TextDs>
        <TextDs style={styles.paragraph}>
          We are Rally Portal LLC, doing business as Rally ('Company', 'we', 'us', or 'our'), a company registered in the United Arab Emirates at M1112, 11th floor, Grosvenor Business Tower, Barsha Heights, Dubai.
        </TextDs>
        <TextDs style={styles.paragraph}>
          We operate the website https://rallysports.ae (the 'Site'), the mobile application Rally (the 'App'), as well as any other related products and services that refer or link to these legal terms (the 'Legal Terms') (collectively, the 'Services').
        </TextDs>
        <TextDs style={styles.paragraph}>
          You can contact us by email at support@rallysports.ae or by mail to M1112, 11th floor, Grosvenor Business Tower, Barsha Heights, Dubai, United Arab Emirates.
        </TextDs>
        <TextDs style={styles.paragraph}>
          These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ('you'), and Rally Portal LLC, concerning your access to and use of the Services.
        </TextDs>
        <TextDs style={styles.importantText}>
          IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
        </TextDs>
        <TextDs style={styles.paragraph}>
          The Services are intended for users who are at least 13 years of age. All users who are minors in the jurisdiction in which they reside (generally under the age of 18) must have the permission of, and be directly supervised by, their parent or guardian to use the Services.
        </TextDs>

        {/* Section 1 - Our Services */}
        <TextDs style={styles.sectionTitle}>1. OUR SERVICES</TextDs>
        <TextDs style={styles.paragraph}>
          The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation.
        </TextDs>

        {/* Section 2 - Intellectual Property */}
        <TextDs style={styles.sectionTitle}>2. INTELLECTUAL PROPERTY RIGHTS</TextDs>
        <TextDs style={styles.paragraph}>
          We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the 'Content'), as well as the trademarks, service marks, and logos contained therein (the 'Marks').
        </TextDs>

        {/* Section 3 - User Representations */}
        <TextDs style={styles.sectionTitle}>3. USER REPRESENTATIONS</TextDs>
        <TextDs style={styles.paragraph}>
          By using the Services, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information; (3) you have the legal capacity and you agree to comply with these Legal Terms; (4) you are not under the age of 13.
        </TextDs>

        {/* Section 4 - User Registration */}
        <TextDs style={styles.sectionTitle}>4. USER REGISTRATION</TextDs>
        <TextDs style={styles.paragraph}>
          You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password.
        </TextDs>

        {/* Section 5 - Booking and Payment */}
        <TextDs style={styles.sectionTitle}>5. BOOKING AND PAYMENT TERMS</TextDs>
        <TextDs style={styles.subTitle}>Booking Process</TextDs>
        <TextDs style={styles.bulletPoint}>
          • Registration: Create an account by providing required personal information
        </TextDs>
        <TextDs style={styles.bulletPoint}>
          • Selection of Organiser: Browse and select an event based on profile and availability
        </TextDs>
        <TextDs style={styles.bulletPoint}>
          • Payment: Complete booking by paying through Rally platform using Stripe or approved payment gateway
        </TextDs>
        <TextDs style={styles.bulletPoint}>
          • Out-of-platform payments are strictly prohibited
        </TextDs>

        {/* Section 6 - Subscriptions */}
        <TextDs style={styles.sectionTitle}>6. SUBSCRIPTIONS</TextDs>
        <TextDs style={styles.paragraph}>
          Subscribing to Rally provides access to enhanced statistical data and analytics about your sports performance. Subscriptions automatically renew unless cancelled before the renewal date.
        </TextDs>

        {/* Section 7 - Refund Policy */}
        <TextDs style={styles.sectionTitle}>7. BOOKING REFUND AND CANCELLATION POLICY</TextDs>
        <TextDs style={styles.paragraph}>
          Please review our Booking Refund and Cancellation Policy posted on the Services prior to making any booking.
        </TextDs>

        {/* Section 8 - Prohibited Activities */}
        <TextDs style={styles.sectionTitle}>8. PROHIBITED ACTIVITIES</TextDs>
        <TextDs style={styles.paragraph}>
          As a user of Rally, you agree not to:
        </TextDs>
        <TextDs style={styles.bulletPoint}>
          • Engage in any unlawful activities or violate applicable laws
        </TextDs>
        <TextDs style={styles.bulletPoint}>
          • Provide false or misleading information
        </TextDs>
        <TextDs style={styles.bulletPoint}>
          • Harass, abuse, or discriminate against others
        </TextDs>
        <TextDs style={styles.bulletPoint}>
          • Conduct unauthorized payment transactions outside the platform
        </TextDs>
        <TextDs style={styles.bulletPoint}>
          • Violate privacy or collect personal information without consent
        </TextDs>
        <TextDs style={styles.bulletPoint}>
          • Interfere with platform operations or security
        </TextDs>

        {/* Section 16 - Privacy Policy */}
        <TextDs style={styles.sectionTitle}>16. PRIVACY POLICY</TextDs>
        <TextDs style={styles.paragraph}>
          We care about data privacy and security. Please review our Privacy Policy. By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms.
        </TextDs>

        {/* Section 18 - Term and Termination */}
        <TextDs style={styles.sectionTitle}>18. TERM AND TERMINATION</TextDs>
        <TextDs style={styles.importantText}>
          WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES TO ANY PERSON FOR ANY REASON, INCLUDING FOR BREACH OF THESE LEGAL TERMS.
        </TextDs>

        {/* Section 20 - Governing Law */}
        <TextDs style={styles.sectionTitle}>20. GOVERNING LAW</TextDs>
        <TextDs style={styles.paragraph}>
          These Legal Terms shall be governed by and defined following the laws of the United Arab Emirates. Rally Portal LLC and yourself irrevocably consent that the courts of the United Arab Emirates shall have exclusive jurisdiction to resolve any dispute.
        </TextDs>

        {/* Section 23 - Disclaimer */}
        <TextDs style={styles.sectionTitle}>23. DISCLAIMER</TextDs>
        <TextDs style={styles.importantText}>
          THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED.
        </TextDs>

        {/* Section 24 - Limitations of Liability */}
        <TextDs style={styles.sectionTitle}>24. LIMITATIONS OF LIABILITY</TextDs>
        <TextDs style={styles.paragraph}>
          Rally Portal LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly. Rally is not responsible for any personal injuries or damages that occur during any session.
        </TextDs>

        {/* Contact Section */}
        <TextDs style={styles.sectionTitle}>30. CONTACT US</TextDs>
        <TextDs style={styles.paragraph}>
          In order to resolve a complaint regarding the Services or to receive further information, please contact us at:
        </TextDs>
        <TextDs style={styles.contactInfo}>Rally Portal LLC</TextDs>
        <TextDs style={styles.contactInfo}>M1112, 11th floor, Grosvenor Business Tower</TextDs>
        <TextDs style={styles.contactInfo}>Barsha Heights, Dubai</TextDs>
        <TextDs style={styles.contactInfo}>United Arab Emirates</TextDs>
        <TextDs style={styles.contactInfo}>support@rallysports.ae</TextDs>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};