import { useCallback, useEffect, useRef, useState } from 'react';
import type { CameraView } from 'expo-camera';
import { detectPose } from 'expo-pose-detector';
import { createRepCounter, type RepCounterState } from './repCounter';
import type { ExerciseType } from '../types/exercise';

const POLL_INTERVAL_MS = 250;

export interface PoseTrackingState extends RepCounterState {
  /** True once a person has been detected at least once this session. */
  hasSeenPerson: boolean;
}

/**
 * Polls the given CameraView at POLL_INTERVAL_MS, runs each snapshot through
 * ML Kit pose detection, and feeds the result into a RepCounter for the
 * given exercise. See src/motion/README.md for the reasoning behind polling
 * a still camera instead of a live frame processor.
 */
export function usePoseTracking(
  cameraRef: React.RefObject<CameraView | null>,
  exerciseType: ExerciseType,
  enabled: boolean
): PoseTrackingState {
  const counterRef = useRef(createRepCounter(exerciseType));
  const hasSeenPersonRef = useRef(false);
  const inFlightRef = useRef(false);
  const [state, setState] = useState<PoseTrackingState>({
    ...counterRef.current.getState(),
    hasSeenPerson: false,
  });

  useEffect(() => {
    counterRef.current = createRepCounter(exerciseType);
    hasSeenPersonRef.current = false;
  }, [exerciseType]);

  const pollOnce = useCallback(async () => {
    if (inFlightRef.current || !cameraRef.current) return;
    inFlightRef.current = true;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.3,
        skipProcessing: true,
        shutterSound: false,
      });
      if (!photo?.uri) return;

      const poseFrame = await detectPose(photo.uri);
      if (!poseFrame) return;

      hasSeenPersonRef.current = true;
      const repState = counterRef.current.pushFrame(poseFrame);
      setState({ ...repState, hasSeenPerson: true });
    } catch {
      // A single failed snapshot (camera not ready, decode error, etc.) just
      // means one skipped sample — the next poll tries again.
    } finally {
      inFlightRef.current = false;
    }
  }, [cameraRef]);

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(pollOnce, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [enabled, pollOnce]);

  return state;
}
