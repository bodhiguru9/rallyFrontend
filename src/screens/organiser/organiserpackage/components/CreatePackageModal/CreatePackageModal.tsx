import React, { useEffect, useState } from 'react';
import { TextDs, FlexView, ImageDs } from '@components';
import { ScrollView, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { FormInput } from '@components/global';
import { Dropdown } from '@designSystem/molecules/dropdown';
import { sportOptions } from '@data';
import { styles } from './style/CreatePackageModal.styles';
import { useCreatePackage } from '@hooks/organiser';

type EventType = 'social' | 'class' | 'tournament';

export interface CreatePackageModalProps {
  visible: boolean;
  onClose: () => void;
}

const VALIDITY_OPTIONS = [
  { label: 'All Time', value: 'all-time' },
  { label: 'One Month', value: '1-month' },
  { label: '3 Months', value: '3-months' },
  { label: '6 Months', value: '6-months' },
  { label: '1 Year', value: '1-year' },
  { label: 'Custom', value: 'custom' },
];

const EVENT_TYPE_OPTIONS: Array<{ label: string; value: EventType }> = [
  { label: 'Social', value: 'social' },
  { label: 'Class', value: 'class' },
  { label: 'Tournament', value: 'tournament' },
];

export const CreatePackageModal: React.FC<CreatePackageModalProps> = ({ visible, onClose }) => {
  const createPackageMutation = useCreatePackage();
  const [packageName, setPackageName] = useState('');
  const [sport, setSport] = useState('');
  const [validity, setValidity] = useState('all-time');
  const [description, setDescription] = useState('');
  const [eventsCount, setEventsCount] = useState('');
  const [price, setPrice] = useState('');

  const [eventType, setEventType] = useState<EventType>('social');

  // Reset form each time the modal opens so the next open doesn't get "stuck"
  useEffect(() => {
    if (!visible) {
      return;
    }
    const timeoutId = setTimeout(() => {
      setPackageName('');
      setSport('');
      setValidity('all-time');
      setDescription('');
      setEventsCount('');
      setPrice('');
      setEventType('social');
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [visible]);

  const handleConfirm = async () => {
    const events = Number(eventsCount);
    const priceValue = Number(price);

    await createPackageMutation.mutateAsync({
      packageName: packageName.trim(),
      sports: sport ? [sport] : [],
      eventType: [eventType],
      validity,
      packageDescription: description.trim(),
      events: Number.isFinite(events) ? events : 0,
      price: Number.isFinite(priceValue) ? priceValue : 0,
    });

    if (!createPackageMutation.isError) {
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}
      >
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={handleClose} />
        <FlexView
          column
          style={[styles.sheetBackground, styles.sheetContent, { maxHeight: '90%', minHeight: '60%' }]}
        >
          <FlexView style={styles.header}>
            <TextDs style={styles.title}>Create Package</TextDs>
          </FlexView>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.form}
          >
            <FlexView glassBg borderWhite width={"100%"} borderRadius={22} py={10} px={16}>
              <TextDs size={14} weight='semibold'>
                Package Name
              </TextDs>
              <FormInput
                variant="transparent"
                placeholder="Enter Your Packages Name"
                value={packageName}
                onChangeText={setPackageName}
                containerStyle={styles.input}
              />
            </FlexView>

            <FlexView height={14} />

            <FlexView style={styles.twoCol}>
              <FlexView style={styles.col}>
                <Dropdown
                  placeholder="Sport"
                  options={sportOptions}
                  leftIcon={<ImageDs image="sportIcon" size={20} />}
                  value={sport}
                  onSelect={setSport}
                  containerStyle={styles.input}
                  labelStyle={styles.dropdownLabel}
                  triggerTextStyle={styles.dropdownTriggerText}
                />
              </FlexView>

              <FlexView style={styles.col}>
                <Dropdown
                  placeholder="Event Type"
                  leftIcon={<ImageDs image="sportIcon" size={20} />}
                  options={EVENT_TYPE_OPTIONS}
                  value={eventType}
                  onSelect={(v) => setEventType(v as EventType)}
                  containerStyle={styles.input}
                  labelStyle={styles.dropdownLabel}
                  triggerTextStyle={styles.dropdownTriggerText}
                />
              </FlexView>
            </FlexView>

            <FlexView height={14} />

            <Dropdown
              placeholder="Validity"
              leftIcon={<ImageDs image="time" size={20} />}
              options={VALIDITY_OPTIONS}
              value={validity}
              onSelect={setValidity}
              containerStyle={styles.fakeSelectWrap}
              labelStyle={styles.dropdownLabel}
              triggerTextStyle={styles.dropdownTriggerText}
            />

            <FlexView height={14} />

            <FormInput
              placeholder="Package Description"
              leftIcon={<ImageDs image="ballpointPen" size={20} />}
              value={description}
              onChangeText={setDescription}
              containerStyle={styles.input}
              multiline
              style={{ minHeight: 42, textAlignVertical: 'top' }}
            />

            <FlexView height={14} />

            <FlexView style={styles.eventsPriceRow}>
              <FlexView style={styles.eventsCol}>
                <FormInput
                  label="Events"
                  leftIcon={<ImageDs image="coinsLight" size={20} />}
                  placeholder="No of Events"
                  value={eventsCount}
                  onChangeText={setEventsCount}
                  keyboardType="number-pad"
                  containerStyle={styles.input}
                />
              </FlexView>
              <FlexView style={styles.priceCol}>
                <FormInput
                  label="Price of Plan"
                  leftIcon={<ImageDs image="dhiramGrayIcon" size={20} />}
                  placeholder="Price in Dhiram"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="number-pad"
                  containerStyle={styles.input}
                />
              </FlexView>
            </FlexView>
          </ScrollView>

          <TouchableOpacity
            style={styles.confirmButton}
            activeOpacity={0.85}
            onPress={handleConfirm}
            disabled={createPackageMutation.isPending}
          >
            <TextDs style={styles.confirmText}>
              {createPackageMutation.isPending ? 'Submitting...' : 'Confirm'}
            </TextDs>
          </TouchableOpacity>
        </FlexView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

