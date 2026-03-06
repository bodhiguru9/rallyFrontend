export interface RangeSliderProps {
  min?: number;
  max?: number;
  initialMin?: number;
  initialMax?: number;
  onValueChange?: (values: { min: number; max: number }) => void;
  containerStyle?: object;
}

