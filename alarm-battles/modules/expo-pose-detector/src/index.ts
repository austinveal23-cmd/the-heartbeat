import { requireOptionalNativeModule } from 'expo-modules-core';
import type { PoseFrame } from '../../../src/motion/landmarks';

interface NativePoseDetectorModule {
  detectPose(imageUri: string): Promise<{ landmarks: PoseFrame['landmarks'] } | null>;
}

// requireOptionalNativeModule (not requireNativeModule) so an unlinked native
// module — Expo Go, or a dev-client build where this local module didn't
// link — doesn't crash the whole app the moment this file is imported.
// WorkoutCameraScreen (via usePoseTracking) is statically imported by
// RootNavigator, so that import happens at app startup, not lazily on
// navigation: a hard throw here previously meant *nothing* could render.
const ExpoPoseDetector = requireOptionalNativeModule<NativePoseDetectorModule>('ExpoPoseDetector');

let warnedUnavailable = false;

export function isPoseDetectorAvailable(): boolean {
  return ExpoPoseDetector !== null;
}

/**
 * Runs ML Kit pose detection on a single still image and returns it in the
 * shape src/motion/repCounter.ts expects. Resolves to null if no person was
 * detected in the frame — or if the native module isn't available at all,
 * in which case it warns once instead of throwing on every poll tick.
 */
export async function detectPose(imageUri: string): Promise<PoseFrame | null> {
  if (!ExpoPoseDetector) {
    if (!warnedUnavailable) {
      console.warn(
        'expo-pose-detector: native module not linked (Expo Go, or a dev-client build missing it). ' +
          'Motion detection is disabled; see src/motion/README.md.'
      );
      warnedUnavailable = true;
    }
    return null;
  }
  const result = await ExpoPoseDetector.detectPose(imageUri);
  if (!result) return null;
  return { timestampMs: Date.now(), landmarks: result.landmarks };
}
