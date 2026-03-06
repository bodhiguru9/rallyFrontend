/**
 * User utility functions
 * Shared utilities for user name and initial extraction
 */

/**
 * Extract user initials from full name
 * Returns first two letters if single name, or first letter of first two words
 * @param fullName - The user's full name
 * @returns User initials in uppercase (e.g., "JD" for "John Doe")
 */
export const getUserInitials = (fullName: string): string => {
  if (!fullName) {
    return '';
  }
  const parts = fullName.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return fullName.substring(0, 2).toUpperCase();
};

/**
 * Extract first name from full name
 * Fallback to user type if no name provided
 * @param fullName - The user's full name (optional)
 * @param userType - The user's type ('player' or 'organiser')
 * @returns First name or fallback label
 */
export const getUserFirstName = (fullName?: string, userType?: 'player' | 'organiser'): string => {
  if (fullName) {
    return fullName.split(' ')[0];
  }
  return userType === 'organiser' ? 'Organiser' : 'Player';
};
