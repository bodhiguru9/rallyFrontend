import React, { useState } from 'react';
import { TextDs, FlexView } from '@components';
import { TouchableOpacity, Image, Alert, View } from 'react-native';
import { File, X } from 'lucide-react-native';
import { colors } from '@theme';
import { showImagePickerOptions } from '@utils/image-picker';
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
    setModalVisible(false);
    setTimeout(async () => {
      const imageResult = await showImagePickerOptions([16, 10]);
      console.log('DocumentUpload Picked Asset:', imageResult);
      if (imageResult && imageResult.uri) {
        onImageSelect(imageResult.uri);
      }
    }, 400);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {imageUri ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
            <View style={{ ...styles.removeButton, top: 2 }}>
              <X size={12} color={colors.text.white} />
            </View>
            <TextDs size={10} color="white" style={{ position: 'absolute', bottom: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.5)', padding: 2 }}>
              Loaded
            </TextDs>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <File size={24} color={colors.text.secondary} />
          </View>
        )}
        <TextDs style={styles.label}>{label}</TextDs>
      </TouchableOpacity>

      <ChooseImageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImageSelect={handleImageSelect}
        onUploadPress={handleUploadPress}
        hideRecommended={true}
      />
    </>
  );
};

