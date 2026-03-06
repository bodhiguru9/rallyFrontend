# Google OAuth Access Blocked Fix (invalid_request)

This file documents the exact steps to resolve the Google sign-in error:
**"Access blocked: Authorization Error"** and **"Error 400: invalid_request"**.

The Rally app uses `expo-auth-session` in `src/hooks/auth/use-google-auth.ts`. The error is almost always caused by a mismatch between:
- the OAuth **client ID** used by the app, and
- the **redirect URI** registered in Google Cloud.

Follow the steps below in order.

## Step 1: Set the correct client IDs locally

Use **different client IDs per platform**. For Expo Go, you must use the **Web client ID**.

Create or update `.env.local`:

```env
GOOGLE_WEB_CLIENT_ID=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
GOOGLE_IOS_CLIENT_ID=YOUR_IOS_CLIENT_ID.apps.googleusercontent.com
GOOGLE_ANDROID_CLIENT_ID=YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com
```

Notes:
- `app.config.js` already reads these variables and injects them into `extra.googleOAuth`.
- If you only set the legacy `GOOGLE_AUTH_CLIENT_ID`, it will be used for all platforms
  (this is often wrong and can cause `invalid_request`).

## Step 2: Verify which client ID the app actually uses

The app chooses the client ID based on **proxy mode**:
- **Expo Go** (`Constants.appOwnership === 'expo'`) uses the **Web client ID**.
- **Dev client / standalone build** uses **iOS/Android client ID**.

Relevant code: `src/hooks/auth/use-google-auth.ts`

To confirm, add a temporary log right before `AuthSession.makeRedirectUri`:

```ts
logger.info('Google OAuth config', { useProxy, clientId });
```

Remove this log after confirming the values.

## Step 3: Capture the exact redirect URI

The redirect URI must match what is registered in Google Cloud.

Add this temporary log:

```ts
logger.info('Google OAuth redirectUri', { redirectUri });
```

For Expo Go, the redirect URI usually looks like:

```
https://auth.expo.io/@<expo-username>/<app-slug>
```

For standalone builds, it usually looks like:

```
rally-app://
```

Always trust the actual `redirectUri` value printed by the app.

## Step 4: Fix Google Cloud Console configuration

### 4.1 OAuth consent screen

In **Google Cloud Console → APIs & Services → OAuth consent screen**:
- User type: **External** (for testing) or **Internal**
- Add your email to **Test users** if the app is still in Testing
- Ensure scopes include only `openid`, `email`, `profile`

### 4.2 OAuth client IDs

Create 3 separate OAuth client IDs:

1. **Web client ID**
   - Authorized redirect URIs: **add the redirect URI from Step 3**
   - Example:
     - `https://auth.expo.io/@<expo-username>/<app-slug>`

2. **iOS client ID**
   - Bundle ID: `com.rally.app`

3. **Android client ID**
   - Package name: `com.rally.app`
   - Add **SHA-1** fingerprint
     - Provided SHA-1 (use this in Google Cloud):
       ```
       A8:CB:06:FE:EB:1F:C4:74:06:A7:BE:9F:AD:68:C6:E4:C8:21:E1:98
       ```
     - If you need to regenerate locally (debug keystore), use:
       ```
       keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android
       ```

### 4.3 OAuth client IDs to use in the app (provided)

Use these values for the app config and environment variables:

```env
GOOGLE_WEB_CLIENT_ID=204335986948-l22091iooiff6vn3m08k8cq2756tgpo6.apps.googleusercontent.com
GOOGLE_IOS_CLIENT_ID=client_204335986948-5tp2bjf3ffr3d3bn0met7vgr8h2ke7m1.apps.googleusercontent.com
GOOGLE_ANDROID_CLIENT_ID=204335986948-l22091iooiff6vn3m08k8cq2756tgpo6.apps.googleusercontent.com
```

Note: use platform‑specific IDs for production builds. Do not store the **client secret**
in the mobile app or frontend. It belongs only on the backend.

## Step 5: Rebuild / reload and test

- Restart the Metro bundler.
- Reload the app.
- Try Google sign-in again.

If the error persists:
- Confirm the `redirectUri` printed by the app is **exactly** in the Web client
  "Authorized redirect URIs" list.
- Confirm you're using the **correct client ID** for the current build type.

## Quick checklist (most common causes)

- Web client ID used in a standalone build (should use iOS/Android IDs)
- Missing redirect URI in the Web client
- OAuth consent screen not published or test user not added
- Wrong Google project or wrong client ID copied

