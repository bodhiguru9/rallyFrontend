import React, { useEffect, useState } from 'react';
import { TextDs, FlexView, ImageDs } from '@components';
import { ScrollView, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { FormInput } from '@components/global';
import { IconTag } from '@components/global/IconTag';
import { Dropdown } from '@designSystem/molecules/dropdown';
import { spacing } from '@theme';
import { styles } from './style/CreatePackageModal.styles';
import { useCreatePackage } from '@hooks/organiser';

type EventType = 'social' | 'class' | 'tournament' | 'training';

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

const EVENT_TYPE_OPTIONS: Array<{ label: string; value: EventType; customLabel?: React.ReactNode }> = [
  { label: 'Social', value: 'social', customLabel: <IconTag title="Social" /> },
  { label: 'Class', value: 'class', customLabel: <IconTag title="Class" /> },
  { label: 'Tournament', value: 'tournament', customLabel: <IconTag title="Tournament" /> },
  { label: 'Training', value: 'training', customLabel: <IconTag title="Training" /> },
];

const SPORT_OPTIONS = [
  { label: 'Football', value: 'football', icon: 'footballBlue', color: '#3D6F92' },
  { label: 'Tennis', value: 'tennis', icon: 'tennisBlue', color: '#3D6F92' },
  { label: 'Table Tennis', value: 'table-tennis', icon: 'tableTennisBlue', color: '#3D6F92' },
  { label: 'Basketball', value: 'basketball', icon: 'basketballBlue', color: '#3D6F92' },
  { label: 'Badminton', value: 'badminton', icon: 'badmintonBlue', color: '#3D6F92' },
  { label: 'Cricket', value: 'cricket', icon: 'cricketBlue', color: '#3D6F92' },
  { label: 'Indoor Cricket', value: 'indoor-cricket', icon: 'indoorCricketBlue', color: '#3D6F92' },
  { label: 'Padel', value: 'padel', icon: 'padelBlue', color: '#3D6F92' },
  { label: 'Pickleball', value: 'pickleball', icon: 'pickleballBlue', color: '#3D6F92' },
  { label: 'Pilates', value: 'pilates', icon: 'pilatesBlue', color: '#3D6F92' },
  { label: 'Running', value: 'running', icon: 'runningBlue', color: '#3D6F92' },
];

export const CreatePackageModal: React.FC<CreatePackageModalProps> = ({ visible, onClose }) => {
  const createPackageMutation = useCreatePackage();
  const [packageName, setPackageName] = useState('');
  const [sports, setSports] = useState<string[]>([]);
  const [validity, setValidity] = useState('all-time');
  const [description, setDescription] = useState('');
  const [eventsCount, setEventsCount] = useState('');
  const [price, setPrice] = useState('');

  const [eventTypes, setEventTypes] = useState<string[]>([]);

  // Reset form each time the modal opens so the next open doesn't get "stuck"
  useEffect(() => {
    if (!visible) {
      return;
    }
    const timeoutId = setTimeout(() => {
      setPackageName('');
      setSports([]);
      setValidity('all-time');
      setDescription('');
      setEventsCount('');
      setPrice('');
      setEventTypes([]);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [visible]);

  const handleConfirm = async () => {
    const events = Number(eventsCount);
    const priceValue = Number(price);

    await createPackageMutation.mutateAsync({
      packageName: packageName.trim(),
      sports: sports,
      eventType: eventTypes as EventType[],
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
          <FlexView style={[styles.header, { marginTop: spacing.md }]}>
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
                  options={SPORT_OPTIONS}
                  leftIcon={<ImageDs image="sportIcon" size={20} />}
                  multiSelect
                  value={sports}
                  onSelect={setSports}
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
                  multiSelect
                  value={eventTypes}
                  onSelect={setEventTypes}
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

