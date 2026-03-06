export interface ImageUploadProps {
  imageUri?: string | null;
  onImageSelect: (uri: string) => void;
  containerStyle?: object;
}

