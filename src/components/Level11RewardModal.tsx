import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Award, Sparkles, Trophy, Download, Printer, CheckCircle2, Star, X } from 'lucide-react';
import { playGrandMasterFanfare } from '../utils/audioEffects';
import { AgeGroup } from '../types/yoga';

interface Level11RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  ageGroup: AgeGroup;
  soundEnabled: boolean;
}

export const Level11RewardModal: React.FC<Level11RewardModalProps> = ({
  isOpen,
  onClose,
  playerName,
  ageGroup,
  soundEnabled,
}) => {
  const certificateRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (soundEnabled) {
        playGrandMasterFanfare();
      }

      // Spectacular Confetti blast in yellow and green colors
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        colors: ['#22c55e', '#eab308', '#84cc16', '#fef08a', '#10b981'],
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [isOpen, soundEnabled]);

  if (!isOpen) return null;

  const ageBracketTitle =
    ageGroup === 'sprouts'
      ? 'Little Sprouts Grand Master (Ages 2-6)'
      : ageGroup === 'juniors'
      ? 'Junior Yoga Legend (Ages 7-12)'
      : 'Cosmic Yogi Grand Master (Ages 13-20)';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="level-11-reward-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-amber-50 to-lime-50 rounded-3xl border-4 border-yellow-400 p-6 sm:p-8 shadow-2xl shadow-yellow-500/20 text-emerald-950 animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          id="close-reward-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-emerald-900 border border-emerald-200 transition-transform active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Milestone 11 Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-yellow-300 via-amber-300 to-lime-400 text-emerald-950 text-xs font-black uppercase tracking-widest rounded-full border-2 border-yellow-400 shadow-md animate-pulse">
            <Trophy className="w-4 h-4 text-amber-900 fill-amber-700" />
            <span>LEVEL 11 GRAND MILESTONE UNLOCKED!</span>
            <Sparkles className="w-4 h-4 text-amber-900 fill-amber-700" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
            🌟 Grand Master Yoga Champion! 🌟
          </h2>
          <p className="text-sm font-semibold text-emerald-800 max-w-lg mx-auto">
            Incredible balance, strength, and focus! You have conquered Level 11 (Warrior III Airplane Pose) and earned the highest yoga tier honors!
          </p>
        </div>

        {/* Unlocked Rewards Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-300 shadow-sm flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-200 to-amber-400 flex items-center justify-center text-2xl shadow-xs">
              🏆
            </div>
            <div>
              <p className="text-xs font-black text-amber-900 uppercase">Golden Trophy</p>
              <p className="text-xs font-bold text-emerald-950">Sky Falcon Relic</p>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border-2 border-lime-300 shadow-sm flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-200 to-emerald-400 flex items-center justify-center text-2xl shadow-xs">
              🪷
            </div>
            <div>
              <p className="text-xs font-black text-emerald-900 uppercase">Avatar Unlocked</p>
              <p className="text-xs font-bold text-emerald-950">Lotus Master</p>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border-2 border-yellow-300 shadow-sm flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-300 to-yellow-500 flex items-center justify-center text-2xl shadow-xs">
              ⭐
            </div>
            <div>
              <p className="text-xs font-black text-amber-900 uppercase">Perk Bonus</p>
              <p className="text-xs font-bold text-emerald-950">Golden Aura Glow</p>
            </div>
          </div>
        </div>

        {/* Printable / Downloadable Certificate */}
        <div
          ref={certificateRef}
          id="printable-grand-master-certificate"
          className="relative bg-white rounded-2xl p-6 border-4 border-dashed border-yellow-400 shadow-inner text-center space-y-3"
        >
          {/* Certificate Watermark Stamp */}
          <div className="absolute top-3 right-3 text-4xl opacity-20 select-none">
            🪷
          </div>

          <div className="flex items-center justify-center gap-2 text-amber-600 font-extrabold text-xs uppercase tracking-widest">
            <Award className="w-4 h-4" />
            <span>OFFICIAL YOGA EXCELLENCE DIPLOMA</span>
            <Award className="w-4 h-4" />
          </div>

          <h3 className="text-2xl font-black text-emerald-950 tracking-tight">
            Certificate of Supreme Yoga Mastery
          </h3>

          <p className="text-xs text-emerald-700 font-medium">This grand honor is proudly awarded to</p>

          <p className="text-3xl font-black text-amber-600 underline decoration-yellow-400 decoration-wavy py-1">
            {playerName || 'Supreme Yoga Master'}
          </p>

          <p className="text-xs text-emerald-800 font-semibold max-w-md mx-auto">
            for conquering <span className="font-bold text-emerald-950">Level 11 Warrior III (Airplane Pose)</span> with extraordinary balance, body awareness, and joyful determination.
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-emerald-100 text-xs font-bold text-emerald-900">
            <div>
              <p className="text-[10px] uppercase text-emerald-600 font-black">Bracket</p>
              <p>{ageBracketTitle}</p>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase text-emerald-600 font-black">Certified Date</p>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
          <button
            id="print-certificate-btn"
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white hover:bg-amber-50 text-emerald-950 border-2 border-emerald-200 font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Printer className="w-4 h-4 text-emerald-700" />
            <span>Print Diploma</span>
          </button>

          <button
            id="claim-level-11-rewards-btn"
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-lime-500 via-emerald-500 to-yellow-500 hover:from-lime-600 hover:to-yellow-600 text-white font-black text-base shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Claim Grand Master Rewards!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
