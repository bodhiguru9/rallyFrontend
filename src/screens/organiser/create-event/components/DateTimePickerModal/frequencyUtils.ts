import type { FrequencySelection } from '../FrequencyModal';

const DAY_ABBREVS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

/** Serialize FrequencySelection to form's string[] format. Includes end date when "Ends On" is set. */
export function frequencyToFormValue(selection: FrequencySelection): string[] {
  const addEnds = (base: string[]) => {
    if (selection.ends !== 'never' && typeof selection.ends === 'object') {
      const d = selection.ends.on;
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; // YYYY-MM-DD

      return [...base, 'ends', dateStr];
    }
    return base;
  };
  if (selection.type === 'never') return [];
  if (selection.type === 'daily') return addEnds(['daily']);
  if (selection.type === 'monthly') return addEnds(['monthly']);
  if (selection.type === 'yearly') return addEnds(['yearly']);
  if (selection.type === 'custom') {
    const base = selection.customValue ? ['custom', selection.customValue] : ['custom'];
    return addEnds(base);
  }
  if (selection.type === 'weekly') {
    const days = selection.weeklyDays ?? [];
    const base = days.length === 0 ? ['weekly'] : ['weekly', ...days.map((d) => DAY_ABBREVS[d])];
    return addEnds(base);
  }
  return [];
}

/** Parse form's string[] back to FrequencySelection. Handles 'ends' + date in the array. */
function parseEnds(value: string[]): FrequencySelection['ends'] {
  const endsIdx = value.indexOf('ends');
  if (endsIdx >= 0 && value[endsIdx + 1]) {
    const dateStr = value[endsIdx + 1];
    const d = new Date(dateStr + 'T12:00:00Z');
    if (!isNaN(d.getTime())) return { on: d };
  }
  return 'never';
}

/** Extract recurrence part (exclude 'ends' and date) for day parsing */
function stripEnds(value: string[]): string[] {
  const endsIdx = value.indexOf('ends');
  if (endsIdx >= 0) return value.slice(0, endsIdx);
  return value;
}

export function formValueToFrequency(
  value: string[] | undefined,
): FrequencySelection | undefined {
  if (!value || value.length === 0) {
    return { type: 'never', ends: 'never' };
  }
  const first = value[0];
  const ends = parseEnds(value);
  const base = stripEnds(value);

  if (first === 'daily') return { type: 'daily', ends };
  if (first === 'monthly') return { type: 'monthly', ends };
  if (first === 'yearly') return { type: 'yearly', ends };
  if (first === 'custom') {
    return { type: 'custom', ends, customValue: base[1] ?? '' };
  }
  if (first === 'weekly') {
    const weeklyDays = base
      .slice(1)
      .map((d) => {
        const s = String(d).toLowerCase();
        const idx = DAY_ABBREVS.indexOf(s);
        if (idx >= 0) return idx;
        const num = parseInt(s, 10);
        if (num >= 0 && num <= 6) return num;
        return -1;
      })
      .filter((i) => i >= 0)
      .sort((a, b) => a - b);
    return { type: 'weekly', weeklyDays, ends };
  }
  if (first?.startsWith('weekly-')) {
    const dayName = first.replace('weekly-', '');
    const dayIndex = DAY_ABBREVS.indexOf(dayName);
    if (dayIndex >= 0) return { type: 'weekly', weeklyDays: [dayIndex], ends };
  }
  return { type: 'never', ends: 'never' };
}

/** Get display label for a FrequencySelection */
export function getFrequencyDisplayLabel(selection: FrequencySelection): string {
  let base = '';
  if (selection.type === 'never') base = 'Never';
  else if (selection.type === 'daily') base = 'Daily';
  else if (selection.type === 'monthly') base = 'Monthly';
  else if (selection.type === 'yearly') base = 'Yearly';
  else if (selection.type === 'custom') base = selection.customValue || 'Custom';
  else if (selection.type === 'weekly') {
    const days = selection.weeklyDays ?? [];
    if (days.length === 0) base = 'Weekly';
    else {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      base = `Weekly on ${days.map((d) => dayNames[d]).join(', ')}`;
    }
  } else base = 'Never';

  if (selection.ends !== 'never' && typeof selection.ends === 'object') {
    const d = selection.ends.on;
    const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    return `${base} until ${dateStr}`;
  }
  return base;
}
