# Android APK Release – Expo + React Native (SDK 54)

This document captures the **exact, working, production-safe steps** to build a release APK for an **Expo SDK 54 + React Native + Reanimated (New Architecture)** project.

This exists because **manual Gradle builds WILL crash** if Expo owns the native layer.

---

## Problem Summary (What went wrong earlier)

Symptoms:

- APK installs but crashes immediately on launch
- Error:

  ```
  SoLoaderDSONotFoundError: libreact_featureflagsjni.so
  ```

Root cause:

- New Architecture + Reanimated were enabled
- Fabric Codegen JNI **was never generated**
- Manual `./gradlew assembleRelease` / `installRelease` bypassed Expo’s native orchestration

This is **not** a React bug, Hermes issue, or cache issue.

---

## Key Principle (Non-negotiable)

> **If this is an Expo project, Expo must own the Android build.**

You cannot reliably:

- Toggle New Architecture flags manually
- Build via raw Gradle
- Mix Expo-managed native code with RN-only workflows

---

## ✅ The Working / Ideal Solution (Recommended)

### 1. Use Expo to regenerate native code (clean)

From project root:

```bash
npx expo prebuild --clean
```

What this does:

- Regenerates `android/` correctly
- Wires Fabric + Codegen properly
- Aligns Expo modules, Reanimated, Hermes, New Arch

---

### 2. Build & run release using Expo tooling

```bash
npx expo run:android --variant release
```

This:

- Runs Expo’s config phase
- Builds native C++ (Fabric JNI)
- Installs a **valid** release APK

The app **launches successfully**.

---

### 3. (Optional) Generate distributable APK / AAB

Modern Expo (recommended):

```bash
npx expo build:android
```

Or EAS:

```bash
npx expo prebuild
npx expo run:android
```

---

## ❌ What NOT to do (Guaranteed to break)

Do **not**:

```bash
./gradlew assembleRelease
./gradlew installRelease
```

Do **not**:

- Manually toggle `newArchEnabled` trying to fix crashes
- Force JSC in New Architecture
- Mix Expo SDK 54 with raw RN Gradle workflows

These will compile but produce **invalid APKs**.

---

## If You Want Full Manual Control (Alternative Path)

Only do this if you **need native customization**:

```bash
npx expo eject
```

After ejecting:

- You own the native layer
- Manual Gradle builds are valid
- Codegen/Fabric must be managed manually

Until you eject → **do not use raw Gradle**.

---

## Mental Model (Remember This)

- Expo SDK ≥ 54 = **New Architecture first**
- Reanimated = **requires Fabric**
- Fabric = **requires Codegen**
- Codegen = **must be orchestrated by Expo or fully owned by you**

No half-measures.

---

## One-Line Rule

> **Expo app → Expo build tools**
> **Bare RN app → Gradle tools**

Violating this rule causes silent native crashes.

---

## Status

✅ Confirmed working
✅ Crash resolved permanently
✅ Reproducible release process

---

_Last updated after resolving `libreact_featureflagsjni.so` crash on Expo SDK 54._
