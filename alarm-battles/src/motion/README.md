# Motion-detection spike

## Architecture

```
expo-camera (CameraView.takePictureAsync, polled every ~200-300ms)
        -> local JPEG URI
expo-pose-detector (modules/expo-pose-detector, local Expo module)
        -> ML Kit Pose Detection, single-image mode
        -> landmarks: PoseFrame  (src/motion/landmarks.ts)
repCounter.ts
        -> per-exercise metric (squat/pushup/jumping_jack) -> RepCounterState
```

`isMoving` in `RepCounterState` is the actual alarm-shutoff gate — it fires on
any sufficiently large swing in the tracked metric, independent of completing
a clean rep. Rep counting is a secondary signal, used for stats/points, not
for deciding whether the alarm silences. That split is deliberate: it's the
concrete implementation of "movement, not perfect form."

## Why single-image polling instead of a live frame processor

`react-native-vision-camera` (installed initially) shipped a ground-up
rewrite in its v5 line onto Nitro Modules, replacing the JSI
`useFrameProcessor` + native `FrameProcessorPlugin` pattern that most
existing ML Kit integration guides assume. That rewrite is too recent and
too different from the well-documented pattern to hand-write a native
frame-processor plugin against with any confidence, especially with no
device/emulator available to compile-test it. It was removed.

Instead, `expo-camera`'s `takePictureAsync` (already a stable, documented
API — confirmed against this exact installed version's `.d.ts` files) is
polled on an interval, and each snapshot is run through ML Kit in one shot
via a small local Expo Module (`modules/expo-pose-detector`). This caps
detection at roughly the polling rate rather than full camera frame rate,
which is a real tradeoff, but it's more than sufficient for "loose
threshold, did the body move" detection, and every piece of it (config
plugin APIs, Expo Modules API, ML Kit Android API) is something with a long
stable history rather than a brand-new rewrite.

## What's untested

Nothing here has run on a device — this container has no emulator, no
Xcode, no Android Studio. Verified so far:

- `npx tsc --noEmit` passes for the whole app.
- `npm test` (Jest) passes for `repCounter.ts`'s state machine against
  synthetic landmark sequences — this is the one piece of the spike that's
  actually been exercised.
- `expo-modules-autolinking resolve` confirms the native module is
  discovered and would be linked into a real build.

Not verified, and worth budgeting real time for once this runs on hardware:

- **Android** (`modules/expo-pose-detector/android`): written against the
  Expo Modules Kotlin API and ML Kit's `PoseDetection`/`InputImage` API as
  documented; needs a real build + device to confirm it compiles and that
  the loose thresholds in `repCounter.ts` (`loThreshold`/`hiThreshold` per
  exercise) actually match real bodies at real camera distances/angles —
  those numbers are placeholders, not calibrated.
- **iOS** (`modules/expo-pose-detector/ios`): same shape, lower confidence —
  ML Kit's iOS pose API has had more version churn historically, so double
  check the `PoseDetector`/`VisionImage`/`PoseLandmarkType` surface against
  whatever `GoogleMLKit/PoseDetection` version `pod install` actually pulls
  down before trusting it compiles as-is.
- Camera mount angle in practice: the squat metric assumes a roughly
  front-on view; a phone propped low/to the side will need threshold
  retuning or a different metric.

## Calibrating thresholds

`EXERCISE_CONFIG` in `repCounter.ts` hardcodes `loThreshold`/`hiThreshold`
per exercise. Once this runs on a device, log `lastMetric` for a few real
reps of each exercise and re-set the thresholds from the observed range
rather than trusting the current placeholder numbers.
