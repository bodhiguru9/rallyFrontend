export interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

export interface WhatsAppInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onUseEmailPress: () => void;
}
