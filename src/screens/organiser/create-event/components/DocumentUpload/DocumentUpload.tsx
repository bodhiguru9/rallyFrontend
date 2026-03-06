import React, { useState } from 'react';
import { TextDs,  FlexView } from '@components';
import {TouchableOpacity, Image, Alert} from 'react-native';
import { File, X } from 'lucide-react-native';
import { colors } from '@theme';
import { ChooseImageModal } from '../ChooseImageModal';
import type { DocumentUploadProps } from './DocumentUpload.types';
import { styles } from './style/DocumentUpload.styles';

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  imageUri,
  onImageSelect,
  onRemove,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    if (imageUri) {
      // Show options: View or Remove
      Alert.alert(
        label,
        'What would you like to do?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: onRemove },
          { text: 'Change', onPress: () => setModalVisible(true) },
        ]
      );
    } else {
      setModalVisible(true);
    }
  };

  const handleImageSelect = (uri: string) => {
    onImageSelect(uri);
    setModalVisible(false);
  };

  const handleUploadPress = () => {
    // In a real app, this would open the device's document picker
    // For now, we'll use a placeholder
    console.log('Open document picker');
    setModalVisible(false);
    // Example: onImageSelect('https://via.placeholder.com/300');
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {imageUri ? (
          <FlexView style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
            <FlexView style={styles.removeButton}>
              <X size={12} color={colors.text.white} />
            </FlexView>
          </FlexView>
        ) : (
          <FlexView style={styles.placeholder}>
            <File size={24} color={colors.text.secondary} />
          </FlexView>
        )}
        <TextDs style={styles.label}>{label}</TextDs>
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

