import React, { useState } from 'react';
import { TextDs,  FlexView } from '@components';
import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '@theme';
import { Select, Toggle } from '@components/global';
import type { RootStackParamList } from '@navigation';
import type { PreferencesState } from './PreferencesScreen.types';
import { styles } from './style/PreferencesScreen.styles';

type PreferencesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Preferences'
>;

const SYNC_CALENDAR_OPTIONS = [
  { label: 'Google, Outlook & Apple', value: 'all' },
  { label: 'Google', value: 'google' },
  { label: 'Outlook', value: 'outlook' },
  { label: 'Apple', value: 'apple' },
];

const EVENT_REMINDERS_OPTIONS = [
  { label: 'Email & WhatsApp', value: 'both' },
  { label: 'Email', value: 'email' },
  { label: 'WhatsApp', value: 'whatsapp' },
];

export const PreferencesScreen: React.FC = () => {
  const navigation = useNavigation<PreferencesScreenNavigationProp>();
  const [preferences, setPreferences] = useState<PreferencesState>({
    syncCalendar: 'all',
    eventReminders: 'both',
    followerNotifications: true,
    bookingConfirmations: true,
    updatesFromOrganisers: true,
    cancellationNotifications: true,
  });

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Save preferences:', preferences);
    navigation.goBack();
  };

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
          <TextDs style={styles.headerTitle}>Preferences</TextDs>
        </FlexView>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <TextDs style={styles.saveButtonText}>Save</TextDs>
        </TouchableOpacity>
      </FlexView>

      {/* Drag Handle */}
      <FlexView style={styles.dragHandle} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Preferences Card */}
        <FlexView style={styles.card}>
          {/* General Preferences Section */}
          <FlexView style={styles.generalSection}>
            {/* Sync Calendar */}
            <FlexView style={styles.preferenceRow}>
              <TextDs style={styles.preferenceLabel}>Sync Calendar</TextDs>
              <FlexView style={styles.selectWrapper}>
                <Select
                  placeholder="Select calendar"
                  options={SYNC_CALENDAR_OPTIONS}
                  value={preferences.syncCalendar}
                  onSelect={(value) =>
                    setPreferences((prev) => ({ ...prev, syncCalendar: value }))
                  }
                  containerStyle={styles.selectContainer}
                  inputStyle={styles.selectInput}
                  textStyle={styles.selectText}
                />
              </FlexView>
            </FlexView>

            {/* Event Reminders */}
            <FlexView style={styles.preferenceRow}>
              <TextDs style={styles.preferenceLabel}>Event Reminders</TextDs>
              <FlexView style={styles.selectWrapper}>
                <Select
                  placeholder="Select reminder method"
                  options={EVENT_REMINDERS_OPTIONS}
                  value={preferences.eventReminders}
                  onSelect={(value) =>
                    setPreferences((prev) => ({ ...prev, eventReminders: value }))
                  }
                  containerStyle={styles.selectContainer}
                  inputStyle={styles.selectInput}
                  textStyle={styles.selectText}
                />
              </FlexView>
            </FlexView>
          </FlexView>

          {/* Notifications Section */}
          <FlexView style={styles.section}>
            <TextDs style={styles.sectionTitle}>Notifications</TextDs>

            {/* Receive follower notifications */}
            <Toggle
              label="Receive follower notifications"
              value={preferences.followerNotifications}
              onValueChange={(value) =>
                setPreferences((prev) => ({ ...prev, followerNotifications: value }))
              }
              containerStyle={styles.toggleContainer}
              activeColor="#3D6F92"
            />

            {/* Receive booking confirmations */}
            <Toggle
              label="Receive booking confirmations"
              value={preferences.bookingConfirmations}
              onValueChange={(value) =>
                setPreferences((prev) => ({ ...prev, bookingConfirmations: value }))
              }
              containerStyle={styles.toggleContainer}
              activeColor="#3D6F92"
            />

            {/* Receive updates from subscribed organisers */}
            <Toggle
              label="Receive updates from subscribed organisers"
              value={preferences.updatesFromOrganisers}
              onValueChange={(value) =>
                setPreferences((prev) => ({ ...prev, updatesFromOrganisers: value }))
              }
              containerStyle={styles.toggleContainer}
              activeColor="#3D6F92"
            />

            {/* Receive cancellation notifications */}
            <Toggle
              label="Receive cancellation notifications"
              value={preferences.cancellationNotifications}
              onValueChange={(value) =>
                setPreferences((prev) => ({ ...prev, cancellationNotifications: value }))
              }
              containerStyle={styles.lastToggleContainer}
              activeColor="#3D6F92"
            />
          </FlexView>
        </FlexView>
      </ScrollView>
    </SafeAreaView>
  );
};

