import { Platform } from 'react-native';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { logger } from '@dev-tools/logger';
import { storageHelper } from '@utils/storage-helper';

export type LocationPermissionStatus = 'undetermined' | 'granted' | 'denied';

export interface SavedCoordinates {
  latitude: number;
  longitude: number;
}

interface LocationState {
  locationPermissionStatus: LocationPermissionStatus;
  lastCoordinates: SavedCoordinates | null;
  lastUpdated: string | null;
  setLocationPermissionStatus: (status: LocationPermissionStatus) => void;
  setLastCoordinates: (coords: SavedCoordinates | null) => void;
  setLastUpdated: (isoString: string | null) => void;
  initializeLocation: () => Promise<void>;
  /** Refresh current position; no-op on web or if permission not granted. */
  refreshCurrentPosition: () => Promise<void>;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      locationPermissionStatus: 'undetermined',
      lastCoordinates: null,
      lastUpdated: null,
      setLocationPermissionStatus: (status) => {
        logger.store('setLocationPermissionStatus', { status });
        set({ locationPermissionStatus: status });
      },
      setLastCoordinates: (coords) => {
        set({ lastCoordinates: coords });
      },
      setLastUpdated: (isoString) => {
        set({ lastUpdated: isoString });
      },
      initializeLocation: async () => {
        if (Platform.OS === 'web') {
          return;
        }
        try {
          const { requestForegroundPermissionsAsync, getCurrentPositionAsync } = await import(
            'expo-location'
          );

          const { status } = await requestForegroundPermissionsAsync();
          const permissionStatus: LocationPermissionStatus =
            status === 'granted' ? 'granted' : status === 'denied' ? 'denied' : 'undetermined';

          set({ locationPermissionStatus: permissionStatus });
          logger.store('Location permission result', { status: permissionStatus });

          if (status === 'granted') {
            try {
              const position = await getCurrentPositionAsync({
                accuracy: 4, // Balanced (expo-location Accuracy enum)
              });
              const coords: SavedCoordinates = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              set({
                lastCoordinates: coords,
                lastUpdated: new Date().toISOString(),
              });
              logger.store('Location saved to device', {
                latitude: coords.latitude,
                longitude: coords.longitude,
              });
            } catch (positionError) {
              logger.warn('Could not get current position', positionError);
              // Permission granted but position failed (e.g. no GPS) - still save permission
            }
          }
        } catch (error) {
          logger.error('Location initialization failed', error);
          set({ locationPermissionStatus: 'denied' });
        }
      },
      refreshCurrentPosition: async () => {
        if (Platform.OS === 'web') {
          return;
        }
        const { locationPermissionStatus: status } = get();
        if (status !== 'granted') {
          return;
        }
        try {
          const { getCurrentPositionAsync } = await import('expo-location');
          const position = await getCurrentPositionAsync({
            accuracy: 4,
          });
          const coords: SavedCoordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          set({
            lastCoordinates: coords,
            lastUpdated: new Date().toISOString(),
          });
          logger.store('Location refreshed', { latitude: coords.latitude, longitude: coords.longitude });
        } catch (err) {
          logger.warn('Could not refresh position', err);
        }
      },
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => ({
        getItem: (name: string): Promise<string | null> => {
          return storageHelper.getItem(name);
        },
        setItem: async (name: string, value: string): Promise<void> => {
          await storageHelper.setItem(name, value);
        },
        removeItem: async (name: string): Promise<void> => {
          await storageHelper.removeItem(name);
        },
      })),
      partialize: (state) => ({
        locationPermissionStatus: state.locationPermissionStatus,
        lastCoordinates: state.lastCoordinates,
        lastUpdated: state.lastUpdated,
      }),
    },
  ),
);
