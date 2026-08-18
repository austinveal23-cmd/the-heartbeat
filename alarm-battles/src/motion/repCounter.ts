import { angleDegrees, distance } from './geometry';
import { getLandmark, type PoseFrame, type PoseLandmarkName } from './landmarks';
import type { ExerciseType } from '../types/exercise';

type Phase = 'lo' | 'hi';

export interface RepCounterState {
  reps: number;
  phase: Phase;
  /** True if the tracked metric has swung meaningfully in the last MOVEMENT_WINDOW_MS,
   *  independent of completing a clean rep. This is the "clearly out of bed and moving"
   *  signal — the actual bar for shutting off the alarm, per the "movement not perfect
   *  form" design call. Rep counting is a bonus signal (for stats/points), not the gate. */
  isMoving: boolean;
  lastMetric: number | null;
}

interface ExerciseConfig {
  requiredLandmarks: PoseLandmarkName[];
  /** Returns null if the frame can't be scored (e.g. required points missing). */
  metric: (frame: PoseFrame) => number | null;
  loThreshold: number;
  hiThreshold: number;
}

const EXERCISE_CONFIG: Record<ExerciseType, ExerciseConfig> = {
  squat: {
    requiredLandmarks: ['left_hip', 'right_hip', 'left_ankle', 'right_ankle', 'left_shoulder', 'right_shoulder'],
    // Scale-invariant: how much of the shoulder-to-ankle span is still "leg" below the hip.
    // Standing tall -> ratio near hi; squatting drops the hip toward the ankle -> ratio near lo.
    metric: (frame) => {
      const lHip = getLandmark(frame, 'left_hip');
      const rHip = getLandmark(frame, 'right_hip');
      const lAnkle = getLandmark(frame, 'left_ankle');
      const rAnkle = getLandmark(frame, 'right_ankle');
      const lShoulder = getLandmark(frame, 'left_shoulder');
      const rShoulder = getLandmark(frame, 'right_shoulder');
      if (!lHip || !rHip || !lAnkle || !rAnkle || !lShoulder || !rShoulder) return null;

      const hipY = (lHip.y + rHip.y) / 2;
      const ankleY = (lAnkle.y + rAnkle.y) / 2;
      const shoulderY = (lShoulder.y + rShoulder.y) / 2;
      const span = ankleY - shoulderY;
      if (span <= 0) return null;
      return (ankleY - hipY) / span;
    },
    loThreshold: 0.45,
    hiThreshold: 0.55,
  },
  pushup: {
    requiredLandmarks: ['left_shoulder', 'left_elbow', 'left_wrist'],
    // Average elbow angle across whichever arm(s) are visible. Loose bend/extend bar,
    // not a strict range-of-motion check.
    metric: (frame) => {
      const angles: number[] = [];
      const lShoulder = getLandmark(frame, 'left_shoulder');
      const lElbow = getLandmark(frame, 'left_elbow');
      const lWrist = getLandmark(frame, 'left_wrist');
      if (lShoulder && lElbow && lWrist) angles.push(angleDegrees(lShoulder, lElbow, lWrist));

      const rShoulder = getLandmark(frame, 'right_shoulder');
      const rElbow = getLandmark(frame, 'right_elbow');
      const rWrist = getLandmark(frame, 'right_wrist');
      if (rShoulder && rElbow && rWrist) angles.push(angleDegrees(rShoulder, rElbow, rWrist));

      if (angles.length === 0) return null;
      return angles.reduce((a, b) => a + b, 0) / angles.length;
    },
    loThreshold: 130,
    hiThreshold: 155,
  },
  jumping_jack: {
    requiredLandmarks: ['left_wrist', 'right_wrist', 'left_ankle', 'right_ankle', 'left_shoulder', 'right_shoulder'],
    // Wrist + ankle spread normalized by shoulder width, so it doesn't care how close
    // the person is to the camera.
    metric: (frame) => {
      const lWrist = getLandmark(frame, 'left_wrist');
      const rWrist = getLandmark(frame, 'right_wrist');
      const lAnkle = getLandmark(frame, 'left_ankle');
      const rAnkle = getLandmark(frame, 'right_ankle');
      const lShoulder = getLandmark(frame, 'left_shoulder');
      const rShoulder = getLandmark(frame, 'right_shoulder');
      if (!lWrist || !rWrist || !lAnkle || !rAnkle || !lShoulder || !rShoulder) return null;

      const shoulderWidth = distance(lShoulder, rShoulder);
      if (shoulderWidth <= 0) return null;

      const wristSpread = distance(lWrist, rWrist);
      const ankleSpread = distance(lAnkle, rAnkle);
      return (wristSpread + ankleSpread) / (2 * shoulderWidth);
    },
    loThreshold: 1.8,
    hiThreshold: 2.5,
  },
};

const MOVEMENT_WINDOW_MS = 1500;

export class RepCounter {
  private readonly config: ExerciseConfig;
  private readonly movementBand: number;
  private phase: Phase = 'hi';
  private reps = 0;
  private lastMetric: number | null = null;
  private recentSamples: { t: number; v: number }[] = [];

  constructor(exerciseType: ExerciseType) {
    this.config = EXERCISE_CONFIG[exerciseType];
    this.movementBand = (this.config.hiThreshold - this.config.loThreshold) * 0.3;
  }

  reset(): void {
    this.phase = 'hi';
    this.reps = 0;
    this.lastMetric = null;
    this.recentSamples = [];
  }

  pushFrame(frame: PoseFrame): RepCounterState {
    const metric = this.config.metric(frame);
    if (metric !== null) {
      this.lastMetric = metric;
      this.recentSamples.push({ t: frame.timestampMs, v: metric });
      this.recentSamples = this.recentSamples.filter((s) => frame.timestampMs - s.t <= MOVEMENT_WINDOW_MS);

      if (this.phase === 'hi' && metric <= this.config.loThreshold) {
        this.phase = 'lo';
      } else if (this.phase === 'lo' && metric >= this.config.hiThreshold) {
        this.phase = 'hi';
        this.reps += 1;
      }
    }

    return this.getState();
  }

  getState(): RepCounterState {
    return {
      reps: this.reps,
      phase: this.phase,
      isMoving: this.computeIsMoving(),
      lastMetric: this.lastMetric,
    };
  }

  private computeIsMoving(): boolean {
    if (this.recentSamples.length < 2) return false;
    const values = this.recentSamples.map((s) => s.v);
    const spread = Math.max(...values) - Math.min(...values);
    return spread >= this.movementBand;
  }
}

export function createRepCounter(exerciseType: ExerciseType): RepCounter {
  return new RepCounter(exerciseType);
}
