export interface ChooseImageModalProps {
  visible: boolean;
  onClose: () => void;
  onImageSelect: (imageUri: string) => void;
  onUploadPress: () => void;
}

export interface RecommendedImage {
  id: string;
  uri: string;
  thumbnail?: string;
}

