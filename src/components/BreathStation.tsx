import React, { useState, useEffect } from 'react';
import { Wind, Play, Pause, Volume2, Sparkles, Heart } from 'lucide-react';
import { playSingingBowlSound } from '../utils/audioEffects';

export const BreathStation: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Switch phase
          setPhase((currPhase) => {
            if (currPhase === 'inhale') {
              return 'hold';
            } else if (currPhase === 'hold') {
              return 'exhale';
            } else if (currPhase === 'exhale') {
              return 'rest';
            } else {
              setCyclesCompleted((c) => c + 1);
              return 'inhale';
            }
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const toggleBreath = () => {
    if (!isActive) {
      playSingingBowlSound();
    }
    setIsActive(!isActive);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return { title: 'Breathe In Deeply', desc: 'Fill your lungs with fresh yellow-green sunshine energy 🌿', color: 'from-lime-400 to-emerald-500', scale: 'scale-125' };
      case 'hold':
        return { title: 'Hold & Savor the Stillness', desc: 'Feel peace and balance in your heart 💛', color: 'from-yellow-300 to-amber-400', scale: 'scale-125' };
      case 'exhale':
        return { title: 'Slowly Exhale & Release', desc: 'Blow away all tiredness like soft flower petals 🪷', color: 'from-emerald-400 to-teal-500', scale: 'scale-90' };
      case 'rest':
        return { title: 'Rest & Smile', desc: 'Enjoy the calm quiet moment...', color: 'from-amber-200 to-lime-200', scale: 'scale-100' };
    }
  };

  const currentInfo = getPhaseText();

  return (
    <div id="breath-station-card" className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white to-lime-50/60 border-2 border-lime-300 shadow-xl flex flex-col items-center text-center space-y-6">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-lime-100 text-emerald-900 text-xs font-black uppercase tracking-wider rounded-full border border-lime-300">
          <Wind className="w-3.5 h-3.5 text-emerald-600" />
          <span>Mindful Breath Oasis</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
          Paced Breath & Zen Relaxation
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-emerald-800 max-w-md mx-auto">
          Warm up before your yoga adventure or relax after your workout to restore your energy and focus!
        </p>
      </div>

      {/* Animated Lotus Breathing Orb */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer Aura Ring */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${currentInfo.color} opacity-25 blur-xl transition-all duration-1000 ${
            isActive ? currentInfo.scale : 'scale-100'
          }`}
        />

        {/* Mid Ring */}
        <div
          className={`w-48 h-48 rounded-full border-4 border-lime-400/80 bg-gradient-to-br ${currentInfo.color} flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-1000 ${
            isActive ? currentInfo.scale : 'scale-100'
          }`}
        >
          <div className="text-4xl select-none animate-pulse">🪷</div>
          <span className="text-3xl font-black mt-1 drop-shadow-md">{isActive ? countdown : '4'}</span>
          <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-black/20 rounded-full mt-0.5">
            {isActive ? phase : 'Ready'}
          </span>
        </div>
      </div>

      {/* Dynamic Phase Guidance */}
      <div className="space-y-1 max-w-sm">
        <h3 className="text-lg font-black text-emerald-950">{isActive ? currentInfo.title : 'Ready to begin?'}</h3>
        <p className="text-xs font-semibold text-emerald-700">{isActive ? currentInfo.desc : 'Click Start to begin 4-count calming box breath.'}</p>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-3">
        <button
          id="toggle-breath-timer-btn"
          onClick={toggleBreath}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-lime-500 to-emerald-600 hover:from-lime-600 hover:to-emerald-700 text-white font-black text-sm shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-transform active:scale-95"
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause Breath</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Start Mindful Breath</span>
            </>
          )}
        </button>

        <button
          id="play-singing-bowl-btn"
          onClick={playSingingBowlSound}
          title="Play Zen Singing Bowl Sound"
          className="p-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 shadow-xs transition-transform active:scale-95"
        >
          <Volume2 className="w-5 h-5 text-amber-700" />
        </button>
      </div>

      {cyclesCompleted > 0 && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full border border-emerald-300">
          <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-200" />
          <span>{cyclesCompleted} Mindful Cycles Completed</span>
        </div>
      )}
    </div>
  );
};
