import React from 'react';
import { Alert, TouchableOpacity, Platform, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, colors, spacing } from '@theme';
import type { RootStackParamList } from '@navigation';
import type { BottomNavigationProps } from './BottomNavigation.types';
import { styles } from './style/BottomNavigation.styles';
import { BlurView } from 'expo-blur';
import { FlexView } from '@designSystem/atoms/FlexView';
import { useAuthStore } from '@store/auth-store';
import { Calendar, CirclePlus } from 'lucide-react-native';
import { ImageDs } from '@designSystem/atoms/image';
import { TextDs } from '@designSystem/atoms/TextDs';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  userType,
  activeTab,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please log in to access this section.');
      return;
    }
    action();
  };

  const handleHomePress = () => {
    if (userType === 'organiser') {
      requireAuth(() => navigation.navigate('Home'));
    } else {
      // For player, Home screen is the explore screen
      navigation.navigate('Home');
    }
  };

  const handleCreatePress = () => {
    requireAuth(() => navigation.navigate('CreateEvent'));
  };

  const handleCalendarPress = () => {
    if (userType === 'organiser') {
      requireAuth(() => navigation.navigate('OrganiserCalendar'));
    } else {
      requireAuth(() => navigation.navigate('PlayerCalendar'));
    }
  };

  const handleExplorePress = () => {
    navigation.navigate('Home');
  };

  const handleProfilePress = () => {
    requireAuth(() => navigation.navigate('PlayerOrginser'));
  };

  // Calculate bottom padding including safe area inset for Android button navigation
  // This ensures the navigation bar is properly positioned above the system navigation buttons
  const containerStyle = {
    ...styles.container,
    paddingBottom: spacing.sm + insets.bottom,
  };

  if (userType === 'organiser') {
    return (
      <FlexView style={containerStyle}>
        <FlexView borderRadius={borderRadius.full} overflow='hidden' boxShadow={colors.boxShadow.blue}>
          {Platform.OS === 'android' ? (
            <View style={styles.content}>
              <TouchableOpacity
                style={[styles.navButton, activeTab === 'home' && styles.navButtonActive]}
                onPress={handleHomePress}
                activeOpacity={0.7}
              >
                <FlexView alignItems='center'>
                  {activeTab === "home" ?
                    <ImageDs image='homeBlue' size={20} /> :
                    <ImageDs image='homeWhite' size={20} />
                  }
                  <TextDs size={10} weight='medium' color={activeTab === "home" ? 'blueGray' : 'white'}>
                    Home
                  </TextDs>
                </FlexView>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navButton} onPress={handleCreatePress} activeOpacity={0.7}>
                <FlexView alignItems='center'>
                  <CirclePlus size={24} color={activeTab !== 'create' ? colors.text.white : colors.text.blueGray} />
                  <TextDs size={10} weight='medium' color={activeTab === "create" ? 'blueGray' : 'white'}>
                    Create
                  </TextDs>
                </FlexView>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navButton, activeTab === 'calendar' && styles.navButtonActive]}
                onPress={handleCalendarPress}
                activeOpacity={0.7}
              >
                <FlexView alignItems='center'>
                  <Calendar
                    size={24}
                    color={activeTab !== 'calendar' ? colors.text.white : colors.text.blueGray}
                  />
                  <TextDs size={10} weight='medium' color={activeTab === "calendar" ? 'blueGray' : 'white'}>
                    Calendar
                  </TextDs>
                </FlexView>
              </TouchableOpacity>
            </View>
          ) : (
            <BlurView intensity={30} tint="default" style={styles.content}>
              <TouchableOpacity
                style={[styles.navButton, activeTab === 'home' && styles.navButtonActive]}
                onPress={handleHomePress}
                activeOpacity={0.7}
              >
                <FlexView alignItems='center'>
                  {activeTab === "home" ?
                    <ImageDs image='homeBlue' size={20} /> :
                    <ImageDs image='homeWhite' size={20} />
                  }
                  <TextDs size={10} weight='medium' color={activeTab === "home" ? 'blueGray' : 'white'}>
                    Home
                  </TextDs>
                </FlexView>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navButton} onPress={handleCreatePress} activeOpacity={0.7}>
                <FlexView alignItems='center'>
                  <CirclePlus size={24} color={activeTab !== 'create' ? colors.text.white : colors.text.blueGray} />
                  <TextDs size={10} weight='medium' color={activeTab === "create" ? 'blueGray' : 'white'}>
                    Create
                  </TextDs>
                </FlexView>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navButton, activeTab === 'calendar' && styles.navButtonActive]}
                onPress={handleCalendarPress}
                activeOpacity={0.7}
              >
                <FlexView alignItems='center'>
                  <Calendar
                    size={24}
                    color={activeTab !== 'calendar' ? colors.text.white : colors.text.blueGray}
                  />
                  <TextDs size={10} weight='medium' color={activeTab === "calendar" ? 'blueGray' : 'white'}>
                    Calendar
                  </TextDs>
                </FlexView>
              </TouchableOpacity>
            </BlurView>
          )}
        </FlexView>
      </FlexView>
    );
  }

  // Player navigation
  return (
    <FlexView style={containerStyle}>
      <FlexView borderRadius={borderRadius.full} overflow='hidden' boxShadow={colors.boxShadow.blue}>
        {Platform.OS === 'android' ? (
          <View style={styles.content}>
            <TouchableOpacity
              style={[styles.navButton, activeTab === 'explore' && styles.navButtonActive]}
              onPress={handleExplorePress}
              activeOpacity={0.7}
            >
              <FlexView alignItems='center'>
                {activeTab !== 'explore' ?
                  <ImageDs image='Compass' size={20} /> : <ImageDs image="CompassBlue" size={20} />}
                <TextDs size={10} weight='medium' color={activeTab === 'explore' ? 'blueGray' : 'white'}>
                  Explore
                </TextDs>
              </FlexView>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, activeTab === 'profile' && styles.navButtonActive]}
              onPress={handleProfilePress}
              activeOpacity={0.7}
            >
              <FlexView alignItems='center'>
                {activeTab !== 'profile' ?
                  <ImageDs image='userStar' size={20} /> : <ImageDs image="userStarBlue" size={20} />}
                <TextDs size={10} weight='medium' color={activeTab === 'profile' ? 'blueGray' : 'white'}>
                  Organisers
                </TextDs>
              </FlexView>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, activeTab === 'calendar' && styles.navButtonActive]}
              onPress={handleCalendarPress}
              activeOpacity={0.7}
            >
              <FlexView alignItems='center'>
                <Calendar
                  size={20}
                  color={activeTab !== 'calendar' ? colors.text.white : colors.text.blueGray}
                />
                <TextDs size={10} weight='medium' color={activeTab === 'calendar' ? 'blueGray' : 'white'}>
                  Calendar
                </TextDs>
              </FlexView>
            </TouchableOpacity>
          </View>
        ) : (
          <BlurView intensity={30} tint="default" style={styles.content}>
            <TouchableOpacity
              style={[styles.navButton, activeTab === 'explore' && styles.navButtonActive]}
              onPress={handleExplorePress}
              activeOpacity={0.7}
            >
              <FlexView alignItems='center'>
                {activeTab !== 'explore' ?
                  <ImageDs image='Compass' size={20} /> : <ImageDs image="CompassBlue" size={20} />}
                <TextDs size={10} weight='medium' color={activeTab === 'explore' ? 'blueGray' : 'white'}>
                  Explore
                </TextDs>
              </FlexView>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, activeTab === 'profile' && styles.navButtonActive]}
              onPress={handleProfilePress}
              activeOpacity={0.7}
            >
              <FlexView alignItems='center'>
                {activeTab !== 'profile' ?
                  <ImageDs image='userStar' size={20} /> : <ImageDs image="userStarBlue" size={20} />}
                <TextDs size={10} weight='medium' color={activeTab === 'profile' ? 'blueGray' : 'white'}>
                  Organisers
                </TextDs>
              </FlexView>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, activeTab === 'calendar' && styles.navButtonActive]}
              onPress={handleCalendarPress}
              activeOpacity={0.7}
            >
              <FlexView alignItems='center'>
                <Calendar
                  size={20}
                  color={activeTab !== 'calendar' ? colors.text.white : colors.text.blueGray}
                />
                <TextDs size={10} weight='medium' color={activeTab === 'calendar' ? 'blueGray' : 'white'}>
                  Calendar
                </TextDs>
              </FlexView>
            </TouchableOpacity>
          </BlurView>
        )}
      </FlexView>
    </FlexView>
  );
};
