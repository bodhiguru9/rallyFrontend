import React, { useState, useEffect } from 'react';
import { TextDs, FlexView } from '@components';
import {Modal,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Image} from 'react-native';
import { Upload } from 'lucide-react-native';
import { colors } from '@theme';
import { Select, FormInput, Button } from '@components/global';
import { DocumentUpload } from '../DocumentUpload';
import type { CompleteProfileModalProps } from './CompleteProfileModal.types';
import { styles } from './style/CompleteProfileModal.styles';

const BANK_OPTIONS = [
  { label: 'Emirates NBD', value: 'emirates-nbd' },
  { label: 'ADCB', value: 'adcb' },
  { label: 'FAB', value: 'fab' },
  { label: 'Mashreq', value: 'mashreq' },
  { label: 'Dubai Islamic Bank', value: 'dib' },
  { label: 'HSBC', value: 'hsbc' },
];

export const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
}) => {
  // Use key to reset state when modal opens - increments when visible becomes true
  const [modalKey, setModalKey] = useState(0);
  
  // Initialize state from initialData - will reset when modalKey changes
  const initialState = React.useMemo(() => ({
    bankName: initialData?.bankName || '',
    iban: initialData?.iban || '',
    accountHolderName: initialData?.accountHolderName || '',
    emiratesIdFront: initialData?.emiratesIdFront || null,
    emiratesIdBack: initialData?.emiratesIdBack || null,
  }), [modalKey, initialData]);
  
  const [bankName, setBankName] = useState<string>(initialState.bankName);
  const [iban, setIban] = useState<string>(initialState.iban);
  const [accountHolderName, setAccountHolderName] = useState<string>(initialState.accountHolderName);
  const [emiratesIdFront, setEmiratesIdFront] = useState<string | null>(initialState.emiratesIdFront);
  const [emiratesIdBack, setEmiratesIdBack] = useState<string | null>(initialState.emiratesIdBack);

  // Update form state when modal opens (key changes) or initial values change
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (modalKey > 0) {
      setBankName(initialState.bankName);
      setIban(initialState.iban);
      setAccountHolderName(initialState.accountHolderName);
      setEmiratesIdFront(initialState.emiratesIdFront);
      setEmiratesIdBack(initialState.emiratesIdBack);
    }
  }, [modalKey, initialState]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Reset state when modal opens by incrementing key to force remount
  useEffect(() => {
    if (visible) {
      setModalKey((prev) => prev + 1);
    }
  }, [visible]);

  const handleSubmit = () => {
    onSubmit({
      bankName,
      iban,
      accountHolderName,
      emiratesIdFront,
      emiratesIdBack,
    });
  };

  const uploadCount = [emiratesIdFront, emiratesIdBack].filter(Boolean).length;

  return (
    <Modal
      key={modalKey}
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={styles.modalContainer}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Title */}
            <TextDs style={styles.title}>Complete Your Profile</TextDs>

            {/* Description */}
            <TextDs style={styles.description}>
              To create an event, we need some information from you due to security and payment reasons
            </TextDs>

            {/* Bank Name */}
            <FlexView style={styles.section}>
              <Select
                label="Bank Name"
                placeholder="Select your bank"
                options={BANK_OPTIONS}
                value={bankName}
                onSelect={setBankName}
                containerStyle={styles.selectContainer}
              />
            </FlexView>

            {/* IBAN */}
            <FlexView style={styles.section}>
              <FormInput
                label="IBAN"
                placeholder="Enter your IBAN number"
                value={iban}
                onChangeText={setIban}
                containerStyle={styles.inputContainer}
              />
            </FlexView>

            {/* Account Holder Name */}
            <FlexView style={styles.section}>
              <FormInput
                label="Account Holder Name"
                placeholder="What is your name registered as?"
                value={accountHolderName}
                onChangeText={setAccountHolderName}
                containerStyle={styles.inputContainer}
              />
            </FlexView>

            {/* Emirates ID Upload Section */}
            <FlexView style={styles.section}>
              <FlexView style={styles.emiratesIdHeader}>
                <TextDs style={styles.emiratesIdLabel}>Emirates ID</TextDs>
                <TextDs style={styles.uploadCount}>{uploadCount}/2 uploads</TextDs>
              </FlexView>

              <TextDs style={styles.emiratesIdInstruction}>
                To verify your identity, please upload a copy of your Emirates ID
              </TextDs>

              <TouchableOpacity
                style={styles.uploadButton}
                activeOpacity={0.7}
                onPress={() => {
                  // Open upload for the first empty slot
                  if (!emiratesIdFront) {
                    // Trigger upload for front
                    console.log('Upload front document');
                  } else if (!emiratesIdBack) {
                    // Trigger upload for back
                    console.log('Upload back document');
                  }
                }}
              >
                <Upload size={20} color={colors.primary} />
                <TextDs style={styles.uploadButtonText}>Upload Document</TextDs>
              </TouchableOpacity>

              <TextDs style={styles.uploadHint}>
                Max file size 4MB in jpeg, jpg, png.
              </TextDs>

              {/* Image Previews */}
              <FlexView style={styles.imagePreviewsContainer}>
                <DocumentUpload
                  label="Front"
                  imageUri={emiratesIdFront}
                  onImageSelect={(uri) => setEmiratesIdFront(uri)}
                  onRemove={() => setEmiratesIdFront(null)}
                />
                <DocumentUpload
                  label="Back"
                  imageUri={emiratesIdBack}
                  onImageSelect={(uri) => setEmiratesIdBack(uri)}
                  onRemove={() => setEmiratesIdBack(null)}
                />
              </FlexView>
            </FlexView>

            {/* Submit Button */}
            <Button
              onPress={handleSubmit}
              variant="primary"
              style={styles.submitButton}
            >
              <TextDs size={14} weight="semibold" color="white">
                Create Event
              </TextDs>
            </Button>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

