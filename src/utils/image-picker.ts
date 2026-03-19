import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export interface ImagePickerResult {
  uri: string;
  width: number;
  height: number;
  type?: string;
  fileName?: string;
  fileSize?: number;
}

/**
 * Pick an image from the device's image library
 * Requests permissions if needed and allows user to select an image
 */
export const pickImageFromLibrary = async (aspect: [number, number] = [1, 1]): Promise<ImagePickerResult | null> => {
  try {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library to upload a profile picture.',
      );
      return null;
    }

    // Launch image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect, // Square aspect ratio default
      quality: 0.8,
    });

    if (result.canceled) {
      return null;
    }

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      type: asset.type ?? undefined,
      fileName: asset.fileName ?? undefined,
      fileSize: asset.fileSize,
    };
  } catch (error) {
    console.error('Error picking image:', error);
    Alert.alert('Error', 'Failed to pick image. Please try again.');
    return null;
  }
};

/**
 * Take a photo using the device's camera
 * Requests permissions if needed and allows user to capture a photo
 */
export const takePhotoWithCamera = async (aspect: [number, number] = [1, 1]): Promise<ImagePickerResult | null> => {
  try {
    // Request permission to access camera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your camera to take a profile picture.',
      );
      return null;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect, // Square aspect ratio default
      quality: 0.8,
    });

    if (result.canceled) {
      return null;
    }

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      type: asset.type ?? undefined,
      fileName: asset.fileName ?? undefined,
      fileSize: asset.fileSize,
    };
  } catch (error) {
    console.error('Error taking photo:', error);
    Alert.alert('Error', 'Failed to take photo. Please try again.');
    return null;
  }
};

/**
 * Show action sheet to choose between camera and library
 * Returns the selected image or null if cancelled
 */
export const showImagePickerOptions = (aspect: [number, number] = [1, 1]): Promise<ImagePickerResult | null> => {
  return new Promise((resolve) => {
    Alert.alert(
      'Choose Profile Picture',
      'Select how you want to add your profile picture',
      [
        {
          text: 'Take Photo',
          onPress: () => {
            setTimeout(async () => {
              const result = await takePhotoWithCamera(aspect);
              resolve(result);
            }, 300);
          },
        },
        {
          text: 'Choose from Library',
          onPress: () => {
            setTimeout(async () => {
              const result = await pickImageFromLibrary(aspect);
              resolve(result);
            }, 300);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => resolve(null),
        },
      ],
      { cancelable: true },
    );
  });
};
