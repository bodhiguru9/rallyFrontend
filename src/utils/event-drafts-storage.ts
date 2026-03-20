import type { PlayerBooking } from '@services/booking-service';
import type { CreateEventFormData } from '@screens/organiser/create-event';
import type { EventType } from '@app-types/models/event';
import { storageHelper } from '@utils/storage-helper';

const STORAGE_KEY = 'organiser-event-drafts';

export interface StoredEventDraft {
  id: string;
  savedAt: string;
  card: PlayerBooking;
}

function formatSportLabel(sport: string): string {
  return sport
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function mapEventTypeForCard(raw: string): EventType {
  if (raw === 'class') {
    return 'training';
  }
  if (raw === 'social' || raw === 'training' || raw === 'tournament' || raw === 'competitive') {
    return raw;
  }
  return 'social';
}

function locationDisplayString(form: CreateEventFormData): string {
  const fromObj =
    typeof form.location === 'object' && form.location !== null
      ? form.location.displayName
      : String(form.location ?? '').trim();
  return fromObj || (form.locationRawInput ?? '').trim();
}

/**
 * Builds a PlayerBooking-shaped object for the Drafts tab from the create-event form (after a successful publish).
 */
export function createPlayerBookingDraftFromForm(
  form: CreateEventFormData,
  draftId: string,
): PlayerBooking {
  const restrictions = form.restrictions;
  let eventGender: PlayerBooking['eventGender'] = 'mixed';
  if (restrictions?.gender === 'male') {
    eventGender = 'male';
  } else if (restrictions?.gender === 'female') {
    eventGender = 'female';
  } else if (restrictions?.gender === 'open' || !restrictions?.gender) {
    eventGender = 'mixed';
  }

  let eventSportsLevel: PlayerBooking['eventSportsLevel'] = null;
  if (restrictions?.sportsLevel && restrictions.sportsLevel !== 'all') {
    const s = restrictions.sportsLevel.toLowerCase();
    if (s === 'beginner' || s === 'intermediate' || s === 'advanced' || s === 'professional') {
      eventSportsLevel = s;
    }
  }

  const now = new Date().toISOString();
  const end =
    form.endDateTime ?? (form.dateTime ? new Date(form.dateTime.getTime() + 3600000) : null);

  return {
    eventId: draftId,
    mongoId: `draft-mongo-${draftId}`,
    eventName: form.eventName.trim(),
    eventImages: form.imageUri ? [form.imageUri] : [],
    eventVideo: null,
    eventType: mapEventTypeForCard(form.eventType),
    eventSports: form.sport ? [formatSportLabel(form.sport)] : [],
    eventDateTime: form.dateTime!.toISOString(),
    eventEndDateTime: end ? end.toISOString() : null,
    eventFrequency: (form.frequency || []).filter(
      (f) => f !== 'ends' && !/^\d{4}-\d{2}-\d{2}$/.test(f),
    ),
    eventFrequencyEndDate: form.frequencyEndDate ?? null,
    eventLocation: locationDisplayString(form),
    eventDescription: form.description.trim(),
    eventGender,
    eventSportsLevel,
    eventMinAge: restrictions?.ageRange?.min ?? null,
    eventMaxAge: restrictions?.ageRange?.max ?? null,
    eventLevelRestriction: restrictions?.levelRestriction?.trim() || null,
    eventMaxGuest: parseInt(form.maxGuests, 10) || 0,
    eventPricePerGuest: parseFloat(form.pricePerGuest) || 0,
    IsPrivateEvent: form.isPrivate,
    eventOurGuestAllowed: !form.disallowGuests,
    eventApprovalReq: form.approvalRequired,
    eventRegistrationStartTime: form.registrationStartTime
      ? form.registrationStartTime.toISOString()
      : null,
    eventRegistrationEndTime: form.registrationEndTime
      ? form.registrationEndTime.toISOString()
      : null,
    eventStatus: 'upcoming',
    eventTotalAttendNumber: 0,
    createdAt: now,
    updatedAt: now,
    booking: {
      bookingId: null,
      joinedAt: now,
      bookingStatus: 'upcoming',
      bookingStatusValue: null,
      isPast: false,
      isOngoing: false,
      isUpcoming: true,
    },
  };
}

function newDraftId(): string {
  return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function loadEventDrafts(): Promise<StoredEventDraft[]> {
  const raw = await storageHelper.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (row): row is StoredEventDraft =>
        row !== null &&
        typeof row === 'object' &&
        'id' in row &&
        'card' in row &&
        typeof (row as StoredEventDraft).id === 'string',
    );
  } catch {
    return [];
  }
}

export async function appendEventDraft(form: CreateEventFormData): Promise<void> {
  const id = newDraftId();
  const savedAt = new Date().toISOString();
  const card = createPlayerBookingDraftFromForm(form, id);
  const existing = await loadEventDrafts();
  const next: StoredEventDraft[] = [{ id, savedAt, card }, ...existing];
  await storageHelper.setItem(STORAGE_KEY, JSON.stringify(next));
}
