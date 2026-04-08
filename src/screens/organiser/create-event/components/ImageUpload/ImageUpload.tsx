import React, { useState } from 'react';
import { TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ChooseImageModal } from '../ChooseImageModal';
import type { ImageUploadProps } from './ImageUpload.types';
import { styles } from './style/ImageUpload.styles';
import { FlexView, ImageDs } from '@components';

export const ImageUpload: React.FC<ImageUploadProps> = ({
  imageUri,
  onImageSelect,
  containerStyle,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleImageSelect = (uri: string) => {
    onImageSelect(uri);
  };

  const handleUploadPress = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant photo library access to upload images.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Show options: Camera or Gallery
      Alert.alert(
        'Upload Image',
        'Choose an option',
        [
          {
            text: 'Take Photo',
            onPress: handleTakePhoto,
          },
          {
            text: 'Choose from Gallery',
            onPress: handlePickImage,
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request permissions');
    }
  };

  const handleTakePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant camera access to take photos.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const MAX_FILE_SIZE = 100 * 1024; // 100KB

        if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
          Alert.alert(
            'Image Too Large',
            `Selected image is too large (${(asset.fileSize / 1024).toFixed(1)}KB). Please select an image smaller than 100KB.`
          );
          return;
        }

        onImageSelect(asset.uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio as per modal hint
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const MAX_FILE_SIZE = 100 * 1024; // 100KB

        if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
          Alert.alert(
            'Image Too Large',
            `Selected image is too large (${(asset.fileSize / 1024).toFixed(1)}KB). Please select an image smaller than 100KB.`
          );
          return;
        }

        onImageSelect(asset.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, containerStyle]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <FlexView width={70} height={70}>
            <ImageDs image='placeholderInput' size={70} style={{
              borderRadius: 12
            }} />
            <FlexView width={28} height={28} alignItems='center' justifyContent='center' rounded position='absolute' bottom={-10} right={-10} borderWhite glassBg>
              <ImageDs image='uploadIcon' size={18} />
            </FlexView>
          </FlexView>
        )}
      </TouchableOpacity>

      <ChooseImageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImageSelect={handleImageSelect}
        onUploadPress={handleUploadPress}
      />
    </>
  );
};
