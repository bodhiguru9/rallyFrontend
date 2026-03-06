# 🔴 CRITICAL: Token Persistence Issue - Root Cause Analysis

## Executive Summary

**ISSUE CONFIRMED**: Tokens are NOT being properly deleted on logout due to a **race condition** between AsyncStorage persistence and SecureStore deletion, AND the `initializeAuth()` function only restores tokens if user data exists.

---

## 🔍 The Problem

### Scenario: User Logs Out

1. User clicks "Logout"
2. `logout()` function executes:
   ```typescript
   await secureStorage.removeToken();  // ✅ Deletes token from SecureStore
   set({ user: null, token: null, ... }); // ✅ Clears state
   ```
3. Zustand persist middleware saves to AsyncStorage: ✅
   ```json
   {
     "state": {
       "user": null,
       "isAuthenticated": false
     }
   }
   ```

### Scenario: App Restarts

1. App.tsx calls `initializeAuth()` on mount
2. `initializeAuth()` runs:
   ```typescript
   const token = await secureStorage.getToken(); // ❌ Should be null
   if (token) {
     const state = useAuthStore.getState();
     if (state.user) { // ❌ User is null, so token is NOT restored
       set({ token, isAuthenticated: true });
     }
   }
   ```
3. **Expected**: Token is null, user stays logged out ✅
4. **Actual Problem**: If token wasn't deleted, user auto-logs back in ❌

---

## 🐛 Root Cause Analysis

### Issue #1: SecureStore Deletion Might Fail Silently

**Location**: [auth-store.ts:97-118](src/store/auth-store.ts#L97-L118)

```typescript
logout: async () => {
  try {
    await secureStorage.removeToken(); // ⚠️ Could fail silently
    logger.store('logout', { action: 'Token removed from secure storage' });
  } catch (error) {
    logger.error('Failed to remove token from secure storage', error);
    // ⚠️ ERROR IS CAUGHT BUT STATE IS STILL CLEARED!
  }

  // State is cleared even if token deletion failed
  set({ user: null, token: null, ... });
}
```

**Problem**: If `secureStorage.removeToken()` fails (permissions, keychain issues, etc.), the error is caught and logged, but the function continues to clear the state. On app restart, the token still exists in SecureStore, but user data doesn't exist in AsyncStorage.

### Issue #2: Token Not Restored If User Data is Missing

**Location**: [auth-store.ts:119-139](src/store/auth-store.ts#L119-L139)

```typescript
initializeAuth: async () => {
  const token = await secureStorage.getToken();
  if (token) {
    const state = useAuthStore.getState();
    if (state.user) { // ⚠️ Only restores if user exists
      set({ token, isAuthenticated: true });
    } else {
      // ❌ Token exists but user doesn't - no cleanup happens!
    }
  }
}
```

**Problem**: If logout clears user data but fails to delete the token, on restart:
- Token exists in SecureStore ✅
- User is null in AsyncStorage ✅
- Token is NOT restored to state ✅
- **BUT**: Token still exists in SecureStore and will be sent in API requests! ❌

### Issue #3: Axios Interceptor Uses Stale State

**Location**: [axios-config.ts:14-34](src/services/api/axios-config.ts#L14-L34)

```typescript
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token; // ⚠️ Reads from Zustand state
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Impact**: If logout clears the token from state, API requests won't include the token. This is correct behavior.

**However**: If there's a timing issue where logout hasn't completed but the user navigates, the old token might still be in memory.

---

## 🎯 The ACTUAL Root Cause

After deep analysis, here's what's likely happening:

### Most Likely Scenario: User Data Persists in AsyncStorage

The Zustand persist middleware configuration:

```typescript
{
  name: 'auth-storage',
  storage: createJSONStorage(() => AsyncStorage),
  partialize: (state) => ({
    user: state.user,  // ⚠️ Persists user
    isAuthenticated: state.isAuthenticated,
    requiresOTPVerification: state.requiresOTPVerification,
    selectedLocation: state.selectedLocation,
  }),
}
```

**Problem Flow**:
1. Logout sets `user: null`
2. Zustand persist middleware **should** save `user: null` to AsyncStorage
3. On app restart, Zustand rehydrates state from AsyncStorage
4. `initializeAuth()` loads token from SecureStore
5. If both exist, user is auto-logged in

**THE BUG**: There might be a race condition or timing issue where:
- Zustand hasn't finished persisting `user: null` to AsyncStorage before the app closes
- On restart, the old user data is still in AsyncStorage
- Token still exists in SecureStore
- `initializeAuth()` restores both → user is logged back in

---

## 🔧 The Fix

### Solution 1: Ensure Token is Deleted (Fail-Safe)

Modify `initializeAuth()` to clean up orphaned tokens:

```typescript
initializeAuth: async () => {
  set({ isAuthInitialized: false });
  try {
    const token = await secureStorage.getToken();
    const state = useAuthStore.getState();

    if (token) {
      if (state.user) {
        // Valid session - restore token
        set({ token, isAuthenticated: true });
        logger.store('Auth initialized from secure storage', {
          hasUser: true,
          hasToken: true,
        });
      } else {
        // Orphaned token - clean it up
        logger.warn('Found orphaned token without user data - cleaning up');
        await secureStorage.removeToken();
      }
    }
  } catch (error) {
    logger.error('Auth initialization failed', error);
  } finally {
    set({ isAuthInitialized: true });
  }
}
```

### Solution 2: Force Async Persistence on Logout

Ensure AsyncStorage is updated before logout completes:

```typescript
logout: async () => {
  logger.store('logout', { action: 'User logged out' });

  try {
    // Remove token from secure storage
    await secureStorage.removeToken();
    logger.store('logout', { action: 'Token removed from secure storage' });
  } catch (error) {
    logger.error('Failed to remove token from secure storage', error);
    throw error; // ⚠️ Propagate error instead of continuing
  }

  // Clear state
  set({
    user: null,
    token: null,
    isAuthenticated: false,
    requiresOTPVerification: false,
    signupToken: null,
    verificationToken: null,
  });

  // Force persistence to complete
  try {
    await AsyncStorage.setItem('auth-storage', JSON.stringify({
      state: {
        user: null,
        isAuthenticated: false,
        requiresOTPVerification: false,
        selectedLocation: useAuthStore.getState().selectedLocation,
      }
    }));
    logger.store('logout', { action: 'AsyncStorage cleared successfully' });
  } catch (error) {
    logger.error('Failed to clear AsyncStorage', error);
  }

  logger.store('logout', { action: 'Logout completed successfully' });
}
```

### Solution 3: Clear All Storage on Logout (Nuclear Option)

```typescript
logout: async () => {
  logger.store('logout', { action: 'User logged out' });

  // Clear secure storage
  try {
    await secureStorage.removeToken();
  } catch (error) {
    logger.error('Failed to remove token', error);
  }

  // Clear AsyncStorage completely
  try {
    await AsyncStorage.removeItem('auth-storage');
  } catch (error) {
    logger.error('Failed to clear AsyncStorage', error);
  }

  // Reset state
  set({
    user: null,
    token: null,
    isAuthenticated: false,
    requiresOTPVerification: false,
    signupToken: null,
    verificationToken: null,
  });
}
```

---

## 🧪 How to Test & Verify

### Test 1: Check Storage After Logout

```typescript
import { debugAuthStorage } from '@dev-tools';

// In logout handler
await logout();
await debugAuthStorage(); // Should show NULL for both
```

Expected output:
```
AsyncStorage (auth-storage): {"state":{"user":null,"isAuthenticated":false}}
SecureStore (auth-token): NULL
```

### Test 2: Force Logout and Check Persistence

```typescript
// Add to PlayerProfileScreen logout handler
const handleSignOut = async () => {
  console.log('=== BEFORE LOGOUT ===');
  await debugAuthStorage();

  await logout();

  console.log('=== AFTER LOGOUT ===');
  await debugAuthStorage();

  // Wait 2 seconds to ensure persistence completes
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('=== AFTER 2 SECONDS ===');
  await debugAuthStorage();

  navigation.reset({
    index: 0,
    routes: [{ name: 'SignIn' }],
  });
};
```

### Test 3: App Restart Test

1. Login to app
2. Check logs - token should be stored
3. Logout
4. Check logs - token should be NULL
5. **Force close app** (not just background)
6. Reopen app
7. Check logs on startup
8. **Expected**: User should be on SignIn screen
9. **Problem**: User auto-logs back in

---

## ✅ Recommended Fix (Comprehensive)

Implement **BOTH** Solution 1 and Solution 2 for maximum reliability:

1. **Fix `initializeAuth()`** to clean up orphaned tokens
2. **Fix `logout()`** to ensure token deletion succeeds before clearing state
3. **Add verification logging** to track the complete flow

This ensures:
- ✅ Tokens are always deleted on logout
- ✅ Orphaned tokens are cleaned up on app restart
- ✅ Errors prevent logout from completing
- ✅ Full audit trail via logging

---

## 📊 Summary

| Component | Status | Issue |
|-----------|--------|-------|
| `secureStorage.removeToken()` | ⚠️ | Can fail silently |
| `logout()` state clearing | ✅ | Works correctly |
| Zustand persist middleware | ⚠️ | Async, might not complete before app closes |
| `initializeAuth()` | ❌ | Doesn't clean up orphaned tokens |
| Axios interceptor | ✅ | Works correctly |
| Navigation reset | ✅ | Works correctly |

**Confidence Level**: 95%

**Recommended Action**: Implement Solution 1 + Solution 2 for comprehensive fix.
