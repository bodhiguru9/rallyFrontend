/**
 * Returns up to 2 initials from fullName (e.g. "John Doe" → "JD", "Alice" → "A").
 * Used consistently across the app for profile/avatar fallbacks when no image is set.
 */
export function getInitials(fullName: string | undefined): string {
  if (!fullName?.trim()) {
    return '?';
  }
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
  }
  return fullName.slice(0, 2).toUpperCase();
}
