# Signup flow — where the error comes from

Send OTP and Verify OTP work; the failure happens at **the final signup step** (ProfileSetup → Confirm).

## Call path (in order)

1. **ProfileSetup** (`ProfileSetup.context.tsx`)  
   User taps **Confirm** → `handleCompleteSignUp()` runs.

2. **FormData built**  
   Fields (userType, signupToken, fullName, password, sport1, dob, gender, optional profilePic, etc.) are appended to `FormData`.

3. **Mutation**  
   `signUpMutation.mutateAsync(formData)` is called.  
   React Query calls **`authService.signUp(formData)`**.

4. **Auth service** (`auth-service.ts`)  
   `authService.signUp` calls  
   `apiClient.post('/api/auth/signup', data, { timeout: 30000 })`.

5. **Axios** (`axios-config.ts`)
   - **Request interceptor** runs (adds auth header, strips Content-Type for FormData).
   - The real **HTTP POST** is sent to `ENV.API_BASE_URL + '/api/auth/signup'` (e.g. `https://rally-node.vercel.app/api/auth/signup`).
   - If the request fails (network, timeout, 4xx/5xx), the **response error interceptor** runs and rejects with the Axios error.

6. **Auth service catch**  
   The Axios error is caught in `auth-service.ts` `signUp` catch.
   - If **response + JSON body** → we throw an error with server message.
   - If **response but no/empty body** → we throw a status-based message (400, 413, 5xx).
   - If **no response** (timeout, connection, SSL) → we throw “Network error…” and set `isNetworkError: true`.

7. **ProfileSetup catch**  
   The error thrown from `authService.signUp` is caught in `ProfileSetup.context.tsx`.  
   We log it and show `Alert.alert(title, message)` (e.g. “Signup Failed” / “Network error…”).

So the **error you see in the app** is always **thrown from `auth-service.ts`** (step 6) and **shown in ProfileSetup** (step 7).  
The **underlying cause** is whatever made the **Axios request fail** (step 5): no response (timeout/network/SSL) or a non-2xx response from the server.

## [SIGNUP_FLOW] logs (Metro / device logs)

In **development** (`__DEV__`), each step logs once with the prefix `[SIGNUP_FLOW]`. Run the app with Metro and reproduce the failure; then search for `[SIGNUP_FLOW]` in the Metro terminal (or in device logs).

| Step | Log                                                                                 | Meaning                                                                                                                         |
| ---- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 1    | `[SIGNUP_FLOW] 1. ProfileSetup: handleCompleteSignUp started`                       | Confirm was pressed; we’re about to validate and build FormData.                                                                |
| 2    | `[SIGNUP_FLOW] 2. ProfileSetup: FormData built, calling signUpMutation.mutateAsync` | FormData is ready; we’re about to call the signup API.                                                                          |
| 2b   | `[SIGNUP_FLOW] 2b. ProfileSetup: signUpMutation.mutateAsync SUCCESS`                | Signup succeeded (you won’t see 3–6 in that case).                                                                              |
| 3    | `[SIGNUP_FLOW] 3. auth-service signUp: entry, about to call apiClient.post`         | We’re inside `authService.signUp`, right before `apiClient.post`.                                                               |
| 4    | `[SIGNUP_FLOW] 4. axios request interceptor: outgoing POST`                         | Axios is about to send the POST (URL, FormData, etc.).                                                                          |
| 5    | `[SIGNUP_FLOW] 5. axios response ERROR interceptor — request failed`                | The HTTP request failed (timeout, no connection, or non-2xx). **This is the first place we know the request failed.**           |
| 6    | `[SIGNUP_FLOW] 6. auth-service signUp CATCH — Axios error`                          | We’re in the `signUp` catch. **This is where the error is created** (branch: `responseData` / `responseNoData` / `noResponse`). |
| 7    | `[SIGNUP_FLOW] 7. ProfileSetup CATCH — error shown to user`                         | We’re about to show the alert; this is the same error thrown from step 6.                                                       |

## How to interpret the failure

- **If you see 1, 2, 3, 4, then 5, then 6, then 7**  
  The request was sent (4) and then failed (5). Step 6’s log will show:
  - `branch: 'noResponse'` → no HTTP response (timeout, connection, or SSL issue).
  - `branch: 'responseNoData'` → server returned a status (e.g. 400, 413, 500) but no or non-JSON body.
  - `branch: 'responseData'` → server returned JSON; we use its message.

  Use the **code**, **message**, **hasResponse**, **status** and **responseDataKeys** in step 6 to see the exact Axios error and branch.

- **If you see 1, 2, then 7 without 3–6**  
  The error happened before or inside the mutation (e.g. building FormData or calling `mutateAsync`). That would be a different bug (e.g. crash in FormData or React Query).

- **If you never see 5 but you see 6**  
  Then the failure is still coming from Axios (the interceptor runs before the catch), but the “5” log might be missing in your build; step 6 is the authoritative place where the error is created.

## Summary: where the error comes from

- **User-visible error** is created in **`src/services/auth-service.ts`** in the `signUp` **catch** block (step 6), then shown in **`src/screens/sign-up/ProfileSetup/context/ProfileSetup.context.tsx`** in **`handleCompleteSignUp`’s catch** (step 7).
- **Why it fails** is determined by the **Axios error** in that catch: no response (network/timeout/SSL) vs response with status/body. The **`[SIGNUP_FLOW] 6`** log (and optionally **`5`**) tells you the exact reason (code, message, hasResponse, status, branch).
