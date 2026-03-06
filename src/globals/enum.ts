// Route Categories
export enum RouteCategory {
  PUBLIC = 'public',
  PROTECTED = 'protected',
  PLAYER_ONLY = 'player_only',
  ORGANISER_ONLY = 'organiser_only',
  AUTH = 'auth', // Auth flow routes (sign in, sign up, etc.)
}

// Log Levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

// User Types
export enum UserType {
  PLAYER = 'player',
  ORGANISER = 'organiser',
}

// Gender
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

// Profile Visibility
export enum ProfileVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

// Organiser Type (YourBest field)
export enum OrganiserType {
  ORGANISER = 'Organiser',
  COACH = 'coach',
  CLUB = 'club',
}

// Event Types (from Home.types.ts - capitalized)
export enum EventType {
  TENNIS = 'Tennis',
  BADMINTON = 'Badminton',
  BASKETBALL = 'Basketball',
  PADEL = 'Padel',
  PILATES = 'Pilates',
  SOCIAL = 'Social',
  CRICKET = 'Cricket',
}

// Event Categories
export enum EventCategory {
  SPORTS = 'Sports',
  SOCIAL = 'Social',
  TOURNAMENT = 'Tournament',
  CLASS = 'Class',
}

// Sports (from CreateEventScreen - lowercase)
export enum Sport {
  FOOTBALL = 'football',
  TENNIS = 'tennis',
  TABLE_TENNIS = 'table-tennis',
  BASKETBALL = 'basketball',
  BADMINTON = 'badminton',
}

// Event Type (from CreateEventScreen form - lowercase, different from EventType)
export enum EventTypeForm {
  SOCIAL = 'social',
  CLASS = 'class',
  TOURNAMENT = 'tournament',
  TRAINING = 'training',
}

// Registration Policy
export enum RegistrationPolicy {
  BEFORE_EVENT = 'before-event',
  UNTIL_START = 'until-start',
  NO_RESTRICTIONS = 'no-restrictions',
}

// Event Status
export enum EventStatus {
  OPEN = 'open',
  WAITING = 'waiting',
  CLOSED = 'closed',
  FULL = 'full',
}

// Waitlist Status
export enum WaitlistStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

// Generic Status (for API/UI states)
export enum Status {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

// Social Login Providers
export enum SocialLoginProvider {
  GOOGLE = 'google',
  APPLE = 'apple',
  FACEBOOK = 'facebook',
}
