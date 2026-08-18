import { requireNativeModule } from 'expo-modules-core';
import type { PoseFrame } from '../../../src/motion/landmarks';

interface NativePoseDetectorModule {
  detectPose(imageUri: string): Promise<{ landmarks: PoseFrame['landmarks'] } | null>;
}

const ExpoPoseDetector = requireNativeModule<NativePoseDetectorModule>('ExpoPoseDetector');

/**
 * Runs ML Kit pose detection on a single still image and returns it in the
 * shape src/motion/repCounter.ts expects. Resolves to null if no person was
 * detected in the frame.
 */
export async function detectPose(imageUri: string): Promise<PoseFrame | null> {
  const result = await ExpoPoseDetector.detectPose(imageUri);
  if (!result) return null;
  return { timestampMs: Date.now(), landmarks: result.landmarks };
}
