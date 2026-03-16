import React, { useState, useMemo } from 'react';
import { TextDs, FlexView } from '@components';
import { ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '@theme';
import { SearchInput } from '@components/global';
import type { RootStackParamList } from '@navigation';
import type { PurchasedPackage } from './PurchasedPackagesScreen.types';
import { PackageCard } from './components/PackageCard';
import { styles } from './style/PurchasedPackagesScreen.styles';

type PurchasedPackagesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PurchasedPackages'
>;

// Mock data - replace with actual API call
const mockPackages: PurchasedPackage[] = [
  {
    id: '1',
    title: 'Standard Offer',
    organizerName: 'Berry Badminton',
    organizerAvatar: undefined,
    validity: '3 months',
    sport: 'Pilates',
    purchasedOn: '23 Oct, 25',
    eventTypes: ['Social', 'Class'],
    totalEvents: 10,
    usedEvents: 2,
  },
  {
    id: '2',
    title: 'Standard Offer',
    organizerName: 'Berry Badminton',
    organizerAvatar: undefined,
    validity: '3 months',
    sport: 'Pilates',
    purchasedOn: '23 Oct, 25',
    eventTypes: ['Social', 'Class'],
    totalEvents: 10,
    usedEvents: 4,
  },
];

export const PurchasedPackagesScreen: React.FC = () => {
  const navigation = useNavigation<PurchasedPackagesScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [packages] = useState<PurchasedPackage[]>(mockPackages);

  const filteredPackages = useMemo(() => {
    if (!searchQuery.trim()) {
      return packages;
    }
    const query = searchQuery.toLowerCase();
    return packages.filter(
      (pkg) =>
        pkg.organizerName.toLowerCase().includes(query) ||
        pkg.title.toLowerCase().includes(query) ||
        pkg.sport.toLowerCase().includes(query)
    );
  }, [packages, searchQuery]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* Header */}
      <FlexView style={styles.header}>
        <TextDs style={styles.headerTitle}>Packages</TextDs>
      </FlexView>

      {/* Search Bar */}
      <FlexView style={styles.searchContainer}>
        <SearchInput
          placeholder="Search Package by Organisers"
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInput}
        />
      </FlexView>

      {/* Package List */}
      <FlatList
        data={filteredPackages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PackageCard
            package={item}
            onPress={(id) => navigation.navigate('PackageDetail', { packageId: id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <FlexView style={styles.emptyState}>
            <TextDs style={styles.emptyStateText}>No packages found</TextDs>
          </FlexView>
        }
      />
    </SafeAreaView>
  );
};

