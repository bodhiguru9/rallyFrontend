export interface IDateFilterProps {
  dates: Array<{
    date: number;
    day: string;
    month: string;
    isSelected: boolean;
    fullDate?: string; // ISO string for accurate date tracking across months
  }>;
  onSelectDate: (fullDate: string | null) => void;
  onScrollNearEnd?: () => void; // Callback when user scrolls near end
  canLoadMore?: boolean; // Indicates if more dates can be loaded
}
