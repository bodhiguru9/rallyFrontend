import React, { useMemo, useState } from 'react';
import { TextDs,  FlexView } from '@components';
import {ActivityIndicator, FlatList, Image, TouchableOpacity} from 'react-native';
import { SearchInput, Select } from '@components/global';
import { colors } from '@theme';
import { useOrganiserPackagePurchases } from '@hooks/organiser';
import { styles } from './style/PackagePlayersTab.styles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';

interface PackagePlayersTabProps {
  initialPackageId: string;
  initialPackageName?: string;
  enabled?: boolean;
}

type PurchaseRow = {
  id: string;
  packageId: string;
  packageName: string;
  validityMonths?: number;
  playerName: string;
  playerAvatar?: string | null;
  used: number;
  maxEvents: number;
  eventsJoined?: number;
  userId?: number;
};

const toTitle = (s: string) =>
  s
    .split(/\s+/g)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

export const PackagePlayersTab: React.FC<PackagePlayersTabProps> = ({
  initialPackageId,
  initialPackageName,
  enabled,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [search, setSearch] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState(initialPackageId);

  const { data, isLoading, isFetching } = useOrganiserPackagePurchases({
    enabled,
    page: 1,
    perPage: 20,
  });

  const rows = useMemo<PurchaseRow[]>(() => {
    const root: any = (data as any)?.data ?? data;
    const list: any[] =
      root?.data?.purchases ??
      root?.purchases ??
      root?.data?.items ??
      root?.items ??
      [];

    if (!Array.isArray(list)) {
      return [];
    }

    return list.map((item, index) => {
      const pkg = item.package ?? item.plan ?? item.packageDetails ?? {};
      const buyer = item.player ?? item.user ?? item.purchasedBy ?? item.buyer ?? {};

      const packageId = String(pkg.packageId ?? item.packageId ?? item.planId ?? '');
      const packageName = String(pkg.packageName ?? pkg.name ?? item.packageName ?? initialPackageName ?? 'Plan');
      const validityMonths = typeof pkg.validityMonths === 'number'
        ? pkg.validityMonths
        : typeof item.validityMonths === 'number'
          ? item.validityMonths
          : undefined;

      const playerName = String(buyer.fullName ?? buyer.name ?? 'Player');
      const playerAvatar = buyer.profilePic ?? buyer.avatar ?? null;
      const userId = typeof buyer.userId === 'number' ? buyer.userId : Number(buyer.userId ?? undefined);

      const maxEvents =
        Number(item.maxEvents ?? item.totalEvents ?? item.usageTotal ?? item.usage?.total ?? pkg.maxEvents ?? 0) || 0;

      const eventsJoinedRaw =
        item.eventsJoined ?? item.remainingEvents ?? item.usageRemaining ?? item.usage?.remaining ?? undefined;
      const eventsJoined =
        typeof eventsJoinedRaw === 'number' ? eventsJoinedRaw : Number(eventsJoinedRaw ?? undefined);

      const usedFallback =
        Number(item.usedEvents ?? item.usedCredits ?? item.usageUsed ?? item.usage?.used ?? 0) || 0;

      // Prefer API fields: maxEvents + eventsJoined (used = total - remaining)
      const used =
        Number.isFinite(eventsJoined) && typeof eventsJoined === 'number' && maxEvents > 0
          ? Math.max(0, maxEvents - eventsJoined)
          : usedFallback;

      return {
        id: String(item.id ?? item.purchaseId ?? `${packageId}-${buyer.userId ?? index}`),
        packageId,
        packageName,
        validityMonths,
        playerName,
        playerAvatar,
        used,
        maxEvents,
        eventsJoined: Number.isFinite(eventsJoined) ? eventsJoined : undefined,
        userId: Number.isFinite(userId) ? userId : undefined,
      };
    });
  }, [data, initialPackageName]);

  const planOptions = useMemo(() => {
    const map = new Map<string, string>();
    rows.forEach((r) => {
      if (r.packageId) {
        map.set(r.packageId, r.packageName);
      }
    });
    // Ensure current package exists in dropdown
    if (initialPackageId && !map.has(initialPackageId)) {
      map.set(initialPackageId, initialPackageName || 'Plan');
    }
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [rows, initialPackageId, initialPackageName]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows
      .filter((r) => (selectedPackageId ? r.packageId === selectedPackageId : true))
      .filter((r) => (query ? r.playerName.toLowerCase().includes(query) : true));
  }, [rows, search, selectedPackageId]);

  const isBusy = isLoading || isFetching;

  return (
    <FlexView style={styles.container}>
      <FlexView style={styles.topRow}>
        <SearchInput
          placeholder="Search Players"
          value={search}
          onChangeText={setSearch}
          containerStyle={styles.search}
        />

        <Select
          placeholder={planOptions.find((o) => o.value === selectedPackageId)?.label || (initialPackageName || 'Plan')}
          options={planOptions}
          value={selectedPackageId}
          onSelect={setSelectedPackageId}
          containerStyle={styles.planSelect}
        />
      </FlexView>

      {isBusy ? (
        <FlexView style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </FlexView>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const validity =
              typeof item.validityMonths === 'number'
                ? `${item.validityMonths} ${item.validityMonths === 1 ? 'month' : 'months'}`
                : '—';
            return (
              <TouchableOpacity
                style={styles.playerCard}
                activeOpacity={0.85}
                onPress={() => {
                  if (item.userId) {
                    navigation.navigate('OrganiserPackagePlayerDetail', {
                      userId: item.userId,
                      packageId: item.packageId,
                    });
                  }
                }}
              >
                <FlexView style={styles.avatarWrap}>
                  {item.playerAvatar ? (
                    <Image source={{ uri: item.playerAvatar }} style={styles.avatar} />
                  ) : (
                    <FlexView style={styles.avatarFallback} />
                  )}
                </FlexView>
                <FlexView style={styles.info}>
                  <TextDs style={styles.name}>
                    {toTitle(item.playerName)} ({validity})
                  </TextDs>
                  <TextDs style={styles.usage}>Usage: {item.eventsJoined}/{item.maxEvents}</TextDs>
                </FlexView>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <FlexView style={styles.emptyState}>
              <TextDs style={styles.emptyText}>No players found</TextDs>
            </FlexView>
          }
        />
      )}
    </FlexView>
  );
};
