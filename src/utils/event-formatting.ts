/**
 * Maps policyJoind (organiser's refund policy) to human-readable text.
 * Returns null only for invalid values.
 */
export const getRefundPolicyText = (policyJoind?: string | null): string | null => {
  switch (policyJoind) {
    case 'before-event':
      return 'Refunds are available up to 24 hours before the event. Cancellations made within 24 hours of the event are non-refundable.';
    case 'no-refund':
      return 'Users can cancel at anytime but No refunds are given irrespective of time';
    default:
      return null;
  }
};

/**
 * For paid events: use organiser's policy or default to before-event if API doesn't return it yet.
 */
export const getRefundPolicyForDisplay = (policyJoind?: string | null, isPaidEvent?: boolean): string | null => {
  const text = getRefundPolicyText(policyJoind);
  if (text) return text;
  // Backend may not return policyJoind yet; show default (matches create-event placeholder)
  return isPaidEvent ? getRefundPolicyText('before-event') : null;
};

/**
 * Formats event restrictions for display.
 * Logic synchronized with EventDetailsScreen.
 */
export const getRestrictionsText = (event: any): string => {
  const restrictions: string[] = [];

  if (event.eventGender && event.eventGender !== 'mixed' && event.eventGender.toLowerCase() !== 'open') {
    restrictions.push(`Gender: ${event.eventGender.charAt(0).toUpperCase() + event.eventGender.slice(1)} Only`);
  }

  if (event.eventMinAge || event.eventMaxAge) {
    if (event.eventMinAge && event.eventMaxAge) {
      restrictions.push(`Age: ${event.eventMinAge}-${event.eventMaxAge} years`);
    } else if (event.eventMinAge) {
      restrictions.push(`Age: ${event.eventMinAge}+ years`);
    } else if (event.eventMaxAge) {
      if (event.eventMaxAge === 100) {
      } else {
        restrictions.push(`Age: Up to ${event.eventMaxAge} years`);
      }
    }
  }

  const level = event.eventSportsLevel || event.eventLevelRestriction;
  if (level && level.toLowerCase() !== 'all') {
    restrictions.push(`${level.charAt(0).toUpperCase() + level.slice(1)} Level`);
  }

  if (restrictions.length === 0) {
    return 'No restrictions for this event';
  }

  return restrictions.join(', ');
};
