/**
 * Mirrors ML Kit's PoseLandmark shape so the native plugin can hand frames
 * to JS with no translation layer. Coordinates are in the image's pixel
 * space; y grows downward.
 */
export const POSE_LANDMARK_NAMES = [
  'nose',
  'left_shoulder',
  'right_shoulder',
  'left_elbow',
  'right_elbow',
  'left_wrist',
  'right_wrist',
  'left_hip',
  'right_hip',
  'left_knee',
  'right_knee',
  'left_ankle',
  'right_ankle',
] as const;

export type PoseLandmarkName = (typeof POSE_LANDMARK_NAMES)[number];

export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  inFrameLikelihood: number; // 0-1, ML Kit's confidence this point is visible
}

export type PoseFrame = {
  timestampMs: number;
  landmarks: Partial<Record<PoseLandmarkName, PoseLandmark>>;
};

export const MIN_LANDMARK_CONFIDENCE = 0.5;

export function getLandmark(
  frame: PoseFrame,
  name: PoseLandmarkName,
  minConfidence = MIN_LANDMARK_CONFIDENCE
): PoseLandmark | null {
  const lm = frame.landmarks[name];
  if (!lm || lm.inFrameLikelihood < minConfidence) return null;
  return lm;
}
