export interface DocumentUploadProps {
  label: string;
  imageUri: string | null;
  onImageSelect: (uri: string) => void;
  onRemove: () => void;
}

