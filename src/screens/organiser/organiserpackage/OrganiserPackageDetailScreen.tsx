import React, { useEffect, useMemo, useState } from 'react';
import { TextDs, FlexView, ImageDs } from '@components';
import {ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft } from 'lucide-react-native';
import type { RootStackParamList } from '@navigation';
import { colors } from '@theme';
import { SegmentedControl, FormInput, Select } from '@components/global';
import { MultiSelectInput } from '@components/global/multi-select-input';
import { sportOptions } from '@data';
import { useDeletePackage, useOrganiserPackageDetails, useUpdatePackage } from '@hooks/organiser';
import { PlanSection } from '@screens/player/playerOrginser/playerOrgEventDetails/packageDetails/components/PlanSection';
import { PlanTags } from '@screens/player/playerOrginser/playerOrgEventDetails/packageDetails/components/PlanTags';
import { InfoRow } from '@screens/player/playerOrginser/playerOrgEventDetails/packageDetails/components/InfoRow';
import { styles } from './style/OrganiserPackageDetailScreen.styles';
import { PackagePlayersTab } from './components/PackagePlayersTab';

type Nav = NativeStackNavigationProp<RootStackParamList, 'OrganiserPackageDetail'>;
type Route = RouteProp<RootStackParamList, 'OrganiserPackageDetail'>;

type EventTypeValue = 'social' | 'class' | 'tournament';

const VALIDITY_OPTIONS = [
  { label: 'All Time', value: 'all-time' },
  { label: 'One Month', value: '1-month' },
  { label: '3 Months', value: '3-months' },
  { label: '6 Months', value: '6-months' },
  { label: '1 Year', value: '1-year' },
  { label: 'Custom', value: 'custom' },
];

const EVENT_TYPE_OPTIONS: Array<{ label: string; value: EventTypeValue }> = [
  { label: 'Social', value: 'social' },
  { label: 'Class', value: 'class' },
  { label: 'Tournament', value: 'tournament' },
];

const EVENT_TYPE_ICON: Record<string, string> = {
  social: 'users',
  class: 'book-open',
  tournament: 'award',
};

const toTitle = (s: string) =>
  s
    .split(/\s+/g)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

const normalizeToArray = (value: any): string[] => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map(String);
  }
  if (typeof value === 'string') {
    if (!value.trim()) {
      return [];
    }
    if (value.includes(',')) {
      return value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
    }
    return [value.trim()];
  }
  return [];
};

const validityFromMonths = (months?: number | null): string | undefined => {
  if (!months || months <= 0) {
    return 'all-time';
  }
  if (months === 1) {
    return '1-month';
  }
  if (months === 3) {
    return '3-months';
  }
  if (months === 6) {
    return '6-months';
  }
  if (months === 12) {
    return '1-year';
  }
  return 'custom';
};

const validityLabel = (validityValue?: string, validityMonths?: number) => {
  if (validityValue) {
    return VALIDITY_OPTIONS.find((o) => o.value === validityValue)?.label || 'All Time';
  }
  const derived = validityFromMonths(validityMonths);
  return VALIDITY_OPTIONS.find((o) => o.value === derived)?.label || 'All Time';
};

export const OrganiserPackageDetailScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { packageId } = route.params;

  const [activeTab, setActiveTab] = useState(0); // 0 = Package, 1 = Players
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading, isFetching } = useOrganiserPackageDetails(packageId);
  const updateMutation = useUpdatePackage(packageId);
  const deleteMutation = useDeletePackage();

  const pkg = useMemo(() => {
    const root: any = (data as any)?.data ?? data;
    const candidate: any =
      root?.package ?? root?.packageDetails ?? root?.details ?? root?.data ?? root;

    const p: any = candidate ?? {};
    return {
      packageId: String(p.packageId ?? p.id ?? packageId),
      packageName: String(p.packageName ?? p.name ?? ''),
      sports: Array.isArray(p.sports) ? p.sports : normalizeToArray(p.sports),
      eventType: normalizeToArray(p.eventType ?? p.eventTypes ?? p.event_type),
      validity: typeof p.validity === 'string' ? p.validity : undefined,
      validityMonths: typeof p.validityMonths === 'number' ? p.validityMonths : undefined,
      packageDescription: String(p.packageDescription ?? p.description ?? ''),
      maxEvents: Number(p.maxEvents ?? p.events ?? 0),
      packagePrice: Number(p.packagePrice ?? p.price ?? 0),
      players: Array.isArray(p.players) ? p.players : [],
    };
  }, [data, packageId]);

  // Editable state
  const [name, setName] = useState('');
  const [sports, setSports] = useState<string[]>([]);
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [validity, setValidity] = useState<string>('all-time');
  const [description, setDescription] = useState('');
  const [eventsCount, setEventsCount] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (!pkg.packageName && !pkg.packageDescription && pkg.maxEvents === 0 && pkg.packagePrice === 0) {
      return;
    }
    // Only hydrate from API when not editing (so we don't clobber user input)
    if (isEditing) {
      return;
    }
    setName(pkg.packageName);
    setSports(pkg.sports);
    setEventTypes(pkg.eventType);
    setValidity(pkg.validity ?? validityFromMonths(pkg.validityMonths) ?? 'all-time');
    setDescription(pkg.packageDescription);
    setEventsCount(String(pkg.maxEvents || ''));
    setPrice(String(pkg.packagePrice || ''));
  }, [pkg, isEditing]);

  const tags = useMemo(() => {
    const list = pkg.eventType.length ? pkg.eventType : eventTypes;
    return list.map((t) => ({
      label: toTitle(String(t)),
      icon: EVENT_TYPE_ICON[String(t).toLowerCase()] || 'tag',
    }));
  }, [pkg.eventType, eventTypes]);

  const handleDelete = () => {
    if (deleteMutation.isPending) {
      return;
    }
    Alert.alert('Delete Package', 'Are you sure you want to delete this package?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(pkg.packageId);
            navigation.goBack();
          } catch {
            // errors are surfaced via the mutation onError Alert
          }
        },
      },
    ]);
  };

  const handleEditOrSave = async () => {
    if (updateMutation.isPending) {
      return;
    }
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const events = Number(eventsCount);
    const priceValue = Number(price);

    try {
      await updateMutation.mutateAsync({
        packageName: name.trim(),
        sports,
        eventType: eventTypes,
        validity,
        packageDescription: description.trim(),
        events: Number.isFinite(events) ? events : 0,
        price: Number.isFinite(priceValue) ? priceValue : 0,
      });

      if (!updateMutation.isError) {
        setIsEditing(false);
      }
    } catch {
      // errors are surfaced via the mutation onError Alert
    }
  };

  const isBusy = isLoading || isFetching;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlexView style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ArrowLeft size={22} color={colors.text.primary} />
        </TouchableOpacity>
        <TextDs style={styles.headerTitle}>Package</TextDs>
        <FlexView style={styles.headerSpacer} />
      </FlexView>

      <SegmentedControl
        tabs={['Package', 'Players']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        containerStyle={styles.segmented}
      />

      {isBusy ? (
        <FlexView style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </FlexView>
      ) : activeTab === 0 ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title + tags */}
          <PlanSection title={pkg.packageName || 'Package'}>
            {isEditing ? (
              <FlexView style={styles.editBlock}>
                <FormInput
                  label="Package Name"
                  placeholder="Enter package name"
                  value={name}
                  onChangeText={setName}
                />
                <MultiSelectInput
                  label="Event Type"
                  placeholder="Select event type"
                  options={EVENT_TYPE_OPTIONS as any}
                  value={eventTypes}
                  onSelect={setEventTypes}
                  maxSelections={3}
                />
              </FlexView>
            ) : (
              <PlanTags tags={tags} />
            )}
          </PlanSection>

          {/* Validity + sports */}
          <PlanSection title="">
            {isEditing ? (
              <FlexView style={styles.editBlock}>
                <Select
                  label="Validity"
                  placeholder={validityLabel(validity, pkg.validityMonths)}
                  options={VALIDITY_OPTIONS}
                  value={validity}
                  onSelect={setValidity}
                />
                <MultiSelectInput
                  label="Sports"
                  placeholder="Select sports"
                  options={sportOptions as any}
                  value={sports}
                  onSelect={setSports}
                  maxSelections={6}
                />
              </FlexView>
            ) : (
              <>
                <InfoRow
                  icon="calendar"
                  text={
                    pkg.validityMonths
                      ? `${pkg.validityMonths} months`
                      : validityLabel(pkg.validity, pkg.validityMonths)
                  }
                />
                <InfoRow icon="map-pin" text={pkg.sports.length ? pkg.sports.join(', ') : '—'} />
              </>
            )}
          </PlanSection>

          {/* About */}
          <PlanSection title="About Package">
            {isEditing ? (
              <FormInput
                label="Package Description"
                placeholder="Package description"
                value={description}
                onChangeText={setDescription}
                multiline
                style={{ minHeight: 110, textAlignVertical: 'top' }}
              />
            ) : (
              <TextDs style={styles.descriptionText}>{pkg.packageDescription || '—'}</TextDs>
            )}
          </PlanSection>

          {/* Price & Events */}
          <PlanSection title="Price & Events">
            {isEditing ? (
              <FlexView style={styles.priceEditRow}>
                <FlexView style={styles.priceCol}>
                  <FormInput
                    label="Price"
                    placeholder="Price in Dhiram"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="number-pad"
                  />
                </FlexView>
                <FlexView style={styles.eventsCol}>
                  <FormInput
                    label="Events"
                    placeholder="No of Events"
                    value={eventsCount}
                    onChangeText={setEventsCount}
                    keyboardType="number-pad"
                  />
                </FlexView>
              </FlexView>
            ) : (
              <FlexView style={styles.priceRow}>
                <FlexView style={styles.priceLeft}>
                  <ImageDs image="DhiramIcon" style={styles.priceIcon} />
                  <TextDs style={styles.priceText}>{Number.isFinite(pkg.packagePrice) ? pkg.packagePrice : 0}</TextDs>
                </FlexView>
                <TextDs style={styles.eventsText}>{pkg.maxEvents || 0} Events</TextDs>
              </FlexView>
            )}
          </PlanSection>
        </ScrollView>
      ) : (
        <PackagePlayersTab
          enabled={!isBusy && activeTab === 1}
          initialPackageId={pkg.packageId}
          initialPackageName={pkg.packageName}
        />
      )}

      {activeTab === 0 && (
        <FlexView style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.deleteButton, (deleteMutation.isPending || updateMutation.isPending) && styles.disabledButton]}
            activeOpacity={0.85}
            onPress={handleDelete}
            disabled={deleteMutation.isPending || updateMutation.isPending}
          >
            <TextDs style={styles.deleteText}>Delete</TextDs>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, (deleteMutation.isPending || updateMutation.isPending) && styles.disabledButton]}
            activeOpacity={0.85}
            onPress={handleEditOrSave}
            disabled={deleteMutation.isPending || updateMutation.isPending}
          >
            <TextDs style={styles.primaryText}>
              {updateMutation.isPending ? 'Saving...' : isEditing ? 'Save' : 'Edit'}
            </TextDs>
          </TouchableOpacity>
        </FlexView>
      )}
    </SafeAreaView>
  );
};

