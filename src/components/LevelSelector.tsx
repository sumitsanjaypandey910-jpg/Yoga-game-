import React from 'react';
import { Star, Lock, Play, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';
import { AgeGroup, YogaPose } from '../types/yoga';
import { PoseIllustration } from './PoseIllustrations';

interface LevelSelectorProps {
  poses: YogaPose[];
  completedLevels: number[];
  levelStars: Record<number, number>;
  currentLevel: number;
  onSelectLevel: (level: number) => void;
  ageGroup: AgeGroup;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  poses,
  completedLevels,
  levelStars,
  currentLevel,
  onSelectLevel,
  ageGroup,
}) => {
  return (
    <div id="level-selector-section" className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-yellow-300 via-lime-300 to-emerald-400 border-2 border-lime-400 shadow-xl shadow-lime-900/10 text-emerald-950 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 rounded-full text-xs font-black uppercase tracking-wider text-emerald-900 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-300" />
            <span>Adventure Quest Map (Levels 1 - 12)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Yoga Journey: From Little Sprout to Grand Master
          </h2>
          <p className="text-sm font-semibold text-emerald-900/90 max-w-xl">
            Complete each pose by holding it with good posture. Conquer <strong>Level 11</strong> to earn the prestigious Grand Master Champion Trophy and Diploma!
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/85 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/60 shadow-md">
          <Trophy className="w-8 h-8 text-amber-500 fill-amber-300 animate-bounce" />
          <div>
            <p className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Ultimate Quest</p>
            <p className="text-sm font-black text-emerald-950">Level 11 Milestone</p>
          </div>
        </div>
      </div>

      {/* 12 Level Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {poses.map((pose) => {
          const isCompleted = completedLevels.includes(pose.level);
          // Level 1 is always unlocked; other levels unlocked if previous is completed or already played
          const isUnlocked = pose.level === 1 || completedLevels.includes(pose.level - 1) || completedLevels.includes(pose.level);
          const isSelected = currentLevel === pose.level;
          const stars = levelStars[pose.level] || 0;
          const isGrandMilestone = pose.level === 11;

          return (
            <div
              key={pose.id}
              id={`level-card-${pose.level}`}
              onClick={() => isUnlocked && onSelectLevel(pose.level)}
              className={`relative rounded-3xl p-4.5 transition-all duration-200 flex flex-col justify-between border-2 ${
                isGrandMilestone
                  ? 'border-yellow-400 bg-gradient-to-b from-yellow-50 via-amber-50 to-lime-50 shadow-lg shadow-yellow-500/10 ring-2 ring-yellow-400/50'
                  : isSelected
                  ? 'border-lime-500 bg-lime-50/90 shadow-lg shadow-lime-900/10 ring-2 ring-lime-400'
                  : isUnlocked
                  ? 'border-emerald-200 bg-white hover:border-lime-400 hover:shadow-md cursor-pointer'
                  : 'border-stone-200 bg-stone-100/70 opacity-60 cursor-not-allowed'
              }`}
            >
              {/* Grand Milestone Ribbon */}
              {isGrandMilestone && (
                <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-emerald-950 font-black text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1 border border-yellow-300">
                  <Trophy className="w-3 h-3 text-amber-900 fill-amber-300" />
                  <span>Grand Reward Milestone!</span>
                </div>
              )}

              {/* Level Number & Status */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shadow-xs ${
                      isGrandMilestone
                        ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-amber-950 font-black ring-2 ring-yellow-300'
                        : isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isUnlocked
                        ? 'bg-lime-400 text-emerald-950'
                        : 'bg-stone-300 text-stone-600'
                    }`}>
                      {pose.level}
                    </span>
                    <span className="text-xs font-bold text-emerald-800">{pose.animalAlias}</span>
                  </div>

                  {/* Stars Display */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-4 h-4 ${
                          starIdx <= stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-stone-300 fill-stone-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Illustration Thumbnail */}
                <div className="relative my-2 p-2 rounded-2xl bg-gradient-to-b from-amber-50/60 to-lime-50/60 border border-emerald-100 flex items-center justify-center h-28 overflow-hidden">
                  <PoseIllustration type={pose.svgPoseType} className="max-h-full max-w-full drop-shadow-xs" />
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-[2px] rounded-2xl flex items-center justify-center text-white">
                      <Lock className="w-7 h-7 drop-shadow-md" />
                    </div>
                  )}
                </div>

                {/* Title & Sanskrit */}
                <h3 className="font-extrabold text-base text-emerald-950 tracking-tight line-clamp-1">
                  {pose.name}
                </h3>
                <p className="text-xs font-semibold text-emerald-700 italic mb-2">
                  {pose.sanskritName}
                </p>

                {/* Short Target Hint */}
                <p className="text-xs text-emerald-900/80 font-medium line-clamp-2 leading-relaxed mb-3">
                  {ageGroup === 'sprouts' ? pose.kidFriendlyGuide : pose.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-emerald-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                  ⏱️ {pose.holdSeconds[ageGroup]}s Hold
                </span>

                {isUnlocked ? (
                  <button
                    id={`play-level-btn-${pose.level}`}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-lime-500 hover:bg-lime-600 text-white shadow-sm'
                        : isCompleted
                        ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                        : 'bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-sm'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isCompleted ? 'Replay' : 'Play'}</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-stone-500">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
