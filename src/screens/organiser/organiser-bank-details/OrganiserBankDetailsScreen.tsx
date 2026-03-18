import React, { useMemo, useState } from 'react';
import { TextDs, FlexView } from '@components';
import { Card } from '@components/global/Card';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { colors, spacing, getFontStyle } from '@theme';
import { FormInput } from '@components/global';
import { Dropdown } from '@designSystem/molecules/dropdown/Dropdown';
import {
  useCreateOrganiserBankAccount,
  useOrganiserBankAccounts,
  useOrganiserBankAccount,
  useUpdateOrganiserBankAccount,
  useDeleteOrganiserBankAccount,
} from '@hooks/organiser';
import type { OrganiserBankAccount } from '@services/organiser-service';
import { styles } from './style/OrganiserBankDetailsScreen.styles';
import { useEffect } from 'react';

type TNav = NativeStackNavigationProp<RootStackParamList, 'OrganiserBankDetails'>;
type BankDetailsRoute = RouteProp<RootStackParamList, 'OrganiserBankDetails'>;

const BANK_OPTIONS = [
  { label: 'First Abu Dhabi Bank', value: 'First Abu Dhabi Bank' },
  { label: 'Emirates NBD', value: 'Emirates NBD' },
  { label: 'Abu Dhabi Commercial Bank (ADCB)', value: 'Abu Dhabi Commercial Bank (ADCB)' },
  { label: 'Abu Dhabi Islamic Bank (ADIB)', value: 'Abu Dhabi Islamic Bank (ADIB)' },
  { label: 'Ajman Bank', value: 'Ajman Bank' },
  { label: 'Al Hilal Bank', value: 'Al Hilal Bank' },
  { label: 'Al Maryah Community Bank', value: 'Al Maryah Community Bank' },
  { label: 'Bank of Sharjah', value: 'Bank of Sharjah' },
  { label: 'Commercial Bank International', value: 'Commercial Bank International' },
  { label: 'Commercial Bank of Dubai (CBD)', value: 'Commercial Bank of Dubai (CBD)' },
  { label: 'Dubai Islamic Bank (DIB)', value: 'Dubai Islamic Bank (DIB)' },
  { label: 'Emirates Islamic Bank', value: 'Emirates Islamic Bank' },
  { label: 'Emirates Investment Bank', value: 'Emirates Investment Bank' },
  { label: 'Invest Bank', value: 'Invest Bank' },
  { label: 'Mashreq Bank', value: 'Mashreq Bank' },
  { label: 'National Bank of Fujairah', value: 'National Bank of Fujairah' },
  { label: 'National Bank of Ras Al Khaimah', value: 'National Bank of Ras Al Khaimah' },
  { label: 'National Bank of Umm Al Quwain', value: 'National Bank of Umm Al Quwain' },
  { label: 'Sharjah Islamic Bank', value: 'Sharjah Islamic Bank' },
  { label: 'United Arab Bank', value: 'United Arab Bank' },
  { label: 'Wio Bank', value: 'Wio Bank' },
  { label: 'Zand Bank', value: 'Zand Bank' },
  { label: 'Other', value: 'Other' },
];

function BankAccountCard({
  account,
  onEdit,
  onDelete,
  isDeleting,
}: {
  account: OrganiserBankAccount;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <Card style={styles.cardWrapper}>
      <FlexView style={styles.cardRow}>
        <TextDs style={styles.cardLabel}>Account holder</TextDs>
        <TextDs style={styles.cardValue}>{account.accountHolderName}</TextDs>
      </FlexView>
      <FlexView style={styles.cardRow}>
        <TextDs style={styles.cardLabel}>IBAN</TextDs>
        <TextDs style={styles.cardValue}>{account.iban}</TextDs>
      </FlexView>
      <FlexView style={styles.cardRow}>
        <TextDs style={styles.cardLabel}>Bank</TextDs>
        <TextDs style={styles.cardValue}>{account.bankName}</TextDs>
      </FlexView>
      <FlexView style={styles.cardActions}>
        <TouchableOpacity
          style={styles.cardActionButton}
          onPress={onEdit}
          disabled={isDeleting}
          activeOpacity={0.7}
        >
          <FlexView style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Pencil size={16} color={colors.primary} />
            <TextDs style={styles.cardActionText}>Edit</TextDs>
          </FlexView>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cardActionButton}
          onPress={onDelete}
          disabled={isDeleting}
          activeOpacity={0.7}
        >
          <FlexView style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Trash2 size={16} color={colors.status.error} />
            <TextDs style={styles.cardActionDanger}>Delete</TextDs>
          </FlexView>
        </TouchableOpacity>
      </FlexView>
    </Card>
  );
}


export const OrganiserBankDetailsScreen: React.FC = () => {
  const navigation = useNavigation<TNav>();
  const route = useRoute<BankDetailsRoute>();
  const bankAccountId = route.params?.bankAccountId;

  const isEditMode = !!bankAccountId;

  const { data: listData, isLoading: isLoadingList } = useOrganiserBankAccounts({
    enabled: !isEditMode,
  });
  const { data: singleAccount, isLoading: isLoadingSingle } = useOrganiserBankAccount(
    bankAccountId ?? null,
    { enabled: isEditMode },
  );

  const createBankAccount = useCreateOrganiserBankAccount();
  const updateBankAccount = useUpdateOrganiserBankAccount(bankAccountId ?? null);
  const deleteBankAccount = useDeleteOrganiserBankAccount();

  const bankAccounts = listData?.bankAccounts ?? [];
  const isSaving = createBankAccount.isPending || updateBankAccount.isPending;

  const [accountHolderName, setAccountHolderName] = useState('');
  const [iban, setIban] = useState('');
  const [bankName, setBankName] = useState('');

  useEffect(() => {
    if (isEditMode && singleAccount) {
      setAccountHolderName(singleAccount.accountHolderName);
      setIban(singleAccount.iban);
      setBankName(singleAccount.bankName);
    }
  }, [isEditMode, singleAccount]);

  const handleSave = () => {
    const trimmedName = accountHolderName.trim();
    const trimmedIban = iban.trim();
    if (!trimmedName || !trimmedIban || !bankName) {
      Alert.alert('Error', 'Please fill all bank details.');
      return;
    }

    const payload = { accountHolderName: trimmedName, iban: trimmedIban, bankName };

    if (isEditMode && bankAccountId) {
      updateBankAccount.mutate(payload, {
        onSuccess: () => {
          Alert.alert('Saved', 'Bank account updated successfully.');
          navigation.goBack();
        },
      });
    } else {
      createBankAccount.mutate(payload, {
        onSuccess: () => {
          Alert.alert('Saved', 'Bank account saved successfully.');
          setAccountHolderName('');
          setIban('');
          setBankName('');
        },
      });
    }
  };

  const handleEdit = (id: string) => {
    navigation.navigate('OrganiserBankDetails', { bankAccountId: id });
  };

  const handleDelete = (account: OrganiserBankAccount) => {
    Alert.alert(
      'Delete bank account',
      `Remove ${account.bankName} (${account.iban})? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteBankAccount.mutate(account.id, {
              onSuccess: () => {
                Alert.alert('Deleted', 'Bank account removed.');
              },
            });
          },
        },
      ],
    );
  };

  if (isEditMode && isLoadingSingle) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <FlexView style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={22} color={colors.text.primary} />
          </TouchableOpacity>
          <TextDs style={styles.headerTitle}>Edit Bank Account</TextDs>
          <View style={styles.saveButton} />
        </FlexView>
        <FlexView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </FlexView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlexView style={styles.header}>
        <FlexView style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={22} color={colors.text.primary} />
          </TouchableOpacity>
          <TextDs style={styles.headerTitle}>
            Bank Details
          </TextDs>
        </FlexView>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={colors.text.white} />
          ) : (
            <TextDs style={styles.saveButtonText}>Save</TextDs>
          )}
        </TouchableOpacity>
      </FlexView>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <FlexView style={styles.section}>
          <FormInput
            label="Account Holder Name"
            labelWeight="semibold"
            placeholder="Account holder name"
            value={accountHolderName}
            onChangeText={setAccountHolderName}
            containerStyle={styles.inputContainer}
            inputContainerStyle={{ backgroundColor: colors.glass.background.white, borderWidth: 0 }}
          />
          <FormInput
            label="IBAN"
            labelWeight="semibold"
            placeholder="Enter IBAN"
            value={iban}
            onChangeText={setIban}
            containerStyle={styles.inputContainer}
            inputContainerStyle={{ backgroundColor: colors.glass.background.white, borderWidth: 0 }}
            autoCapitalize="characters"
          />
          <TextDs style={[styles.bankLabel, { ...getFontStyle(14, 'semibold') }]}>Bank Name</TextDs>
          <Dropdown
            value={bankName}
            onSelect={setBankName}
            options={BANK_OPTIONS}
            placeholder="Select Bank"
            containerStyle={{ backgroundColor: colors.glass.background.white, borderWidth: 0, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: 12 }}
          />
        </FlexView>

        {!isEditMode && bankAccounts.length > 0 && (
          <FlexView style={styles.listSection}>
            <TextDs style={styles.listSectionTitle}>Your existing accounts</TextDs>
            {isLoadingList ? (
              <FlexView style={{ paddingVertical: spacing.lg, alignItems: 'center' }}>
                <ActivityIndicator size="small" color={colors.primary} />
              </FlexView>
            ) : (
              bankAccounts.map((account) => (
                <BankAccountCard
                  key={account.id}
                  account={account}
                  onEdit={() => handleEdit(account.id)}
                  onDelete={() => handleDelete(account)}
                  isDeleting={deleteBankAccount.isPending}
                />
              ))
            )}
          </FlexView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
