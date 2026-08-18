import { createRepCounter } from './repCounter';
import type { PoseFrame, PoseLandmarkName } from './landmarks';

function frame(
  t: number,
  points: Partial<Record<PoseLandmarkName, { x: number; y: number }>>,
  confidence = 1
): PoseFrame {
  const landmarks: PoseFrame['landmarks'] = {};
  for (const [name, p] of Object.entries(points)) {
    landmarks[name as PoseLandmarkName] = { x: p.x, y: p.y, z: 0, inFrameLikelihood: confidence };
  }
  return { timestampMs: t, landmarks };
}

describe('squat rep counting', () => {
  const shoulders = { left_shoulder: { x: -10, y: 0 }, right_shoulder: { x: 10, y: 0 } };
  const ankles = { left_ankle: { x: -10, y: 100 }, right_ankle: { x: 10, y: 100 } };
  const standing = { ...shoulders, ...ankles, left_hip: { x: -10, y: 45 }, right_hip: { x: 10, y: 45 } }; // ratio 0.55
  const squatting = { ...shoulders, ...ankles, left_hip: { x: -10, y: 60 }, right_hip: { x: 10, y: 60 } }; // ratio 0.40

  it('counts a full down-up cycle as one rep', () => {
    const counter = createRepCounter('squat');
    let state = counter.pushFrame(frame(0, standing)); // already 'hi', no-op
    expect(state.reps).toBe(0);

    state = counter.pushFrame(frame(100, squatting));
    expect(state.phase).toBe('lo');
    expect(state.reps).toBe(0);

    state = counter.pushFrame(frame(200, standing));
    expect(state.phase).toBe('hi');
    expect(state.reps).toBe(1);
  });

  it('counts three reps across repeated cycles', () => {
    const counter = createRepCounter('squat');
    const sequence = [squatting, standing, squatting, standing, squatting, standing];
    let state = counter.pushFrame(frame(0, standing));
    sequence.forEach((pose, i) => {
      state = counter.pushFrame(frame((i + 1) * 100, pose));
    });
    expect(state.reps).toBe(3);
  });

  it('reports isMoving while the hip is oscillating', () => {
    const counter = createRepCounter('squat');
    counter.pushFrame(frame(0, standing));
    const state = counter.pushFrame(frame(100, squatting));
    expect(state.isMoving).toBe(true);
  });

  it('reports isMoving false when perfectly still', () => {
    const counter = createRepCounter('squat');
    counter.pushFrame(frame(0, standing));
    counter.pushFrame(frame(100, standing));
    const state = counter.pushFrame(frame(200, standing));
    expect(state.isMoving).toBe(false);
    expect(state.reps).toBe(0);
  });

  it('ignores frames where required landmarks are below the confidence floor', () => {
    const counter = createRepCounter('squat');
    const baseline = counter.pushFrame(frame(0, standing));
    const lowConfidence = counter.pushFrame(frame(100, squatting, 0.2));
    expect(lowConfidence.phase).toBe('hi'); // unchanged — frame was rejected
    expect(lowConfidence.lastMetric).toBe(baseline.lastMetric); // holds last known value, doesn't null out
  });
});

describe('pushup rep counting', () => {
  const extended = { left_shoulder: { x: 0, y: 0 }, left_elbow: { x: 10, y: 0 }, left_wrist: { x: 20, y: 0 } }; // 180deg
  const bent = { left_shoulder: { x: 0, y: 0 }, left_elbow: { x: 10, y: 0 }, left_wrist: { x: 10, y: 10 } }; // 90deg

  it('counts a bend-extend cycle as one rep', () => {
    const counter = createRepCounter('pushup');
    counter.pushFrame(frame(0, extended));
    let state = counter.pushFrame(frame(100, bent));
    expect(state.phase).toBe('lo');
    state = counter.pushFrame(frame(200, extended));
    expect(state.reps).toBe(1);
  });
});

describe('jumping jack rep counting', () => {
  const shoulders = { left_shoulder: { x: -10, y: 0 }, right_shoulder: { x: 10, y: 0 } };
  const together = {
    ...shoulders,
    left_wrist: { x: -5, y: 50 },
    right_wrist: { x: 5, y: 50 },
    left_ankle: { x: -5, y: 100 },
    right_ankle: { x: 5, y: 100 },
  };
  const apart = {
    ...shoulders,
    left_wrist: { x: -40, y: 20 },
    right_wrist: { x: 40, y: 20 },
    left_ankle: { x: -40, y: 100 },
    right_ankle: { x: 40, y: 100 },
  };

  it('counts a together-apart cycle as one rep', () => {
    const counter = createRepCounter('jumping_jack');
    // Counter phase starts at 'hi', which corresponds to "apart" for this exercise
    // (mirrors "standing" for squats) — so the first apart frame is a no-op.
    let state = counter.pushFrame(frame(0, apart));
    expect(state.reps).toBe(0);

    state = counter.pushFrame(frame(100, together));
    expect(state.phase).toBe('lo');
    expect(state.reps).toBe(0);

    state = counter.pushFrame(frame(200, apart));
    expect(state.phase).toBe('hi');
    expect(state.reps).toBe(1);
  });
});
