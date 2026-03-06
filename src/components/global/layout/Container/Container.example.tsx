import { TextDs, FlexView } from '@components';
import { ScrollView, StyleSheet } from 'react-native';
import { Container } from './Container';
import { getFontStyle, spacing } from '@theme';

/**
 * Container Component Usage Examples
 *
 * This file demonstrates various ways to use the Container component.
 */

// Example 1: Simple container with gradient background
export const SimpleContainerExample = () => (
  <Container>
    <ScrollView contentContainerStyle={styles.content}>
      <TextDs style={styles.text}>Simple content with gradient background</TextDs>
    </ScrollView>
  </Container>
);

// Example 2: Container with header and bottom navigation (Player)
export const PlayerScreenExample = () => {
  const handleSearch = () => console.log('Search pressed');
  const handleNotification = () => console.log('Notification pressed');
  const handleProfile = () => console.log('Profile pressed');
  const handleExplore = () => console.log('Explore pressed');
  const handleCalendar = () => console.log('Calendar pressed');
  const handleBottomProfile = () => console.log('Bottom profile pressed');

  return (
    <Container
      showHeader
      showBottomNav
      userType="player"
      activeTab="explore"
      userInitials="JD"
      notificationCount={3}
      onSearchPress={handleSearch}
      onNotificationPress={handleNotification}
      onProfilePress={handleProfile}
      onExplorePress={handleExplore}
      onCalendarPress={handleCalendar}
      onBottomProfilePress={handleBottomProfile}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <TextDs style={styles.text}>Player home screen content</TextDs>
      </ScrollView>
    </Container>
  );
};

// Example 3: Container with header and bottom navigation (Organiser)
export const OrganiserScreenExample = () => {
  const handleNotification = () => console.log('Notification pressed');
  const handleProfile = () => console.log('Profile pressed');
  const handleHome = () => console.log('Home pressed');
  const handleCreate = () => console.log('Create pressed');

  return (
    <Container
      showHeader
      showBottomNav
      userType="organiser"
      activeTab="home"
      userAvatar="https://example.com/avatar.jpg"
      onNotificationPress={handleNotification}
      onProfilePress={handleProfile}
      onHomePress={handleHome}
      onCreatePress={handleCreate}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <TextDs style={styles.text}>Organiser dashboard content</TextDs>
      </ScrollView>
    </Container>
  );
};

// Example 4: Detail screen with back button
export const DetailScreenExample = () => (
  <Container showBackButton>
    <ScrollView contentContainerStyle={styles.content}>
      <TextDs style={styles.text}>Detail screen with back button</TextDs>
    </ScrollView>
  </Container>
);

// Example 5: Form screen with keyboard avoiding
export const FormScreenExample = () => (
  <Container keyboardAvoiding showBackButton>
    <ScrollView contentContainerStyle={styles.content}>
      <TextDs style={styles.text}>Form screen with keyboard avoiding behavior</TextDs>
      {/* Add form inputs here */}
    </ScrollView>
  </Container>
);

// Example 6: Container without gradient background
export const NoGradientExample = () => (
  <Container useGradientBackground={false}>
    <FlexView style={styles.content}>
      <TextDs style={styles.text}>Container with solid background</TextDs>
    </FlexView>
  </Container>
);

// Example 7: Unauthenticated player screen
export const UnauthenticatedPlayerExample = () => {
  const handleSignUp = () => console.log('Sign up pressed');
  const handleSearch = () => console.log('Search pressed');

  return (
    <Container
      showHeader
      userType="player"
      onSignUpPress={handleSignUp}
      onSearchPress={handleSearch}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <TextDs style={styles.text}>Guest user content</TextDs>
      </ScrollView>
    </Container>
  );
};

// Example 8: Custom styled container
export const CustomStyledExample = () => (
  <Container
    style={styles.customContainer}
    contentStyle={styles.customContent}
  >
    <TextDs style={styles.text}>Container with custom styles</TextDs>
  </Container>
);

// Example 9: Container without SafeAreaView
export const NoSafeAreaExample = () => (
  <Container useSafeArea={false}>
    <FlexView style={styles.content}>
      <TextDs style={styles.text}>Container without SafeAreaView</TextDs>
    </FlexView>
  </Container>
);

// Example 10: Container with custom back handler
export const CustomBackHandlerExample = () => {
  const handleCustomBack = () => {
    console.log('Custom back logic');
    // Add custom navigation logic here
  };

  return (
    <Container showBackButton onBackPress={handleCustomBack}>
      <FlexView style={styles.content}>
        <TextDs style={styles.text}>Container with custom back handler</TextDs>
      </FlexView>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...getFontStyle(16, 'medium'),
  },
  customContainer: {
    opacity: 0.9,
  },
  customContent: {
    padding: spacing.xl,
  },
});
