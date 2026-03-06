import React, { useState } from 'react';
import { TextDs,  FlexView } from '@components';
import {Modal,
  TouchableOpacity,
  Image,
  Pressable} from 'react-native';
import { CloudUpload } from 'lucide-react-native';
import { colors } from '@theme';
import { SearchInput } from '@components/global';
import type { ChooseImageModalProps, RecommendedImage } from './ChooseImageModal.types';
import { styles } from './style/ChooseImageModal.styles';

// Mock recommended images - in a real app, these would come from an API
const RECOMMENDED_IMAGES: RecommendedImage[] = [
  {
    id: '1',
    uri: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=400&fit=crop',
  },
  {
    id: '2',
    uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
  },
  {
    id: '3',
    uri: 'https://images.unsplash.com/photo-1622163642999-9586b5e08e5f?w=400&h=400&fit=crop',
  },
];

export const ChooseImageModal: React.FC<ChooseImageModalProps> = ({
  visible,
  onClose,
  onImageSelect,
  onUploadPress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleImageSelect = (image: RecommendedImage) => {
    onImageSelect(image.uri);
    onClose();
  };

  const handleUploadPress = () => {
    onUploadPress();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()} style={styles.modalContainer}>
          {/* Title */}
          <TextDs style={styles.title}>Choose Image</TextDs>

          {/* Search Bar */}
          <FlexView style={styles.searchContainer}>
            <SearchInput
              placeholder="Search Players by Name"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </FlexView>

          {/* Recommended Section */}
          <FlexView style={styles.recommendedSection}>
            <TextDs style={styles.recommendedTitle}>Recommended</TextDs>
            <FlexView style={styles.recommendedImagesContainer}>
              {RECOMMENDED_IMAGES.map((image) => (
                <TouchableOpacity
                  key={image.id}
                  style={styles.recommendedImage}
                  onPress={() => handleImageSelect(image)}
                  activeOpacity={0.7}
                >
                  <Image
                    source={{ uri: image.uri }}
                    style={styles.recommendedImageContent}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </FlexView>
          </FlexView>

          {/* Upload Button */}
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUploadPress}
            activeOpacity={0.7}
          >
            <CloudUpload size={20} color={colors.text.white} />
            <TextDs style={styles.uploadButtonText}>Upload your own image</TextDs>
          </TouchableOpacity>

          {/* Ratio Hint */}
          <FlexView style={styles.ratioHint}>
            <TextDs style={styles.ratioHintText}>
              The ideal ratio for this image is 1:1 (Square)
            </TextDs>
          </FlexView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

