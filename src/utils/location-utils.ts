import type { EventLocation } from '@app-types/location.types';

/**
 * Formats a location object into a descriptive string.
 * Combines the name (venue) and displayName (address) if they are different.
 * This ensures organisers and players see the specific venue name instead of just a street address.
 * 
 * @param location - The EventLocation object to format
 * @returns A formatted string e.g., "Dubai Mall, Financial Centre Rd, Dubai"
 */
export function formatLocationString(location: EventLocation | null | undefined): string {
  if (!location) {
    return '';
  }

  const { name, displayName } = location;

  // If no name is provided, just return the address
  if (!name || name.trim() === '') {
    return displayName || '';
  }

  // If name and displayName are the same, just return one
  if (name.trim() === displayName?.trim()) {
    return name;
  }

  // Check if the name is already included at the beginning of the displayName
  // Often Nominatim/Google includes the name in the full address string.
  if (displayName?.toLowerCase().startsWith(name.toLowerCase())) {
    return displayName;
  }

  // Combine them: "Name, Address"
  return `${name}, ${displayName}`;
}
