import React, { useState, useEffect } from 'react';
import { YogaPose } from '../types/yoga';
import { AnimatedCartoonYogiRenderer } from './AnimatedPoseVideo';

interface CornerAnimatedPoseProps {
  pose: YogaPose;
  className?: string;
}

export const CornerAnimatedPose: React.FC<CornerAnimatedPoseProps> = ({
  pose,
  className = '',
}) => {
  const [motionPhase, setMotionPhase] = useState<number>(0);

  // Smooth continuous animation cycle for the cartoon character
  useEffect(() => {
    let frameId: number;
    const startTime = performance.now();
    const cycleDuration = 3800; // 3.8s smooth breathing cycle

    const animate = (time: number) => {
      const elapsed = (time - startTime) % cycleDuration;
      const progress = elapsed / cycleDuration;
      // Smooth sinusoidal flow: starts at 0, peaks at 1, returns to 0
      const phase = 0.5 - 0.5 * Math.cos(progress * 2 * Math.PI);
      setMotionPhase(phase);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [pose.id]);

  return (
    <div
      id="corner-animated-pose-guide"
      className={`absolute bottom-3 left-3 sm:bottom-5 sm:left-5 z-20 pointer-events-auto flex flex-col items-center ${className}`}
    >
      {/* Compact glass card */}
      <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl bg-stone-950/80 backdrop-blur-md border border-lime-400/80 shadow-2xl shadow-black/80 flex flex-col items-center justify-between p-1.5 overflow-hidden transition-transform transform hover:scale-105">
        {/* Animated cartoon character viewport */}
        <div className="w-full h-16 sm:h-20 flex items-center justify-center overflow-hidden">
          <AnimatedCartoonYogiRenderer
            poseType={pose.svgPoseType}
            motionPhase={motionPhase}
          />
        </div>

        {/* Minimal clean 1-line label */}
        <div className="w-full text-center bg-lime-400/20 rounded-md py-0.5 px-1 border border-lime-400/30">
          <p className="text-[9px] sm:text-[10px] font-black text-lime-300 truncate leading-tight">
            {pose.animalAlias ? `${pose.animalAlias.split(' ')[0]} ${pose.name.split('/')[0]}` : pose.name.split('/')[0]}
          </p>
        </div>
      </div>
    </div>
  );
};
