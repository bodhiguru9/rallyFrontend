import React, { useMemo, useState } from 'react';
import { TextDs, FlexView } from '@components';
import { ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '@theme';
import { SearchInput } from '@components/global';
import type { RootStackParamList } from '@navigation';
import { PackageCard } from './components/PackageCard';
import { styles } from './style/PurchasedPackagesScreen.styles';
import { usePlayerPurchasedPackages } from '@hooks';
import { mapPlayerPurchasesResponse } from '@utils';

type PurchasedPackagesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PurchasedPackages'
>;

export const PurchasedPackagesScreen: React.FC = () => {
  const navigation = useNavigation<PurchasedPackagesScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, isError, error, refetch, isFetching } = usePlayerPurchasedPackages();

  const packages = useMemo(() => mapPlayerPurchasesResponse(data), [data]);

  const filteredPackages = useMemo(() => {
    if (!searchQuery.trim()) {
      return packages;
    }
    const query = searchQuery.toLowerCase();
    return packages.filter(
      (pkg) =>
        pkg.organizerName.toLowerCase().includes(query) ||
        pkg.title.toLowerCase().includes(query) ||
        pkg.sport.toLowerCase().includes(query),
    );
  }, [packages, searchQuery]);

  const errorMessage = error instanceof Error ? error.message : 'Something went wrong.';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlexView style={styles.header}>
        <TextDs style={styles.headerTitle}>Packages</TextDs>
      </FlexView>

      <FlexView style={styles.searchContainer}>
        <SearchInput
          placeholder="Search Package by Organisers"
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInput}
        />
      </FlexView>

      {isLoading ? (
        <FlexView style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.primary} />
        </FlexView>
      ) : isError ? (
        <FlexView style={styles.emptyState}>
          <TextDs style={styles.emptyStateText}>{errorMessage}</TextDs>
          <TouchableOpacity onPress={() => refetch()} activeOpacity={0.7} style={{ marginTop: 8 }}>
            <TextDs style={styles.emptyStateText}>Tap to retry</TextDs>
          </TouchableOpacity>
        </FlexView>
      ) : (
        <FlatList
          data={filteredPackages}
          keyExtractor={(item) => item.purchaseId}
          extraData={isFetching}
          renderItem={({ item }) => (
            <PackageCard
              package={item}
              onPress={() => navigation.navigate('PackageDetail', { purchaseId: item.purchaseId })}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <FlexView style={styles.emptyState}>
              <TextDs style={styles.emptyStateText}>No packages found</TextDs>
            </FlexView>
          }
          refreshing={isFetching && !isLoading}
          onRefresh={() => refetch()}
        />
      )}
    </SafeAreaView>
  );
};
