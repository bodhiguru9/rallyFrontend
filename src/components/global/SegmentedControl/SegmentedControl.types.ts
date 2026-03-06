export interface SegmentedControlProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
  containerStyle?: object;
}

