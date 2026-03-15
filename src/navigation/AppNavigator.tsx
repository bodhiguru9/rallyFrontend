import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TopOrganiserPage } from "src/components/private/home/player-home-content/sections/TopOrganiserPage"; // Adjust path as needed

import {
  HomeScreen,
  SignUpScreen,
  VerifyOTPScreen,
  ProfileSetupScreen,
  SignInScreen,
  ForgotPasswordScreen,
  CreateNewPasswordScreen,
  EventDetailsScreen,
  BookingConfirmationScreen,
  PlayerProfileScreen,
  EditProfileScreen,
  PaymentMethodsScreen,
  PreferencesScreen,
  PurchasedPackagesScreen,
  PackageDetailScreen,
  CreateEventScreen,
  OrganiserProfileScreen,
  OrganiserSettingsScreen,
  OrganiserAnalyticsScreen,
  OrganiserAnalyticsEventDetailsScreen,
  OrganiserEventsHostedScreen,
  OrganiserMembersScreen,
  OrganiserMemberJoinedEventsScreen,
  OrganiserTransactionsScreen,
  OrganiserNotificationsScreen,
  OrganiserProfileSettingsScreen,
  OrganiserAttendeesScreen,
  OrganiserProfileEditScreen,
  OrganiserBankDetailsScreen,
  OrganiserSubscriptionScreen,
  OrganiserPackagesScreen,
  OrganiserPackageDetailScreen,
  OrganiserPackagePlayerDetailScreen,
  OrganiserCalendarScreen,
  OrganiserEventDetailsScreen,
  AllFollowersScreen,
  PlayerNotificationsScreen,
  PlayerOrginserScreen,
  PlayerOrgEventDetailsScreen,
  EventOrginserProfilePlayer,
  PlanDetailsScreen,
  PlayerCalendarScreen,
  SearchScreen,
  TagSearchScreen,
  BookingScreen,
  RequestSentScreen,
} from '@screens';
import { TermsAndConditionsScreen } from '@screens/terms/TermsAndConditionsScreen';

export type RootStackParamList = {
  Home: undefined;
  SignUp: undefined;
  SignIn: undefined;
  TermsAndConditions: undefined;
  PlayerOrginser: undefined;
  PlayerOrgEventDetails: { organiserId?: string; communityName?: string };
  EventOrginserProfilePlayer: { organiserId: string };
  PlanDetails: { packageId?: string };
  VerifyOTP: {
    flow?: 'signup' | 'forgotPassword';
    phoneNumber?: string;
    email?: string;
    userType?: 'player' | 'organiser';
  };
  ProfileSetup: {
    phoneNumber?: string;
    email?: string;
    userType?: 'player' | 'organiser';
  };
  ForgotPassword: undefined;
  CreateNewPassword: {
    phoneNumber?: string;
    email?: string;
  };
  EventDetails: { eventId: string };
  Booking: {
    eventId: string;
    totalPrice: number;
    currency: string;
    guestsCount: number;
  };
  RequestSent: {
    variant: 'private' | 'waitlist' | 'registration';
    eventId: string;
    eventTitle: string;
    organizerName: string;
    eventImage: string;
    eventDate: string;
    eventLocation: string;
    amountDue: number;
    currency: string;
    bookingId: string;
    categories: string[];
    eventType: string;
  };
  BookingConfirmation: {
    eventId: string;
    bookingId: string;
    amountPaid: number;
    currency: string;
    guestsCount: number;
  };
  PlayerProfile: undefined;
  TopOrganiserPage: undefined;
  ChangePassword: undefined;
  PlayerNotifications: undefined;
  PlayerCalendar: undefined;
  EditProfile: undefined;
  PaymentMethods: undefined;
  Preferences: undefined;
  PurchasedPackages: undefined;
  PackageDetail: { packageId: string };
  CreateEvent: undefined;
  OrganiserProfile: undefined;
  OrganiserSettings: undefined;
  AllFollowers: undefined;
  OrganiserAnalytics: undefined;
  OrganiserAnalyticsEventDetails: { eventId: string };
  OrganiserEventsHosted: undefined;
  OrganiserMembers: undefined;
  OrganiserMemberJoinedEvents: { userId: number; fullName?: string; profilePic?: string | null };
  OrganiserTransactions: undefined;
  OrganiserNotifications: undefined;
  OrganiserProfileSettings: undefined;
  OrganiserAttendees: undefined;
  OrganiserProfileEdit: undefined;
  OrganiserBankDetails: { bankAccountId?: string } | undefined;
  OrganiserSubscription: undefined;
  OrganiserPackages: undefined;
  OrganiserPackageDetail: { packageId: string };
  OrganiserPackagePlayerDetail: { userId: number; packageId: string };
  OrganiserCalendar: undefined;
  OrganiserEventDetails: { eventId: string; isReadOnly?: boolean };
  Search: undefined;
  TagSearch: { searchType: 'sport' | 'eventType'; value: string };
  // Add more screens here as needed
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Deep link config: opening rally-app://event/:eventId or https://rally.app/event/:eventId
 * navigates to EventDetails with that eventId.
*/
const linking = {
  prefixes: ['rally-app://', 'https://rally.app/'],
  config: {
    screens: {
      EventDetails: 'event/:eventId',
    },
  },
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer
      linking={linking}
      onReady={() => console.log('🧭 [NAVIGATOR] Navigation ready')}
      onStateChange={(state) => console.log('🧭 [NAVIGATOR] Navigation state changed:', state?.routes[state.index]?.name)}
    >
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="TopOrganiserPage"
          component={TopOrganiserPage}
          options={{ headerShown: false }}
        />
        {/* Public Routes */}
        <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="RequestSent" component={RequestSentScreen} />

        {/* Auth Routes */}
        <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="CreateNewPassword" component={CreateNewPasswordScreen} />

        {/* Protected Routes - All User Types */}
        <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Preferences" component={PreferencesScreen} />

        {/* Player-Only Routes */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen name="PlayerOrginser" component={PlayerOrginserScreen} />
        <Stack.Screen name="PlayerOrgEventDetails" component={PlayerOrgEventDetailsScreen} />
        <Stack.Screen
          name="EventOrginserProfilePlayer"
          component={EventOrginserProfilePlayer}
        />
        <Stack.Screen name="PlanDetails" component={PlanDetailsScreen} />
        <Stack.Screen name="PlayerProfile" component={PlayerProfileScreen} />
        <Stack.Screen name="PlayerNotifications" component={PlayerNotificationsScreen} />
        <Stack.Screen name="PlayerCalendar" component={PlayerCalendarScreen} />
        <Stack.Screen name="TagSearch" component={TagSearchScreen} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
        <Stack.Screen name="PurchasedPackages" component={PurchasedPackagesScreen} />
        <Stack.Screen name="PackageDetail" component={PackageDetailScreen} />

        {/* Organiser-Only Routes */}
        <Stack.Screen
          name="CreateEvent"
          component={CreateEventScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen name="OrganiserProfile" component={OrganiserProfileScreen} />
        <Stack.Screen name="OrganiserSettings" component={OrganiserSettingsScreen} />
        <Stack.Screen name="OrganiserAnalytics" component={OrganiserAnalyticsScreen} />
        <Stack.Screen
          name="OrganiserAnalyticsEventDetails"
          component={OrganiserAnalyticsEventDetailsScreen}
        />
        <Stack.Screen name="OrganiserEventsHosted" component={OrganiserEventsHostedScreen} />
        <Stack.Screen name="OrganiserMembers" component={OrganiserMembersScreen} />
        <Stack.Screen
          name="OrganiserMemberJoinedEvents"
          component={OrganiserMemberJoinedEventsScreen}
        />
        <Stack.Screen name="OrganiserTransactions" component={OrganiserTransactionsScreen} />
        <Stack.Screen name="OrganiserNotifications" component={OrganiserNotificationsScreen} />
        <Stack.Screen name="OrganiserProfileSettings" component={OrganiserProfileSettingsScreen} />
        <Stack.Screen name="OrganiserAttendees" component={OrganiserAttendeesScreen} />
        <Stack.Screen name="OrganiserProfileEdit" component={OrganiserProfileEditScreen} />
        <Stack.Screen name="OrganiserBankDetails" component={OrganiserBankDetailsScreen} />
        <Stack.Screen name="OrganiserSubscription" component={OrganiserSubscriptionScreen} />
        <Stack.Screen name="OrganiserPackages" component={OrganiserPackagesScreen} />
        <Stack.Screen name="OrganiserPackageDetail" component={OrganiserPackageDetailScreen} />
        <Stack.Screen name="OrganiserPackagePlayerDetail" component={OrganiserPackagePlayerDetailScreen} />
        <Stack.Screen name="OrganiserCalendar" component={OrganiserCalendarScreen} />
        <Stack.Screen name="OrganiserEventDetails" component={OrganiserEventDetailsScreen} />
        <Stack.Screen name="AllFollowers" component={AllFollowersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
