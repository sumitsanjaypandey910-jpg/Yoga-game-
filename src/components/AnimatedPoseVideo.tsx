import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Wind, Gauge, Maximize2, Minimize2, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { AgeGroup, YogaPose, PoseAnimationStep } from '../types/yoga';
import { speakGuidePhrase } from '../utils/audioEffects';

interface AnimatedPoseVideoProps {
  pose: YogaPose;
  ageGroup: AgeGroup;
  soundEnabled?: boolean;
  voiceEnabled?: boolean;
  compact?: boolean;
  onClose?: () => void;
}

export const AnimatedPoseVideo: React.FC<AnimatedPoseVideoProps> = ({
  pose,
  ageGroup,
  soundEnabled = true,
  voiceEnabled = true,
  compact = false,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [progressInStep, setProgressInStep] = useState<number>(0); // 0 to 1
  const [playbackSpeed, setPlaybackSpeed] = useState<0.5 | 1 | 1.5>(1);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const steps = pose.animationSteps && pose.animationSteps.length > 0 ? pose.animationSteps : [
    {
      stepNumber: 1,
      title: 'Starting Stance',
      instruction: 'Stand tall with feet grounded and take a deep, centering breath.',
      duration: 3,
      breathCue: 'inhale' as const,
      keyAction: 'Center & ground',
    },
    {
      stepNumber: 2,
      title: 'Motion & Transition',
      instruction: `Smoothly transition your body into the ${pose.name} posture.`,
      duration: 3.5,
      breathCue: 'exhale' as const,
      keyAction: 'Flow into form',
    },
    {
      stepNumber: 3,
      title: 'Peak Alignment Hold',
      instruction: `Lock in the posture! ${pose.keyTips[0] || 'Hold steady and breathe smoothly.'}`,
      duration: 4,
      breathCue: 'steady' as const,
      keyAction: 'Hold & align',
    },
    {
      stepNumber: 4,
      title: 'Graceful Release',
      instruction: 'Slowly return to neutral standing position and feel the peaceful energy.',
      duration: 2.5,
      breathCue: 'exhale' as const,
      keyAction: 'Gentle release',
    },
  ];

  const currentStep = steps[currentStepIndex] || steps[0];

  // Speak voice instruction when step changes
  useEffect(() => {
    if (voiceEnabled && isPlaying) {
      const cue = `Step ${currentStep.stepNumber}: ${currentStep.title}. ${currentStep.instruction}`;
      speakGuidePhrase(cue);
    }
  }, [currentStepIndex, voiceEnabled, isPlaying]);

  // Main animation timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const stepDurationMs = (currentStep.duration * 1000) / playbackSpeed;
    const intervalMs = 30;
    const increment = intervalMs / stepDurationMs;

    const interval = setInterval(() => {
      setProgressInStep((prev) => {
        const next = prev + increment;
        if (next >= 1) {
          // Advance to next step
          setCurrentStepIndex((currIdx) => {
            if (currIdx + 1 < steps.length) {
              return currIdx + 1;
            } else {
              if (isLooping) {
                return 0;
              } else {
                setIsPlaying(false);
                return currIdx;
              }
            }
          });
          return 0;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPlaying, currentStepIndex, currentStep.duration, playbackSpeed, isLooping, steps.length]);

  const handleStepClick = (idx: number) => {
    setCurrentStepIndex(idx);
    setProgressInStep(0);
  };

  const handleNextStep = () => {
    setCurrentStepIndex((prev) => (prev + 1) % steps.length);
    setProgressInStep(0);
  };

  const handlePrevStep = () => {
    setCurrentStepIndex((prev) => (prev - 1 + steps.length) % steps.length);
    setProgressInStep(0);
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setProgressInStep(0);
    setIsPlaying(true);
  };

  // Compute interpolated motion factor (0 = start of move, 1 = peak, 0 = return)
  let motionPhase = 0;
  if (currentStepIndex === 0) {
    motionPhase = progressInStep * 0.25;
  } else if (currentStepIndex === 1) {
    motionPhase = 0.25 + progressInStep * 0.75;
  } else if (currentStepIndex === 2) {
    motionPhase = 1.0 + Math.sin(progressInStep * Math.PI * 2) * 0.04;
  } else {
    motionPhase = 1.0 - progressInStep;
  }

  return (
    <div
      ref={containerRef}
      id="animated-pose-video-player"
      className={`relative rounded-3xl overflow-hidden bg-gradient-to-b from-stone-900 via-emerald-950 to-stone-950 border-2 border-lime-400/80 shadow-xl ${
        compact ? 'p-2.5' : 'p-3.5 sm:p-4'
      } text-white flex flex-col justify-between`}
    >
      {/* Video Header & Controls */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-[10px] font-black text-lime-300 uppercase tracking-wider">
            Cartoon Video Trainer
          </span>
          <span className="text-xs font-bold text-stone-300 hidden sm:inline">• {pose.name}</span>
        </div>

        {/* Playback rate & Loop options */}
        <div className="flex items-center gap-1">
          <button
            id="video-speed-btn"
            onClick={() => setPlaybackSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 0.5 : 1))}
            className="px-2 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-lime-300 text-[10px] font-bold border border-white/10 flex items-center gap-0.5"
            title="Adjust demo playback speed"
          >
            <Gauge className="w-3 h-3" />
            <span>{playbackSpeed}x</span>
          </button>

          <button
            id="video-loop-btn"
            onClick={() => setIsLooping(!isLooping)}
            className={`px-2 py-1 rounded-xl text-[10px] font-bold border transition-colors ${
              isLooping ? 'bg-lime-400 text-emerald-950 border-lime-300' : 'bg-white/10 text-stone-300 border-white/10'
            }`}
            title="Loop video indefinitely"
          >
            <span>Loop</span>
          </button>
        </div>
      </div>

      {/* Main Video Canvas Screen: Full Cartoon Human Body */}
      <div className="relative w-full aspect-16/10 sm:aspect-16/9 bg-gradient-to-b from-teal-950/60 via-emerald-900/40 to-stone-900 rounded-2xl border border-lime-500/30 overflow-hidden flex items-center justify-center shadow-inner my-1">
        {/* Animated Cartoon Human Renderer */}
        <AnimatedCartoonYogiRenderer poseType={pose.svgPoseType} motionPhase={motionPhase} />

        {/* Breath Cue Badge in Canvas */}
        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full backdrop-blur-md bg-black/50 border border-white/10 text-xs font-bold flex items-center gap-1.5 z-10">
          <Wind className={`w-3.5 h-3.5 ${currentStep.breathCue === 'inhale' ? 'text-cyan-400' : currentStep.breathCue === 'exhale' ? 'text-amber-400' : 'text-lime-400'} animate-pulse`} />
          <span className="capitalize text-[11px] text-lime-200">
            {currentStep.breathCue}: {currentStep.keyAction}
          </span>
        </div>

        {/* Bottom Current Instruction Subtitle Bar */}
        <div className="absolute inset-x-2 bottom-2 p-2 rounded-xl backdrop-blur-md bg-black/75 border border-white/10 text-center z-10">
          <p className="text-xs sm:text-sm font-bold text-yellow-300 leading-tight">
            {currentStep.instruction}
          </p>
        </div>
      </div>

      {/* Step Thumbnails / Quick Jump Navigation */}
      <div className="grid grid-cols-4 gap-1.5 mb-2 mt-1">
        {steps.map((s, idx) => {
          const isActive = idx === currentStepIndex;
          const isDone = idx < currentStepIndex;
          return (
            <button
              key={s.stepNumber}
              id={`video-step-pill-${idx}`}
              onClick={() => handleStepClick(idx)}
              className={`p-1.5 rounded-xl border text-center transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-lime-400 to-yellow-300 text-emerald-950 border-white font-black shadow-md scale-105'
                  : isDone
                  ? 'bg-emerald-900/60 text-lime-200 border-emerald-500/40 hover:bg-emerald-800/60 font-semibold'
                  : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10 font-semibold'
              }`}
            >
              <div className="text-[9px] uppercase tracking-wider flex items-center justify-center gap-1">
                {isDone && <CheckCircle className="w-2.5 h-2.5 text-lime-400" />}
                <span>Step {s.stepNumber}</span>
              </div>
              <p className="text-[10px] truncate">{s.title.split(' ')[0]}</p>
            </button>
          );
        })}
      </div>

      {/* Video Control Bar */}
      <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-lime-500/20">
        <div className="flex items-center gap-1.5">
          <button
            id="video-prev-step-btn"
            onClick={handlePrevStep}
            className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-transform active:scale-95"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            id="video-play-pause-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 shadow-md transition-transform active:scale-95 ${
              isPlaying
                ? 'bg-amber-400 text-amber-950 hover:bg-amber-300'
                : 'bg-gradient-to-r from-lime-400 to-emerald-500 text-emerald-950 hover:from-lime-300 hover:to-emerald-400'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-amber-950" /> : <Play className="w-3.5 h-3.5 fill-emerald-950" />}
            <span>{isPlaying ? 'Pause' : 'Play Demo'}</span>
          </button>

          <button
            id="video-next-step-btn"
            onClick={handleNextStep}
            className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-transform active:scale-95"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          id="video-restart-btn"
          onClick={handleRestart}
          className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-lime-300 border border-lime-400/30 text-xs font-bold flex items-center gap-1 transition-transform active:scale-95"
          title="Restart video from Step 1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart</span>
        </button>
      </div>
    </div>
  );
};

// ==========================================
// ANIMATED CARTOON HUMAN CHARACTER RENDERER
// ==========================================

export interface AnimatedCartoonYogiProps {
  poseType: string;
  motionPhase: number; // 0 (neutral) to 1.0 (peak form)
}

export const AnimatedCartoonYogiRenderer: React.FC<AnimatedCartoonYogiProps> = ({ poseType, motionPhase }) => {
  const p = Math.max(0, Math.min(1.1, motionPhase));

  // Cartoon Human Aesthetics Palette
  const skin = '#fde68a';
  const skinShadow = '#fcd34d';
  const hair = '#78350f';
  const shirt = '#10b981';
  const shirtDark = '#059669';
  const pants = '#4338ca';
  const pantsDark = '#3730a3';
  const headband = '#f59e0b';
  const blush = 'rgba(244, 63, 94, 0.4)';
  const outline = '#1e293b';
  const aura = 'rgba(250, 204, 21, 0.25)';
  const matColor = '#86efac';

  // Helper for drawing cartoon human face
  const renderFace = (cx: number, cy: number, lookDirection: 'center' | 'right' | 'left' = 'center') => (
    <g id="cartoon-anim-face">
      {/* Head base */}
      <circle cx={cx} cy={cy} r="16" fill={skin} stroke={outline} strokeWidth="2.5" />
      {/* Hair back / volume */}
      <path
        d={`M${cx - 16} ${cy - 2} C${cx - 18} ${cy - 18}, ${cx + 18} ${cy - 18}, ${cx + 16} ${cy - 2} C${cx + 10} ${cy - 10}, ${cx - 10} ${cy - 10}, ${cx - 16} ${cy - 2} Z`}
        fill={hair}
      />
      {/* Hair bun */}
      <circle cx={cx} cy={cy - 17} r="7" fill={hair} stroke={outline} strokeWidth="1.5" />
      {/* Headband */}
      <path
        d={`M${cx - 15} ${cy - 6} Q${cx} ${cy - 10} ${cx + 15} ${cy - 6}`}
        stroke={headband}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Fringe */}
      <path
        d={`M${cx - 14} ${cy - 6} Q${cx - 4} ${cy - 2} ${cx} ${cy - 6} Q${cx + 6} ${cy - 3} ${cx + 14} ${cy - 6}`}
        fill={hair}
      />
      {/* Eyes with sparkle */}
      {lookDirection === 'center' && (
        <>
          <ellipse cx={cx - 5.5} cy={cy + 1} rx="2" ry="2.5" fill={outline} />
          <ellipse cx={cx + 5.5} cy={cy + 1} rx="2" ry="2.5" fill={outline} />
          <circle cx={cx - 6} cy={cy} r="0.8" fill="#ffffff" />
          <circle cx={cx + 5} cy={cy} r="0.8" fill="#ffffff" />
        </>
      )}
      {lookDirection === 'right' && (
        <>
          <ellipse cx={cx - 2} cy={cy + 1} rx="2" ry="2.5" fill={outline} />
          <ellipse cx={cx + 7} cy={cy + 1} rx="2" ry="2.5" fill={outline} />
          <circle cx={cx - 1.5} cy={cy} r="0.8" fill="#ffffff" />
          <circle cx={cx + 7.5} cy={cy} r="0.8" fill="#ffffff" />
        </>
      )}
      {lookDirection === 'left' && (
        <>
          <ellipse cx={cx - 7} cy={cy + 1} rx="2" ry="2.5" fill={outline} />
          <ellipse cx={cx + 2} cy={cy + 1} rx="2" ry="2.5" fill={outline} />
          <circle cx={cx - 6.5} cy={cy} r="0.8" fill="#ffffff" />
          <circle cx={cx + 2.5} cy={cy} r="0.8" fill="#ffffff" />
        </>
      )}
      {/* Cheeks blush */}
      <circle cx={cx - 9} cy={cy + 4} r="3" fill={blush} />
      <circle cx={cx + 9} cy={cy + 4} r="3" fill={blush} />
      {/* Smile */}
      <path
        d={`M${cx - 4} ${cy + 6} Q${cx} ${cy + 9} ${cx + 4} ${cy + 6}`}
        stroke={outline}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );

  switch (poseType) {
    case 'mountain': {
      // Arms sweep from sides up to heart in namaste
      const handY = 160 - p * 65;
      const leftElbowX = 72 - (1 - p) * 10;
      const rightElbowX = 128 + (1 - p) * 10;
      return (
        <svg viewBox="0 0 200 240" className="w-full h-full max-h-56" fill="none">
          {/* Energy Ring */}
          <circle cx="100" cy="110" r={40 + p * 20} fill={aura} className="animate-pulse" />
          <ellipse cx="100" cy="225" rx="75" ry="9" fill={matColor} stroke="#22c55e" strokeWidth="2" />

          {/* Legs in leggings */}
          <path d="M91 135 L86 175 L86 215 C86 218 80 222 75 222 C70 222 70 216 74 214 L80 175 L85 135 Z" fill={pants} stroke={outline} strokeWidth="2" />
          <path d="M109 135 L114 175 L114 215 C114 218 120 222 125 222 C130 222 130 216 126 214 L120 175 L115 135 Z" fill={pantsDark} stroke={outline} strokeWidth="2" />
          <ellipse cx="80" cy="220" rx="8" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />
          <ellipse cx="120" cy="220" rx="8" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Torso & Shirt */}
          <path d="M84 72 L116 72 L113 138 L87 138 Z" fill={shirt} stroke={outline} strokeWidth="2.5" />
          <circle cx="100" cy="98" r="4" fill="#facc15" stroke={outline} strokeWidth="1" />

          {/* Animated Human Arms */}
          <path d={`M84 75 L${leftElbowX} 100 L96 ${handY} L98 ${handY - 6} L${leftElbowX + 6} 95 L88 75 Z`} fill={skin} stroke={outline} strokeWidth="2" />
          <path d={`M116 75 L${rightElbowX} 100 L104 ${handY} L102 ${handY - 6} L${rightElbowX - 6} 95 L112 75 Z`} fill={skinShadow} stroke={outline} strokeWidth="2" />
          {/* Namaste Palms */}
          <path d={`M96 ${handY - 10} C96 ${handY - 16} 104 ${handY - 16} 104 ${handY - 10} L104 ${handY + 5} L96 ${handY + 5} Z`} fill="#fef08a" stroke={outline} strokeWidth="1.5" />

          {/* Head */}
          {renderFace(100, 52, 'center')}
        </svg>
      );
    }

    case 'tree': {
      // Animated Tree: Foot lifts to knee; arms rise like blooming tree branches overhead
      const footX = 100 + p * 6;
      const footY = 220 - p * 47;
      const kneeX = 100 + p * 45;
      const kneeY = 175 - p * 15;

      const leftHandX = 100 - p * 0;
      const leftHandY = 140 - p * 120;
      const rightHandX = 100 + p * 0;
      const rightHandY = 140 - p * 120;

      return (
        <svg viewBox="0 0 200 240" className="w-full h-full max-h-56" fill="none">
          {/* Canopy Glow */}
          <circle cx="100" cy="65" r={25 + p * 35} fill={aura} />
          <ellipse cx="100" cy="225" rx="75" ry="9" fill={matColor} stroke="#22c55e" strokeWidth="2" />

          {/* Standing Leg (Left) */}
          <path d="M93 135 L93 216 C93 219 96 222 100 222 C104 222 107 219 107 216 L107 135 Z" fill={pants} stroke={outline} strokeWidth="2" />
          <ellipse cx="100" cy="220" rx="9" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Lifting Right Leg */}
          <path d={`M107 135 L${kneeX} ${kneeY} L${footX + 4} ${footY} L${footX} ${footY - 6} L${kneeX - 6} ${kneeY - 6} L105 135 Z`} fill={pantsDark} stroke={outline} strokeWidth="2" />
          <ellipse cx={footX} cy={footY} rx="6" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Torso */}
          <path d="M85 72 L115 72 L112 138 L88 138 Z" fill={shirt} stroke={outline} strokeWidth="2.5" />
          <circle cx="100" cy="98" r="4" fill="#facc15" stroke={outline} strokeWidth="1" />

          {/* Tree Branch Arms Rising */}
          <path d={`M85 75 C${70 - p * 10} ${75 - p * 20} ${70 - p * 5} ${40 - p * 15} ${leftHandX - 4} ${leftHandY} L${leftHandX} ${leftHandY + 6} C${78} ${45} ${85} ${70} 89 75 Z`} fill={skin} stroke={outline} strokeWidth="2" />
          <path d={`M115 75 C${130 + p * 10} ${75 - p * 20} ${130 + p * 5} ${40 - p * 15} ${rightHandX + 4} ${rightHandY} L${rightHandX} ${rightHandY + 6} C${122} ${45} ${115} ${70} 111 75 Z`} fill={skinShadow} stroke={outline} strokeWidth="2" />
          {/* Hands meeting overhead */}
          <circle cx="100" cy={leftHandY} r="6" fill="#fef08a" stroke={outline} strokeWidth="1.5" />

          {/* Head */}
          {renderFace(100, 52, 'center')}
        </svg>
      );
    }

    case 'star': {
      // Step wide into star pose, arms expanding outwards
      const leftFootX = 80 - p * 40;
      const rightFootX = 120 + p * 40;
      const leftHandX = 80 - p * 60;
      const leftHandY = 135 - p * 50;
      const rightHandX = 120 + p * 60;
      const rightHandY = 135 - p * 50;

      return (
        <svg viewBox="0 0 200 240" className="w-full h-full max-h-56" fill="none">
          <polygon
            points="100,10 120,65 185,70 135,110 155,170 100,135 45,170 65,110 15,70 80,65"
            fill={aura}
            opacity={p * 0.7}
          />
          <ellipse cx="100" cy="225" rx="85" ry="9" fill={matColor} stroke="#22c55e" strokeWidth="2" />

          {/* Wide Legs */}
          <path d={`M90 135 L${leftFootX + 8} 214 C${leftFootX + 6} 218 ${leftFootX + 1} 219 ${leftFootX - 3} 217 C${leftFootX - 6} 214 ${leftFootX - 5} 210 ${leftFootX - 1} 206 L82 135 Z`} fill={pants} stroke={outline} strokeWidth="2" />
          <path d={`M110 135 L${rightFootX - 8} 214 C${rightFootX - 6} 218 ${rightFootX - 1} 219 ${rightFootX + 3} 217 C${rightFootX + 6} 214 ${rightFootX + 5} 210 ${rightFootX + 1} 206 L118 135 Z`} fill={pantsDark} stroke={outline} strokeWidth="2" />
          <ellipse cx={leftFootX} cy="216" rx="8" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />
          <ellipse cx={rightFootX} cy="216" rx="8" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Torso */}
          <path d="M85 72 L115 72 L113 138 L87 138 Z" fill={shirt} stroke={outline} strokeWidth="2.5" />
          <circle cx="100" cy="98" r="4" fill="#facc15" stroke={outline} strokeWidth="1" />

          {/* Wide Star Arms */}
          <path d={`M85 78 L${leftHandX + 5} ${leftHandY - 5} L${leftHandX} ${leftHandY + 5} L85 92 Z`} fill={skin} stroke={outline} strokeWidth="2" />
          <path d={`M115 78 L${rightHandX - 5} ${rightHandY - 5} L${rightHandX} ${rightHandY + 5} L115 92 Z`} fill={skinShadow} stroke={outline} strokeWidth="2" />
          <ellipse cx={leftHandX} cy={leftHandY} rx="5" ry="6" fill={skin} stroke={outline} strokeWidth="1.5" />
          <ellipse cx={rightHandX} cy={rightHandY} rx="5" ry="6" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Head */}
          {renderFace(100, 52, 'center')}
        </svg>
      );
    }

    case 'warrior2': {
      // Step wide into lunge, arms reach front & back
      const frontKneeX = 115 + p * 30;
      const frontFootX = 115 + p * 37;
      const backFootX = 85 - p * 50;
      const leftArmX = 85 - p * 65;
      const rightArmX = 115 + p * 65;

      return (
        <svg viewBox="0 0 200 240" className="w-full h-full max-h-56" fill="none">
          <ellipse cx="100" cy="120" rx={50 + p * 35} ry="45" fill={aura} />
          <ellipse cx="100" cy="225" rx="85" ry="9" fill={matColor} stroke="#22c55e" strokeWidth="2" />

          {/* Back Leg (Left) */}
          <path d={`M90 135 L${backFootX + 7} 215 C${backFootX + 5} 219 ${backFootX} 220 ${backFootX - 4} 217 C${backFootX - 7} 214 ${backFootX - 5} 209 ${backFootX - 1} 206 L82 135 Z`} fill={pantsDark} stroke={outline} strokeWidth="2" />
          <ellipse cx={backFootX} cy="216" rx="8" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Front Leg (Right lunge) */}
          <path d={`M105 135 L${frontKneeX} ${145 + p * 10} L${frontFootX} 216 C${frontFootX} 220 ${frontFootX + 7} 222 ${frontFootX + 11} 220 L${frontKneeX + 10} ${148 + p * 10} L115 135 Z`} fill={pants} stroke={outline} strokeWidth="2" />
          <ellipse cx={frontFootX + 5} cy="218" rx="8" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Torso */}
          <path d="M85 75 L115 75 L112 138 L88 138 Z" fill={shirt} stroke={outline} strokeWidth="2.5" />

          {/* Warrior Arms */}
          <path d={`M85 80 L${leftArmX} 80 L${leftArmX} 88 L85 88 Z`} fill={skinShadow} stroke={outline} strokeWidth="2" />
          <ellipse cx={leftArmX - 2} cy="84" rx="5" ry="5" fill={skin} stroke={outline} strokeWidth="1.5" />

          <path d={`M115 80 L${rightArmX} 80 L${rightArmX} 88 L115 88 Z`} fill={skin} stroke={outline} strokeWidth="2" />
          <ellipse cx={rightArmX + 2} cy="84" rx="5" ry="5" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Head looking right */}
          {renderFace(100, 52, 'right')}
        </svg>
      );
    }

    case 'airplane': {
      // Torso hinges horizontal, back leg lifts behind, arms soar
      const headX = 100 - p * 48;
      const headY = 52 + p * 36;
      const torsoEndX = 100 + p * 35;
      const torsoAngle = p * 0;
      const backLegX = 100 + p * 118;
      const backLegY = 216 - p * 132;
      const wingTopY = 80 - p * 45;
      const wingBottomY = 90 + p * 48;

      return (
        <svg viewBox="0 0 240 200" className="w-full h-full max-h-56" fill="none">
          <ellipse cx="120" cy="95" rx={50 + p * 50} ry={25 + p * 20} fill={aura} />
          <ellipse cx="135" cy="188" rx="65" ry="7" fill={matColor} stroke="#22c55e" strokeWidth="2" />

          {/* Standing Leg */}
          <path d="M128 92 L132 180 C132 184 136 187 140 187 C144 187 146 183 146 180 L142 92 Z" fill={pants} stroke={outline} strokeWidth="2" />
          <ellipse cx="139" cy="184" rx="8" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Flying Leg */}
          <path d={`M135 84 L${backLegX} ${backLegY} C${backLegX + 4} ${backLegY} ${backLegX + 7} ${backLegY + 4} ${backLegX + 4} ${backLegY + 8} L135 94 Z`} fill={pantsDark} stroke={outline} strokeWidth="2" />
          <ellipse cx={backLegX + 3} cy={backLegY + 4} rx="5" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Torso */}
          <path d={`M${headX + 13} ${headY - 8} L${torsoEndX} 80 L${torsoEndX} 96 L${headX + 13} ${headY + 8} Z`} fill={shirt} stroke={outline} strokeWidth="2.5" />

          {/* Wing Arms */}
          <path d={`M95 80 L${75 - p * 5} ${wingTopY} L${80 - p * 5} ${wingTopY - 4} L100 85 Z`} fill={skin} stroke={outline} strokeWidth="2" />
          <circle cx={76 - p * 5} cy={wingTopY - 2} r="4.5" fill={skin} stroke={outline} strokeWidth="1.5" />

          <path d={`M95 95 L${115 + p * 5} ${wingBottomY} L${120 + p * 5} ${wingBottomY + 4} L100 90 Z`} fill={skinShadow} stroke={outline} strokeWidth="2" />
          <circle cx={118 + p * 5} cy={wingBottomY + 2} r="4.5" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Head looking forward */}
          {renderFace(headX, headY, 'left')}
        </svg>
      );
    }

    case 'downward_dog': {
      // Hips lift into pyramid inverted V
      const hipX = 100 + p * 25;
      const hipY = 135 - p * 80;
      const handX = 75 - p * 35;
      const footX = 125 + p * 55;

      return (
        <svg viewBox="0 0 220 200" className="w-full h-full max-h-56" fill="none">
          <polygon points={`40,175 ${hipX},${hipY} 185,175`} fill={aura} />
          <ellipse cx="110" cy="180" rx="90" ry="8" fill={matColor} stroke="#22c55e" strokeWidth="2" />

          {/* Legs to Feet */}
          <path d={`M${hipX} ${hipY} L${footX - 10} 170 C${footX - 8} 174 ${footX - 3} 176 ${footX + 1} 173 L${hipX + 12} ${hipY} Z`} fill={pants} stroke={outline} strokeWidth="2.5" />
          <ellipse cx={footX - 5} cy="172" rx="7" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Torso */}
          <path d={`M${hipX + 10} ${hipY} L75 110 L65 100 L${hipX} ${hipY - 10} Z`} fill={shirt} stroke={outline} strokeWidth="2.5" />

          {/* Arms to Hands */}
          <path d={`M72 105 L${handX - 2} 168 C${handX - 4} 172 ${handX} 176 ${handX + 4} 175 L82 105 Z`} fill={skin} stroke={outline} strokeWidth="2" />
          <ellipse cx={handX} cy="172" rx="6" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Head */}
          {renderFace(70, 118, 'center')}
        </svg>
      );
    }

    case 'cobra': {
      // Chest arches from prone position
      const headY = 120 - p * 62;
      const chestY = 135 - p * 45;

      return (
        <svg viewBox="0 0 220 180" className="w-full h-full max-h-56" fill="none">
          <circle cx="60" cy={headY} r={25 + p * 15} fill={aura} />
          <ellipse cx="110" cy="155" rx="90" ry="8" fill={matColor} stroke="#22c55e" strokeWidth="2" />

          {/* Lower Body & Legs */}
          <path d="M100 135 L190 148 C195 149 198 153 195 156 C192 159 187 157 182 155 L100 148 Z" fill={pants} stroke={outline} strokeWidth="2" />
          <ellipse cx="192" cy="152" rx="6" ry="3" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Arched Torso */}
          <path d={`M60 ${headY + 17} Q90 ${chestY + 15} 120 142 L105 150 Q75 125 50 ${headY + 24} Z`} fill={shirt} stroke={outline} strokeWidth="2.5" />

          {/* Arms */}
          <path d={`M62 ${headY + 27} L72 145 C73 149 78 152 82 150 L74 ${headY + 27} Z`} fill={skin} stroke={outline} strokeWidth="2" />
          <ellipse cx="78" cy="148" rx="6" ry="3" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Head looking up */}
          {renderFace(55, headY, 'right')}
        </svg>
      );
    }

    case 'triangle': {
      // Upper body tilts laterally with sky & shin reach
      const topHandY = 70 - p * 44;
      const bottomHandY = 110 + p * 65;

      return (
        <svg viewBox="0 0 200 240" className="w-full h-full max-h-56" fill="none">
          <polygon points="50,215 80,30 165,215" fill={aura} />
          <ellipse cx="100" cy="225" rx="85" ry="9" fill={matColor} stroke="#22c55e" strokeWidth="2" />

          {/* Wide Legs */}
          <path d="M105 130 L52 214 C50 218 45 219 41 217 C38 214 39 209 43 206 L96 130 Z" fill={pants} stroke={outline} strokeWidth="2" />
          <path d="M115 130 L158 214 C160 218 165 219 169 217 C172 214 171 209 167 206 L124 130 Z" fill={pantsDark} stroke={outline} strokeWidth="2" />
          <ellipse cx="44" cy="216" rx="8" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />
          <ellipse cx="166" cy="216" rx="8" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Slanted Torso */}
          <path d={`M${88 - p * 8} ${75 + p * 7} L${115 - p * 10} ${70} L125 130 L100 138 Z`} fill={shirt} stroke={outline} strokeWidth="2.5" />

          {/* Arms: Sky & Ground */}
          <path d={`M92 72 L78 ${topHandY + 2} L84 ${topHandY} L96 76 Z`} fill={skin} stroke={outline} strokeWidth="2" />
          <circle cx="80" cy={topHandY} r="5" fill={skin} stroke={outline} strokeWidth="1.5" />

          <path d={`M88 84 L58 ${bottomHandY - 2} L64 ${bottomHandY} L96 88 Z`} fill={skinShadow} stroke={outline} strokeWidth="2" />
          <circle cx="60" cy={bottomHandY} r="5" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Head looking to top arm */}
          {renderFace(96, 60, 'left')}
        </svg>
      );
    }

    case 'chair': {
      // Hips sink into squat, arms reach up
      const hipX = 85 - p * 7;
      const hipY = 130 + p * 5;
      const armY = 75 - p * 47;

      return (
        <svg viewBox="0 0 200 240" className="w-full h-full max-h-56" fill="none">
          <ellipse cx="100" cy="160" rx="45" ry={25 + p * 15} fill={aura} />
          <ellipse cx="100" cy="225" rx="75" ry="9" fill={matColor} stroke="#22c55e" strokeWidth="2" />

          {/* Squatting Thighs & Calves */}
          <path d={`M${hipX} ${hipY} L120 155 L115 216 C115 220 121 222 125 220 L128 158 L${hipX + 7} ${hipY} Z`} fill={pants} stroke={outline} strokeWidth="2" />
          <ellipse cx="122" cy="218" rx="8" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Angled Torso */}
          <path d={`M98 75 L125 80 L${hipX + 3} ${hipY + 5} L${hipX - 20} ${hipY} Z`} fill={shirt} stroke={outline} strokeWidth="2.5" />

          {/* Reaching Arms */}
          <path d={`M110 75 L145 ${armY} L151 ${armY + 3} L118 82 Z`} fill={skin} stroke={outline} strokeWidth="2" />
          <circle cx="148" cy={armY} r="5.5" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Head */}
          {renderFace(108, 55, 'right')}
        </svg>
      );
    }

    case 'boat': {
      // V-balance on sit bones
      const legY = 135 - p * 73;
      const torsoHeadY = 75 - p * 21;

      return (
        <svg viewBox="0 0 220 180" className="w-full h-full max-h-56" fill="none">
          <ellipse cx="110" cy="110" rx="75" ry="50" fill={aura} />
          <ellipse cx="110" cy="165" rx="75" ry="8" fill={matColor} stroke="#22c55e" strokeWidth="2" />

          {/* V-Legs */}
          <path d={`M102 135 L168 ${legY} C172 ${legY - 4} 177 ${legY} 174 ${legY + 4} L108 142 Z`} fill={pants} stroke={outline} strokeWidth="2" />
          <ellipse cx="172" cy={legY} rx="6" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Lean-back Torso */}
          <path d={`M58 ${torsoHeadY} L80 ${torsoHeadY - 13} L112 135 L90 142 Z`} fill={shirt} stroke={outline} strokeWidth="2.5" />

          {/* Arms */}
          <path d="M80 95 L145 95 C149 95 149 101 145 101 L80 101 Z" fill={skin} stroke={outline} strokeWidth="2" />
          <circle cx="147" cy="98" r="4.5" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Head */}
          {renderFace(62, torsoHeadY - 21, 'right')}
        </svg>
      );
    }

    case 'lotus':
    default: {
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full max-h-56" fill="none">
          {/* Blossom aura */}
          <path d="M100 35 C60 75 50 135 100 155 C150 135 140 75 100 35 Z" fill={aura} />
          <ellipse cx="100" cy="180" rx="75" ry="9" fill={matColor} stroke="#22c55e" strokeWidth="2" />

          {/* Crossed Legs */}
          <path d="M75 135 C50 145 50 170 95 172 C140 170 140 145 115 135 Z" fill={pants} stroke={outline} strokeWidth="2.5" />
          <ellipse cx="62" cy="158" rx="6" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />
          <ellipse cx="138" cy="158" rx="6" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Torso */}
          <path d="M84 75 L116 75 L113 140 L87 140 Z" fill={shirt} stroke={outline} strokeWidth="2.5" />
          <circle cx="100" cy="98" r="4" fill="#facc15" stroke={outline} strokeWidth="1" />

          {/* Mudra Arms */}
          <path d="M84 78 L60 115 L62 148 L68 148 L70 115 L86 78 Z" fill={skin} stroke={outline} strokeWidth="2" />
          <path d="M116 78 L140 115 L138 148 L132 148 L130 115 L114 78 Z" fill={skinShadow} stroke={outline} strokeWidth="2" />
          <circle cx="65" cy="150" r="5" fill="#fef08a" stroke={outline} strokeWidth="1.5" />
          <circle cx="135" cy="150" r="5" fill="#fef08a" stroke={outline} strokeWidth="1.5" />

          {/* Head & Smiling Face */}
          {renderFace(100, 52, 'center')}
        </svg>
      );
    }
  }
};
