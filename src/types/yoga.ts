export type AgeGroup = 'sprouts' | 'juniors' | 'masters';

export interface Keypoint {
  x: number;
  y: number;
  score?: number;
  name?: string;
}

export interface DetectedPose {
  keypoints: Keypoint[];
  score: number;
}

export interface AngleConstraint {
  name: string;
  points: [number, number, number]; // [p1, vertex, p2] keypoint indices
  targetAngle: number; // degrees
  tolerance: number; // degrees deviation allowed
  weight?: number;
  hintIfTooSmall?: string;
  hintIfTooLarge?: string;
}

export interface PositionConstraint {
  name: string;
  check: (kps: Keypoint[]) => { passed: boolean; score: number; hint: string };
}

export interface PoseAnimationStep {
  stepNumber: number;
  title: string;
  instruction: string;
  duration: number; // in seconds
  breathCue: 'inhale' | 'exhale' | 'steady';
  keyAction: string;
}

export interface YogaPose {
  id: string;
  level: number;
  name: string;
  sanskritName: string;
  animalAlias: string;
  category: 'standing' | 'balance' | 'seated' | 'floor' | 'inversion';
  description: string;
  kidFriendlyGuide: string;
  teenFocus: string;
  holdSeconds: {
    sprouts: number;
    juniors: number;
    masters: number;
  };
  angleConstraints: AngleConstraint[];
  positionConstraints?: PositionConstraint[];
  keyTips: string[];
  benefits: string[];
  rewardBadge: {
    id: string;
    title: string;
    icon: string;
    description: string;
    color: string;
  };
  svgPoseType: string;
  animationSteps?: PoseAnimationStep[];
}

export interface UserProgress {
  playerName: string;
  ageGroup: AgeGroup;
  completedLevels: number[];
  levelStars: Record<number, number>; // level -> 1..3
  levelHighScores: Record<number, number>;
  unlockedBadges: string[];
  unlockedAvatars: string[];
  selectedAvatar: string;
  totalHoldSeconds: number;
  totalSessions: number;
  currentStreak: number;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  level11RewardClaimed: boolean;
}

export interface PoseFeedback {
  overallScore: number; // 0 to 100
  isMatched: boolean;
  primaryHint: string;
  jointAccuracies: Record<string, { status: 'correct' | 'warning' | 'error'; angle: number; target: number; label: string }>;
}
