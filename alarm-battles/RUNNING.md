# Running this app

**This will not run in Expo Go.** It uses custom native modules —
`expo-alarm-scheduler` (Android `AlarmManager` + full-screen intent) and
`expo-pose-detector` (ML Kit pose detection) — plus `@react-native-firebase/*`.
None of those exist in Expo Go's precompiled binary; Expo Go can only run
apps built from the standard Expo SDK modules. This project needs a
**custom dev client**, which means a real native build.

If you open it in Expo Go anyway: Home and the alarm editor will *look*
like they work (they're plain JS/React Native), but nothing that touches
scheduling or the camera pipeline will function, and depending on timing
you may just see a crash on startup instead.

## Setup

```
npm install
npx expo prebuild        # generates ios/ and android/ — not committed to git
```

### Android
```
npx expo run:android     # needs Android Studio + an emulator or device
```

### iOS (needs a Mac)

Simplest path — let Expo drive it:
```
npx expo run:ios         # needs Xcode + a simulator or device, runs pod install for you
```

**Opening it directly in Xcode instead:** after `npx expo prebuild`, run
`cd ios && pod install`, then open **`ios/AlarmBattles.xcworkspace`** —
not `AlarmBattles.xcodeproj`. Opening the `.xcodeproj` skips CocoaPods
entirely and the build will fail to find the native module headers.

Both of these do a real native build the first time (several minutes),
not just a JS bundle — that's expected.

**Signing, if building to a physical device or you hit a provisioning
error:** open the `AlarmBattles` target → Signing & Capabilities → pick
your own Apple ID as the team. With a free/personal Apple ID this works
fine for local testing but the build expires after 7 days. If Xcode
complains the bundle identifier (`com.alarmbattles.app`, set in
`app.json`) isn't available, change it to something like
`com.<yourname>.alarmbattles` and re-run `expo prebuild`.

**iOS is the less-verified half of this project.** The native alarm
scheduler (`expo-alarm-scheduler`) is Android-only by design — iOS uses
a notification-burst fallback instead (`src/alarms/iosAlarmFallback.ts`),
so there's no native alarm code to fail on iOS. But
`modules/expo-pose-detector/ios/ExpoPoseDetectorModule.swift` (the ML Kit
camera pose detection) was written against the documented ML Kit iOS API
without ever compiling it — no Mac was available while building this. If
the build fails specifically in that file or in the `GoogleMLKit/PoseDetection`
pod, that's the most likely place, not a sign anything else is broken.
See `src/motion/README.md` for specifics.

### Firebase
`google-services.json` and `GoogleService-Info.plist` at the repo root are
**placeholders** (fake project IDs / API keys). Auth and Firestore calls
will fail until you swap in the real files from your own Firebase console
project (see `src/firebase/config.ts`).

## If native scheduling isn't linked

If `expo-alarm-scheduler` or `expo-pose-detector` fail to link during the
native build (or you're stuck testing in an environment that can't build
one at all), the app now degrades instead of crashing:

- Saving an alarm still works locally — you'll see a banner on Home
  saying alarms are saved but won't actually ring.
- Each alarm card has a **"Test Ring ▸"** button that jumps straight to
  the ringing screen without waiting for a real alarm to fire — use this
  to reach Alarm Ringing → Workout Camera → Workout Complete.
- If pose detection specifically isn't available, the Workout Camera
  screen shows a **"Skip (dev)"** button so you can still preview Workout
  Complete without a working camera pipeline.

None of that replaces an actual dev-client build — it just means the UI
is inspectable without one. See `src/motion/README.md` for what's been
verified vs. not on the motion-detection side.
