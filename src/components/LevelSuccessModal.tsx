import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Trophy, ArrowRight, RotateCcw, Sparkles, Award, CheckCircle2 } from 'lucide-react';
import { YogaPose } from '../types/yoga';

interface LevelSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  pose: YogaPose;
  stars: number;
  score: number;
  holdTime: number;
  onNextLevel: () => void;
  onReplayLevel: () => void;
  onOpenLevel11Celebration?: () => void;
  hasNextLevel: boolean;
}

export const LevelSuccessModal: React.FC<LevelSuccessModalProps> = ({
  isOpen,
  onClose,
  pose,
  stars,
  score,
  holdTime,
  onNextLevel,
  onReplayLevel,
  onOpenLevel11Celebration,
  hasNextLevel,
}) => {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#84cc16', '#22c55e', '#facc15', '#eab308'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isLevel11 = pose.level === 11;

  return (
    <div id="level-success-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gradient-to-b from-amber-50 to-lime-50 rounded-3xl border-4 border-lime-400 p-6 sm:p-7 shadow-2xl text-emerald-950 text-center animate-in zoom-in-95 duration-200">
        {/* Top Trophy / Badge Icon */}
        <div className="w-20 h-20 mx-auto -mt-14 mb-3 rounded-3xl bg-gradient-to-br from-yellow-300 via-lime-400 to-emerald-500 border-4 border-white flex items-center justify-center text-4xl shadow-xl">
          {isLevel11 ? '🏆' : pose.rewardBadge.icon}
        </div>

        {/* Level Complete Title */}
        <div className="space-y-1 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-lime-200/80 rounded-full text-[11px] font-black uppercase tracking-wider text-emerald-900 border border-lime-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Level {pose.level} Mastered!</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-950">
            {isLevel11 ? '🌟 Grand Milestone Achieved!' : 'Pose Mastered!'}
          </h2>
          <p className="text-xs font-semibold text-emerald-800">
            {pose.name} ({pose.animalAlias})
          </p>
        </div>

        {/* Star Rating Animation */}
        <div className="flex items-center justify-center gap-2 my-4">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`p-2 rounded-2xl border-2 transition-transform transform ${
                starIdx <= stars
                  ? 'bg-yellow-300 border-yellow-500 scale-110 shadow-md animate-bounce'
                  : 'bg-stone-200 border-stone-300 scale-95 opacity-50'
              }`}
            >
              <Star
                className={`w-7 h-7 ${
                  starIdx <= stars ? 'text-amber-700 fill-amber-500' : 'text-stone-400 fill-stone-300'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 gap-3 p-3.5 bg-white/90 rounded-2xl border border-lime-200 shadow-xs mb-4 text-xs">
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-700">Accuracy Score</span>
            <p className="text-lg font-black text-emerald-950">{score}%</p>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-700">Hold Duration</span>
            <p className="text-lg font-black text-emerald-950">{holdTime.toFixed(1)}s</p>
          </div>
        </div>

        {/* Unlocked Reward Badge Preview */}
        <div className="p-3 bg-gradient-to-r from-yellow-100 to-lime-100 rounded-2xl border border-yellow-300 mb-5 flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-2xl shadow-xs border border-yellow-200">
            {pose.rewardBadge.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase text-amber-900">Reward Badge Unlocked</p>
            <p className="text-xs font-black text-emerald-950 truncate">{pose.rewardBadge.title}</p>
          </div>
        </div>

        {/* Special Milestone 11 Trigger Button */}
        {isLevel11 && onOpenLevel11Celebration && (
          <button
            id="modal-open-level11-certificate-btn"
            onClick={onOpenLevel11Celebration}
            className="w-full py-3 mb-3 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-500 hover:to-amber-600 text-emerald-950 font-black text-sm shadow-md border-2 border-yellow-300 animate-pulse flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4 text-amber-900" />
            <span>Open Grand Master 11 Diploma & Rewards!</span>
          </button>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3">
          <button
            id="replay-level-btn"
            onClick={onReplayLevel}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-lime-50 text-emerald-900 border-2 border-emerald-200 font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay</span>
          </button>

          {hasNextLevel ? (
            <button
              id="next-level-btn"
              onClick={onNextLevel}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-lime-500 to-emerald-600 hover:from-lime-600 hover:to-emerald-700 text-white font-black text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-transform active:scale-95"
            >
              <span>Next Level</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="finish-journey-btn"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-emerald-950 font-black text-sm shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Journey</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
