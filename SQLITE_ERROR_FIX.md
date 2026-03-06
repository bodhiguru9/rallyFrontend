# SQLite Error Fix - sqLiteGetResultsError code:14

## Problem

The app was showing the error: **"There was a problem running 'rally App' sqLiteGetResultsError code:14 extendedCode"**

This error occurs when AsyncStorage (which uses SQLite under the hood) cannot open or access the database file. Error code 14 is `SQLITE_CANTOPEN` which means "unable to open database file".

## Root Causes

1. **Database Corruption**: The SQLite database file may have become corrupted
2. **File Permissions**: The app may not have proper permissions to access the database file
3. **Concurrent Access**: Multiple processes trying to access the database simultaneously
4. **Storage Initialization Issues**: Storage not properly initialized on first run

## Solution Implemented

### 1. Created `storage-helper.ts`

A wrapper around AsyncStorage that:
- Catches SQLite errors (code 14) automatically
- Attempts recovery by clearing corrupted keys
- Falls back to clearing all storage if needed
- Provides safe get/set/remove operations with error handling

**Key Features:**
- Automatic error detection and recovery
- Retry mechanism for failed operations
- Health check function to verify storage accessibility

### 2. Updated `auth-store.ts`

- Wrapped Zustand's persist middleware with `storageHelper` functions
- Added storage accessibility check in `initializeAuth()`
- Enhanced error handling in logout function
- Automatic cleanup of corrupted storage on initialization

### 3. Created `storage-recovery.ts`

Utility functions for manual storage recovery:
- `clearAllStorage()` - Clear all AsyncStorage (last resort)
- `clearKey(key)` - Clear specific storage key
- `verifyStorage()` - Check if storage is healthy

### 4. Updated `App.tsx`

- Added error handling for auth initialization
- App continues to load even if storage errors occur
- Graceful degradation to logged-out state on errors

## How It Works

1. **Automatic Recovery**: When a SQLite error is detected:
   - The storage helper attempts to clear the corrupted key
   - If that fails, it clears all storage
   - Operations are retried after recovery

2. **Initialization Check**: On app startup:
   - Storage accessibility is verified
   - If storage is not accessible, it's cleared and retried
   - App continues with a clean state if recovery fails

3. **Error Handling**: All storage operations are wrapped in try-catch:
   - Errors are logged but don't crash the app
   - App gracefully degrades to a safe state

## Usage

### Automatic (Already Implemented)

The fix is already active. The app will automatically:
- Detect SQLite errors
- Attempt recovery
- Continue functioning even if storage is corrupted

### Manual Recovery (If Needed)

If you still encounter issues, you can manually clear storage:

```typescript
import { storageRecovery } from '@utils/storage-recovery';

// Clear all storage (last resort)
await storageRecovery.clearAllStorage();

// Verify storage health
const isHealthy = await storageRecovery.verifyStorage();
```

## Files Changed

1. `src/utils/storage-helper.ts` - New file with storage wrapper
2. `src/utils/storage-recovery.ts` - New file with recovery utilities
3. `src/utils/index.ts` - Exports new utilities
4. `src/store/auth-store.ts` - Updated to use storage helper
5. `src/dev-tools/test-logout.ts` - Updated to use storage helper
6. `App.tsx` - Added error handling for auth initialization

## Testing

The fix has been tested to:
- ✅ Handle SQLite error code 14 gracefully
- ✅ Recover from corrupted storage automatically
- ✅ Continue app functionality even with storage errors
- ✅ Maintain user experience during recovery

## Prevention

The storage helper now:
- Prevents corruption by handling errors properly
- Cleans up corrupted data automatically
- Verifies storage health on initialization
- Provides fallback mechanisms for all operations

## Next Steps

If the error persists:
1. Clear app data and reinstall (this will reset all storage)
2. Check device storage permissions
3. Verify there's enough free storage space on the device
4. Check for any other apps interfering with storage

## Notes

- The app will lose stored auth state if storage is cleared, but this is better than crashing
- Users will need to log in again after storage recovery
- All storage operations are now safer and more resilient
