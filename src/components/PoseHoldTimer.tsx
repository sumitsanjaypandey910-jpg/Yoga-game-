import React from 'react';
import { Sparkles, CheckCircle2, Flame } from 'lucide-react';

interface PoseHoldTimerProps {
  currentHoldSeconds: number;
  targetHoldSeconds: number;
  isMatched: boolean;
  score: number;
  comboStreak?: number;
}

export const PoseHoldTimer: React.FC<PoseHoldTimerProps> = ({
  currentHoldSeconds,
  targetHoldSeconds,
  isMatched,
  score,
  comboStreak = 1,
}) => {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, currentHoldSeconds / targetHoldSeconds);
  const strokeDashoffset = circumference - progress * circumference;
  const remainingSecs = Math.max(0, targetHoldSeconds - currentHoldSeconds);

  const isComplete = currentHoldSeconds >= targetHoldSeconds;

  return (
    <div id="pose-hold-timer-container" className="relative flex flex-col items-center justify-center p-4 bg-white/95 backdrop-blur-md rounded-3xl border-2 border-emerald-300 shadow-xl shadow-emerald-950/10">
      {/* Timer Circular Canvas */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Background Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#fef08a"
            strokeWidth="12"
            fill="transparent"
            className="opacity-40"
          />
          {/* Progress Indicator */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="url(#timerGradient)"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-150 ease-out"
          />
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Countdown Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {isComplete ? (
            <div className="flex flex-col items-center animate-bounce text-emerald-600">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 fill-emerald-100" />
              <span className="text-sm font-extrabold tracking-wide uppercase mt-1">PASSED!</span>
            </div>
          ) : (
            <>
              <div className="flex items-baseline justify-center font-black">
                <span className={`text-4xl font-black tracking-tight ${isMatched ? 'text-emerald-600 scale-110 transition-transform' : 'text-amber-500'}`}>
                  {remainingSecs.toFixed(1)}
                </span>
                <span className="text-sm font-bold text-emerald-800 ml-0.5">s</span>
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-0.5 ${isMatched ? 'bg-emerald-100 text-emerald-700 animate-pulse' : 'bg-amber-100 text-amber-800'}`}>
                {isMatched ? 'HOLDING!' : 'GET READY'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Accuracy & Streak Chips */}
      <div className="w-full flex items-center justify-between gap-2 mt-2 pt-2 border-t border-emerald-100 text-xs font-semibold">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-full border border-amber-200 text-amber-900">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-300" />
          <span>Match: <strong>{score}%</strong></span>
        </div>

        {comboStreak > 1 && (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-lime-100 rounded-full border border-lime-300 text-emerald-900 animate-pulse">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-400" />
            <span>{comboStreak}x Streak!</span>
          </div>
        )}
      </div>
    </div>
  );
};
