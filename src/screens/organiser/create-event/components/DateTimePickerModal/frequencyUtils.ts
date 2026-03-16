import type { FrequencySelection } from '../FrequencyModal';

const DAY_ABBREVS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

/** Serialize FrequencySelection to form's string[] format */
export function frequencyToFormValue(selection: FrequencySelection): string[] {
  if (selection.type === 'never') return [];
  if (selection.type === 'daily') return ['daily'];
  if (selection.type === 'monthly') return ['monthly'];
  if (selection.type === 'yearly') return ['yearly'];
  if (selection.type === 'custom') {
    return selection.customValue ? ['custom', selection.customValue] : ['custom'];
  }
  if (selection.type === 'weekly') {
    const days = selection.weeklyDays ?? [];
    if (days.length === 0) return ['weekly'];
    return ['weekly', ...days.map((d) => DAY_ABBREVS[d])];
  }
  return [];
}

/** Parse form's string[] back to FrequencySelection */
export function formValueToFrequency(
  value: string[] | undefined,
): FrequencySelection | undefined {
  if (!value || value.length === 0) {
    return { type: 'never', ends: 'never' };
  }
  const first = value[0];
  if (first === 'daily') return { type: 'daily', ends: 'never' };
  if (first === 'monthly') return { type: 'monthly', ends: 'never' };
  if (first === 'yearly') return { type: 'yearly', ends: 'never' };
  if (first === 'custom') {
    return {
      type: 'custom',
      ends: 'never',
      customValue: value[1] ?? '',
    };
  }
  if (first === 'weekly') {
    const weeklyDays = value
      .slice(1)
      .map((d) => DAY_ABBREVS.indexOf(d))
      .filter((i) => i >= 0)
      .sort((a, b) => a - b);
    return {
      type: 'weekly',
      weeklyDays,
      ends: 'never',
    };
  }
  // Legacy format: 'weekly-sunday', 'weekly-monday', etc.
  if (first?.startsWith('weekly-')) {
    const dayName = first.replace('weekly-', '');
    const dayIndex = DAY_ABBREVS.indexOf(dayName);
    if (dayIndex >= 0) {
      return { type: 'weekly', weeklyDays: [dayIndex], ends: 'never' };
    }
  }
  return { type: 'never', ends: 'never' };
}

/** Get display label for a FrequencySelection */
export function getFrequencyDisplayLabel(selection: FrequencySelection): string {
  if (selection.type === 'never') return 'Never';
  if (selection.type === 'daily') return 'Daily';
  if (selection.type === 'monthly') return 'Monthly';
  if (selection.type === 'yearly') return 'Yearly';
  if (selection.type === 'custom') return selection.customValue || 'Custom';
  if (selection.type === 'weekly') {
    const days = selection.weeklyDays ?? [];
    if (days.length === 0) return 'Weekly';
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `Weekly on ${days.map((d) => dayNames[d]).join(', ')}`;
  }
  return 'Never';
}
