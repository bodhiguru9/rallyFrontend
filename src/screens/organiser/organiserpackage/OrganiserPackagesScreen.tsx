import React, { useMemo, useState } from 'react';
import { TextDs, FlexView, ImageDs } from '@components';
import { ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, Plus, User } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { colors } from '@theme';
import { styles } from './style/OrganiserPackagesScreen.styles';
import { CreatePackageModal } from './components/CreatePackageModal/CreatePackageModal';
import { useOrganiserMyPackages } from '@hooks/organiser';

type TNav = NativeStackNavigationProp<RootStackParamList, 'OrganiserPackages'>;

export const OrganiserPackagesScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();
  const [isCreateVisible, setIsCreateVisible] = useState(false);

  const { data, isLoading } = useOrganiserMyPackages();

  const formatEventType = (value: any) => {
    const raw = Array.isArray(value) ? value.filter(Boolean).join(', ') : String(value ?? '');
    if (!raw.trim()) {
      return '—';
    }
    // "special class" -> "Special Class", "social" -> "Social"
    return raw
      .split(/\s+/g)
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
      .join(' ');
  };

  const packages = useMemo(() => {
    const raw = (data as any)?.data?.packages ?? (data as any)?.packages ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [data]);

  const renderEmpty = () => (
    <FlexView style={styles.emptyContent}>

      <ImageDs image="userCoin" size={170} />

      <TextDs style={styles.title}>Create a Package</TextDs>
      <TextDs style={styles.subtitle}>
        Create a package for players to buy credits in{'\n'}bulk to book events.
      </TextDs>

      <TouchableOpacity
        style={styles.primaryButton}
        activeOpacity={0.85}
        onPress={() => setIsCreateVisible(true)}
      >
        <TextDs style={styles.primaryButtonText}>Create Package</TextDs>
      </TouchableOpacity>
    </FlexView>
  );

  const renderItem = ({ item }: { item: any }) => {
    const sportLabel = Array.isArray(item.sports) && item.sports.length ? item.sports[0] : 'Sport';
    const validityText =
      typeof item.validityMonths === 'number' ? `${item.validityMonths} months` : '—';
    const events = item.maxEvents ?? item.events ?? 0;
    const price = item.packagePrice ?? item.price ?? 0;
    const eventTypeText = formatEventType(item.eventType ?? item.eventTypes ?? item.event_type);
    const packageId = String(item.packageId ?? item.id ?? '');
    return (
      <TouchableOpacity
        style={styles.packageCard}
        activeOpacity={0.85}
        onPress={() => {
          if (packageId) {
            navigation.navigate('OrganiserPackageDetail', { packageId });
          }
        }}
      >
        <FlexView style={styles.cardTopRow}>
          <TextDs style={styles.packageName}>{item.packageName}</TextDs>
          <TextDs style={styles.validityText}>Validity: {validityText}</TextDs>
        </FlexView>

        <FlexView style={styles.cardBottomRow}>
          <FlexView style={styles.leftMeta}>
            <FlexView style={styles.tagPill}>
              <Activity size={12} color="#FF9B44" />
              <TextDs style={styles.tagText}>{sportLabel}</TextDs>
            </FlexView>

            <FlexView style={styles.infoRow}>
              <FlexView style={styles.infoItem}>
                <TextDs style={styles.infoLabel}>Event Type</TextDs>
                <TextDs style={styles.infoValue}>{eventTypeText}</TextDs>
              </FlexView>

              <FlexView style={styles.infoItem}>
                <TextDs style={styles.infoLabel}>No of Events</TextDs>
                <TextDs style={styles.infoValue}>{events}</TextDs>
              </FlexView>
            </FlexView>
          </FlexView>

          <FlexView style={styles.priceRow}>
            <ImageDs image="DhiramIcon" style={styles.priceIcon} />
            <TextDs style={styles.priceText}>{price}</TextDs>
          </FlexView>
        </FlexView>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {isLoading ? (
        <FlexView style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </FlexView>
      ) : packages.length === 0 ? (
        renderEmpty()
      ) : (
        <FlexView>
          <FlexView style={styles.headerRow}>
            <TextDs style={styles.headerTitle}>Packages</TextDs>
            <TouchableOpacity style={styles.createPill} activeOpacity={0.85} onPress={() => setIsCreateVisible(true)}>
              <TextDs style={styles.createPillText}>Create</TextDs>
            </TouchableOpacity>
          </FlexView>

          <FlatList
            data={packages}
            keyExtractor={(item, index) => String(item.packageId ?? item.id ?? index)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </FlexView>
      )}

      {isCreateVisible && (
        <CreatePackageModal visible={isCreateVisible} onClose={() => setIsCreateVisible(false)} />
      )}
    </SafeAreaView>
  );
};

