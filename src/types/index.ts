// Global types only
export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Export domain models
export * from './models/event';
export * from './models/user';

// Export API types
export * from './api/event.types';
export * from './api/filter-options.types';
export * from './api/user.types';
export * from './api/waitlist.types';
export * from './api/pending-requests.types';
export * from './location.types';
