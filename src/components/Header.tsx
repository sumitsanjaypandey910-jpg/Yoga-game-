import React from 'react';
import { Volume2, VolumeX, Mic, MicOff, Trophy, Sparkles, Compass, Wind, Gamepad2, Award } from 'lucide-react';
import { AgeGroup, UserProgress } from '../types/yoga';
import { AVATAR_CHARACTERS } from '../data/yogaPoses';

interface HeaderProps {
  currentTab: 'adventure' | 'practice' | 'breath' | 'rewards';
  onSelectTab: (tab: 'adventure' | 'practice' | 'breath' | 'rewards') => void;
  ageGroup: AgeGroup;
  onSelectAgeGroup: (age: AgeGroup) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  userProgress: UserProgress;
  onOpenLevel11Diploma: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  ageGroup,
  onSelectAgeGroup,
  soundEnabled,
  onToggleSound,
  voiceEnabled,
  onToggleVoice,
  userProgress,
  onOpenLevel11Diploma,
}) => {
  const currentAvatar = AVATAR_CHARACTERS.find((a) => a.id === userProgress.selectedAvatar) || AVATAR_CHARACTERS[0];
  const isLevel11Completed = userProgress.completedLevels.includes(11);

  return (
    <header className="sticky top-0 z-40 bg-amber-50/90 backdrop-blur-md border-b-2 border-lime-300 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Avatar */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-yellow-300 via-lime-400 to-emerald-500 border-2 border-lime-400 flex items-center justify-center text-2xl shadow-md shadow-emerald-950/10">
              🌿
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-xl tracking-tight text-emerald-950">
                  ZenQuest
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-lime-200 text-emerald-900 text-[10px] font-black uppercase tracking-wider border border-lime-300">
                  AI Yoga Game
                </span>
              </div>
              <p className="text-[11px] font-bold text-emerald-700">
                Ages 2–20 Interactive Motion Studio
              </p>
            </div>
          </div>

          {/* Mobile Avatar pill */}
          <button
            onClick={() => onSelectTab('rewards')}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border border-lime-300 shadow-xs text-xs font-bold text-emerald-950"
          >
            <span>{currentAvatar.emoji}</span>
            <span className="truncate max-w-[80px]">{userProgress.playerName || 'Yogi'}</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 p-1 bg-lime-100/90 rounded-2xl border border-lime-300">
          <button
            id="tab-adventure-btn"
            onClick={() => onSelectTab('adventure')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              currentTab === 'adventure'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-900 hover:bg-lime-200/60'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Adventure Quest</span>
          </button>

          <button
            id="tab-practice-btn"
            onClick={() => onSelectTab('practice')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              currentTab === 'practice'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-900 hover:bg-lime-200/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Free Practice</span>
          </button>

          <button
            id="tab-breath-btn"
            onClick={() => onSelectTab('breath')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              currentTab === 'breath'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-900 hover:bg-lime-200/60'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Mindful Breath</span>
          </button>

          <button
            id="tab-rewards-btn"
            onClick={() => onSelectTab('rewards')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              currentTab === 'rewards'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-amber-950 hover:bg-yellow-200/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Trophy Room</span>
          </button>
        </nav>

        {/* Right Controls: Age Brackets & Audio toggles */}
        <div className="flex items-center gap-2">
          {/* Age Bracket Selector */}
          <div className="flex items-center p-0.5 bg-white rounded-2xl border border-lime-300 shadow-xs">
            <button
              id="age-sprouts-btn"
              onClick={() => onSelectAgeGroup('sprouts')}
              title="Ages 2-6: Animal Yoga & Gentle Hold"
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
                ageGroup === 'sprouts'
                  ? 'bg-lime-400 text-emerald-950 shadow-xs'
                  : 'text-emerald-800 hover:bg-lime-50'
              }`}
            >
              🌱 2–6
            </button>
            <button
              id="age-juniors-btn"
              onClick={() => onSelectAgeGroup('juniors')}
              title="Ages 7-12: Adventure Poses & Active Stamina"
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
                ageGroup === 'juniors'
                  ? 'bg-yellow-400 text-amber-950 shadow-xs'
                  : 'text-emerald-800 hover:bg-yellow-50'
              }`}
            >
              🦁 7–12
            </button>
            <button
              id="age-masters-btn"
              onClick={() => onSelectAgeGroup('masters')}
              title="Ages 13-20: Precision Alignment & Pro Flow"
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
                ageGroup === 'masters'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              🧘 13–20
            </button>
          </div>

          {/* Sound Effect Toggle */}
          <button
            id="toggle-sound-btn"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-lime-200 text-emerald-900 border-lime-400'
                : 'bg-stone-200 text-stone-600 border-stone-300'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Voice Coach Toggle */}
          <button
            id="toggle-voice-btn"
            onClick={onToggleVoice}
            title={voiceEnabled ? 'Mute Spoken Coach' : 'Enable Spoken Coach Voice'}
            className={`p-2 rounded-xl border transition-all ${
              voiceEnabled
                ? 'bg-amber-200 text-amber-950 border-amber-400'
                : 'bg-stone-200 text-stone-600 border-stone-300'
            }`}
          >
            {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Level 11 Trophy Badge Button */}
          {isLevel11Completed && (
            <button
              id="open-top-level11-diploma-btn"
              onClick={onOpenLevel11Diploma}
              title="Open Grand Master Level 11 Diploma"
              className="p-1.5 rounded-xl bg-gradient-to-r from-yellow-300 to-amber-400 border border-yellow-500 shadow-xs animate-bounce"
            >
              <Trophy className="w-5 h-5 text-amber-900 fill-amber-300" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
