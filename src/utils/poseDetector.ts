import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import { AgeGroup, Keypoint, PoseFeedback, YogaPose } from '../types/yoga';

let detectorInstance: poseDetection.PoseDetector | null = null;
let isInitializing = false;

export async function initPoseDetector(): Promise<poseDetection.PoseDetector | null> {
  if (detectorInstance) return detectorInstance;
  if (isInitializing) {
    while (isInitializing) {
      await new Promise((res) => setTimeout(res, 100));
    }
    return detectorInstance;
  }

  try {
    isInitializing = true;
    await tf.ready();
    await tf.setBackend('webgl');
    
    detectorInstance = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true,
      }
    );
    return detectorInstance;
  } catch (error) {
    console.error('Failed to initialize TFJS MoveNet pose detector:', error);
    return null;
  } finally {
    isInitializing = false;
  }
}

/**
 * Calculates angle in degrees at vertex B given three points A, B, C
 */
export function calculateAngle(
  pointA: Keypoint,
  pointB: Keypoint,
  pointC: Keypoint
): number {
  if (!pointA || !pointB || !pointC) return 180;
  
  const radians = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
                  Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  
  return Math.round(angle);
}

/**
 * Evaluates whether detected keypoints match the target YogaPose
 */
export function evaluatePose(
  keypoints: Keypoint[],
  targetPose: YogaPose,
  ageGroup: AgeGroup = 'juniors'
): PoseFeedback {
  if (!keypoints || keypoints.length < 17) {
    return {
      overallScore: 0,
      isMatched: false,
      primaryHint: 'Step into the camera frame so your whole body is visible! 🧘',
      jointAccuracies: {},
    };
  }

  // Age tolerance modifier: sprouts get generous room for fun, masters get refined precision
  const toleranceModifier = ageGroup === 'sprouts' ? 16 : ageGroup === 'masters' ? -4 : 0;
  const matchThreshold = ageGroup === 'sprouts' ? 62 : ageGroup === 'masters' ? 76 : 68;

  const jointAccuracies: Record<string, { status: 'correct' | 'warning' | 'error'; angle: number; target: number; label: string }> = {};
  let totalScore = 0;
  let constraintsCount = 0;
  let primaryHint = 'Superb alignment! Hold steady!';
  let worstError = 0;

  targetPose.angleConstraints.forEach((constraint) => {
    const [idxA, idxB, idxC] = constraint.points;
    const ptA = keypoints[idxA];
    const ptB = keypoints[idxB];
    const ptC = keypoints[idxC];

    // Check confidence scores if available
    const minConf = Math.min(ptA?.score ?? 1, ptB?.score ?? 1, ptC?.score ?? 1);
    if (minConf < 0.2) {
      // Keypoints partially obscured, give partial score
      jointAccuracies[constraint.name] = {
        status: 'warning',
        angle: 180,
        target: constraint.targetAngle,
        label: `${constraint.name} (low visibility)`,
      };
      totalScore += 50;
      constraintsCount++;
      return;
    }

    const angle = calculateAngle(ptA, ptB, ptC);
    const effectiveTolerance = Math.max(15, constraint.tolerance + toleranceModifier);
    const diff = Math.abs(angle - constraint.targetAngle);

    let status: 'correct' | 'warning' | 'error' = 'correct';
    let constraintScore = 100;

    if (diff <= effectiveTolerance * 0.6) {
      status = 'correct';
      constraintScore = 100;
    } else if (diff <= effectiveTolerance) {
      status = 'warning';
      constraintScore = Math.max(65, 100 - (diff / effectiveTolerance) * 35);
    } else {
      status = 'error';
      constraintScore = Math.max(20, 65 - ((diff - effectiveTolerance) / 40) * 45);
      
      if (diff > worstError) {
        worstError = diff;
        if (angle < constraint.targetAngle && constraint.hintIfTooSmall) {
          primaryHint = constraint.hintIfTooSmall;
        } else if (angle > constraint.targetAngle && constraint.hintIfTooLarge) {
          primaryHint = constraint.hintIfTooLarge;
        } else {
          primaryHint = `Adjust your ${constraint.name.toLowerCase()}`;
        }
      }
    }

    jointAccuracies[constraint.name] = {
      status,
      angle,
      target: constraint.targetAngle,
      label: constraint.name,
    };

    totalScore += constraintScore;
    constraintsCount++;
  });

  const overallScore = constraintsCount > 0 ? Math.round(totalScore / constraintsCount) : 0;
  const isMatched = overallScore >= matchThreshold;

  if (isMatched && worstError === 0) {
    primaryHint = '🌟 Perfect posture! Hold it right there!';
  } else if (isMatched) {
    primaryHint = '✨ Looking great! Keep breathing and hold!';
  }

  return {
    overallScore,
    isMatched,
    primaryHint,
    jointAccuracies,
  };
}

// Skeleton connection pairs for drawing
export const POSE_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 3], [0, 2], [2, 4], // face
  [5, 6], // shoulders
  [5, 7], [7, 9], // left arm
  [6, 8], [8, 10], // right arm
  [5, 11], [6, 12], // torso
  [11, 12], // hips
  [11, 13], [13, 15], // left leg
  [12, 14], [14, 16], // right leg
];

/**
 * Custom Canvas renderer for real-time Yellow-Green Glowing Skeleton
 */
export function drawPoseOnCanvas(
  ctx: CanvasRenderingContext2D,
  keypoints: Keypoint[],
  feedback: PoseFeedback,
  width: number,
  height: number,
  isMirrored = true
) {
  ctx.save();
  
  if (isMirrored) {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }

  // Draw Glow Lines (Yellow-Green themed)
  const isGood = feedback.isMatched;
  const strokeGlowColor = isGood ? 'rgba(74, 222, 128, 0.85)' : 'rgba(250, 204, 21, 0.75)';
  const strokeLineColor = isGood ? '#22c55e' : '#eab308';

  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Draw connections
  POSE_CONNECTIONS.forEach(([iA, iB]) => {
    const ptA = keypoints[iA];
    const ptB = keypoints[iB];

    if (ptA && ptB && (ptA.score ?? 1) > 0.25 && (ptB.score ?? 1) > 0.25) {
      // Glow aura
      ctx.strokeStyle = strokeGlowColor;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(ptA.x, ptA.y);
      ctx.lineTo(ptB.x, ptB.y);
      ctx.stroke();

      // Sharp center core line
      ctx.strokeStyle = strokeLineColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(ptA.x, ptA.y);
      ctx.lineTo(ptB.x, ptB.y);
      ctx.stroke();
    }
  });

  // Draw Joint nodes
  keypoints.forEach((pt, idx) => {
    if (!pt || (pt.score ?? 1) < 0.25) return;

    // Head nodes (0-4) are smaller, major joints (5-16) are larger glowing gems
    const isMajorJoint = idx >= 5;
    const radius = isMajorJoint ? 8 : 5;

    // Outer glow ring
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, radius + 4, 0, 2 * Math.PI);
    ctx.fillStyle = isGood ? 'rgba(34, 197, 94, 0.35)' : 'rgba(234, 179, 8, 0.35)';
    ctx.fill();

    // Solid core
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = isGood ? '#4ade80' : '#fef08a';
    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
  });

  ctx.restore();
}

/**
 * Generates synthetic / simulated pose keypoints for demonstration or when webcam is simulated
 */
export function generateSyntheticPose(
  pose: YogaPose,
  width: number,
  height: number,
  accuracyFactor = 0.95,
  elapsedSec = 0
): Keypoint[] {
  const cx = width / 2;
  const cy = height * 0.48;
  const scale = Math.min(width, height) * 0.38;
  const wobble = (Math.sin(elapsedSec * 2.5) * 6) * (1 - accuracyFactor);

  const kps: Keypoint[] = Array(17).fill(null).map(() => ({ x: cx, y: cy, score: 0.95 }));

  // Head
  kps[0] = { x: cx + wobble, y: cy - scale * 0.9, score: 0.98, name: 'nose' };
  kps[1] = { x: cx - scale * 0.08 + wobble, y: cy - scale * 0.92, score: 0.98, name: 'left_eye' };
  kps[2] = { x: cx + scale * 0.08 + wobble, y: cy - scale * 0.92, score: 0.98, name: 'right_eye' };
  kps[3] = { x: cx - scale * 0.15 + wobble, y: cy - scale * 0.9, score: 0.95, name: 'left_ear' };
  kps[4] = { x: cx + scale * 0.15 + wobble, y: cy - scale * 0.9, score: 0.95, name: 'right_ear' };

  // Torso base
  const shoulderY = cy - scale * 0.65;
  const hipY = cy - scale * 0.1;

  if (pose.id === 'mountain-pose') {
    kps[5] = { x: cx - scale * 0.28, y: shoulderY, score: 0.98 };
    kps[6] = { x: cx + scale * 0.28, y: shoulderY, score: 0.98 };
    kps[7] = { x: cx - scale * 0.18, y: shoulderY + scale * 0.28, score: 0.95 };
    kps[8] = { x: cx + scale * 0.18, y: shoulderY + scale * 0.28, score: 0.95 };
    kps[9] = { x: cx - scale * 0.04, y: shoulderY + scale * 0.22, score: 0.95 };
    kps[10] = { x: cx + scale * 0.04, y: shoulderY + scale * 0.22, score: 0.95 };
    kps[11] = { x: cx - scale * 0.18, y: hipY, score: 0.98 };
    kps[12] = { x: cx + scale * 0.18, y: hipY, score: 0.98 };
    kps[13] = { x: cx - scale * 0.18, y: hipY + scale * 0.5, score: 0.98 };
    kps[14] = { x: cx + scale * 0.18, y: hipY + scale * 0.5, score: 0.98 };
    kps[15] = { x: cx - scale * 0.18, y: hipY + scale * 0.95, score: 0.98 };
    kps[16] = { x: cx + scale * 0.18, y: hipY + scale * 0.95, score: 0.98 };
  } else if (pose.id === 'tree-pose') {
    kps[5] = { x: cx - scale * 0.28, y: shoulderY, score: 0.98 };
    kps[6] = { x: cx + scale * 0.28, y: shoulderY, score: 0.98 };
    // Branch arms raised high
    kps[7] = { x: cx - scale * 0.42, y: shoulderY - scale * 0.35, score: 0.95 };
    kps[8] = { x: cx + scale * 0.42, y: shoulderY - scale * 0.35, score: 0.95 };
    kps[9] = { x: cx - scale * 0.2, y: shoulderY - scale * 0.7, score: 0.95 };
    kps[10] = { x: cx + scale * 0.2, y: shoulderY - scale * 0.7, score: 0.95 };
    kps[11] = { x: cx - scale * 0.18, y: hipY, score: 0.98 };
    kps[12] = { x: cx + scale * 0.18, y: hipY, score: 0.98 };
    // Standing leg
    kps[11] = { x: cx - scale * 0.1, y: hipY, score: 0.98 };
    kps[13] = { x: cx - scale * 0.1, y: hipY + scale * 0.5, score: 0.98 };
    kps[15] = { x: cx - scale * 0.1, y: hipY + scale * 0.95, score: 0.98 };
    // Bent leg resting on knee
    kps[14] = { x: cx + scale * 0.45, y: hipY + scale * 0.35, score: 0.98 };
    kps[16] = { x: cx - scale * 0.05, y: hipY + scale * 0.45, score: 0.98 };
  } else if (pose.id === 'star-pose') {
    kps[5] = { x: cx - scale * 0.28, y: shoulderY, score: 0.98 };
    kps[6] = { x: cx + scale * 0.28, y: shoulderY, score: 0.98 };
    // Outstretched arms
    kps[7] = { x: cx - scale * 0.65, y: shoulderY - scale * 0.05, score: 0.98 };
    kps[8] = { x: cx + scale * 0.65, y: shoulderY - scale * 0.05, score: 0.98 };
    kps[9] = { x: cx - scale * 0.98, y: shoulderY - scale * 0.05, score: 0.98 };
    kps[10] = { x: cx + scale * 0.98, y: shoulderY - scale * 0.05, score: 0.98 };
    // Wide star legs
    kps[11] = { x: cx - scale * 0.2, y: hipY, score: 0.98 };
    kps[12] = { x: cx + scale * 0.2, y: hipY, score: 0.98 };
    kps[13] = { x: cx - scale * 0.48, y: hipY + scale * 0.5, score: 0.98 };
    kps[14] = { x: cx + scale * 0.48, y: hipY + scale * 0.5, score: 0.98 };
    kps[15] = { x: cx - scale * 0.72, y: hipY + scale * 0.95, score: 0.98 };
    kps[16] = { x: cx + scale * 0.72, y: hipY + scale * 0.95, score: 0.98 };
  } else if (pose.id === 'warrior-2') {
    kps[5] = { x: cx - scale * 0.25, y: shoulderY, score: 0.98 };
    kps[6] = { x: cx + scale * 0.25, y: shoulderY, score: 0.98 };
    kps[7] = { x: cx - scale * 0.6, y: shoulderY, score: 0.98 };
    kps[8] = { x: cx + scale * 0.6, y: shoulderY, score: 0.98 };
    kps[9] = { x: cx - scale * 0.92, y: shoulderY, score: 0.98 };
    kps[10] = { x: cx + scale * 0.92, y: shoulderY, score: 0.98 };
    // Front lunging knee
    kps[11] = { x: cx - scale * 0.15, y: hipY, score: 0.98 };
    kps[12] = { x: cx + scale * 0.25, y: hipY, score: 0.98 };
    kps[13] = { x: cx - scale * 0.5, y: hipY + scale * 0.45, score: 0.98 };
    kps[15] = { x: cx - scale * 0.5, y: hipY + scale * 0.92, score: 0.98 };
    // Back straight leg
    kps[14] = { x: cx + scale * 0.55, y: hipY + scale * 0.5, score: 0.98 };
    kps[16] = { x: cx + scale * 0.85, y: hipY + scale * 0.92, score: 0.98 };
  } else if (pose.id === 'warrior-3-airplane') {
    // Grand Level 11 Airplane pose: horizontal body
    kps[0] = { x: cx - scale * 0.65, y: cy - scale * 0.1, score: 0.98 };
    kps[5] = { x: cx - scale * 0.35, y: cy - scale * 0.08, score: 0.98 };
    kps[6] = { x: cx - scale * 0.35, y: cy - scale * 0.08, score: 0.98 };
    // Wing arms out
    kps[7] = { x: cx - scale * 0.35, y: cy - scale * 0.5, score: 0.98 };
    kps[8] = { x: cx - scale * 0.35, y: cy + scale * 0.3, score: 0.98 };
    kps[9] = { x: cx - scale * 0.35, y: cy - scale * 0.8, score: 0.98 };
    kps[10] = { x: cx - scale * 0.35, y: cy + scale * 0.55, score: 0.98 };
    // Standing leg
    kps[11] = { x: cx + scale * 0.05, y: cy - scale * 0.05, score: 0.98 };
    kps[12] = { x: cx + scale * 0.05, y: cy - scale * 0.05, score: 0.98 };
    kps[13] = { x: cx + scale * 0.05, y: cy + scale * 0.45, score: 0.98 };
    kps[15] = { x: cx + scale * 0.05, y: cy + scale * 0.92, score: 0.98 };
    // Back flying leg
    kps[14] = { x: cx + scale * 0.45, y: cy - scale * 0.05, score: 0.98 };
    kps[16] = { x: cx + scale * 0.85, y: cy - scale * 0.05, score: 0.98 };
  } else {
    // Default balanced pose template
    kps[5] = { x: cx - scale * 0.28, y: shoulderY, score: 0.98 };
    kps[6] = { x: cx + scale * 0.28, y: shoulderY, score: 0.98 };
    kps[7] = { x: cx - scale * 0.45, y: shoulderY + scale * 0.2, score: 0.95 };
    kps[8] = { x: cx + scale * 0.45, y: shoulderY + scale * 0.2, score: 0.95 };
    kps[9] = { x: cx - scale * 0.6, y: shoulderY + scale * 0.4, score: 0.95 };
    kps[10] = { x: cx + scale * 0.6, y: shoulderY + scale * 0.4, score: 0.95 };
    kps[11] = { x: cx - scale * 0.2, y: hipY, score: 0.98 };
    kps[12] = { x: cx + scale * 0.2, y: hipY, score: 0.98 };
    kps[13] = { x: cx - scale * 0.25, y: hipY + scale * 0.5, score: 0.98 };
    kps[14] = { x: cx + scale * 0.25, y: hipY + scale * 0.5, score: 0.98 };
    kps[15] = { x: cx - scale * 0.3, y: hipY + scale * 0.95, score: 0.98 };
    kps[16] = { x: cx + scale * 0.3, y: hipY + scale * 0.95, score: 0.98 };
  }

  return kps;
}
