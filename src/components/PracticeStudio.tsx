import React, { useState } from 'react';
import { YOGA_POSES } from '../data/yogaPoses';
import { AgeGroup, YogaPose } from '../types/yoga';
import { CameraPoseTracker } from './CameraPoseTracker';
import { PoseGuideCard } from './PoseGuideCard';
import { Sparkles, Compass, CheckCircle2 } from 'lucide-react';

interface PracticeStudioProps {
  ageGroup: AgeGroup;
  soundEnabled: boolean;
  voiceEnabled: boolean;
}

export const PracticeStudio: React.FC<PracticeStudioProps> = ({
  ageGroup,
  soundEnabled,
  voiceEnabled,
}) => {
  const [selectedPose, setSelectedPose] = useState<YogaPose>(YOGA_POSES[0]);
  const [practiceSuccessCount, setPracticeSuccessCount] = useState<number>(0);
  const [lastPracticeMessage, setLastPracticeMessage] = useState<string>('');

  const handlePracticeComplete = (stars: number, score: number, holdTime: number) => {
    setPracticeSuccessCount((prev) => prev + 1);
    setLastPracticeMessage(`🎉 Awesome! You mastered ${selectedPose.name} (${score}% accuracy, ${holdTime.toFixed(1)}s hold)!`);
  };

  return (
    <div id="practice-studio-section" className="space-y-6">
      {/* Studio Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-lime-200 via-yellow-100 to-emerald-200 border-2 border-lime-400 shadow-md text-emerald-950 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 rounded-full text-xs font-black uppercase tracking-wider text-emerald-900 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-lime-700" />
            <span>Freestyle Pose Lab & Biofeedback</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Free Practice Studio
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-emerald-900/90 max-w-xl">
            Pick any yoga pose freely to practice alignment, balance, and breathing at your own pace without game timers or level locks.
          </p>
        </div>

        {practiceSuccessCount > 0 && (
          <div className="flex items-center gap-2 bg-white/90 px-4 py-2.5 rounded-2xl border border-lime-300 shadow-xs text-xs font-bold text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{practiceSuccessCount} Poses Completed in this Session!</span>
          </div>
        )}
      </div>

      {/* Pose Carousel / Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {YOGA_POSES.map((pose) => {
          const isSelected = selectedPose.id === pose.id;
          return (
            <button
              key={pose.id}
              id={`select-practice-pose-${pose.id}`}
              onClick={() => setSelectedPose(pose)}
              className={`px-3.5 py-2 rounded-2xl font-bold text-xs shrink-0 flex items-center gap-2 border-2 transition-all active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-r from-lime-400 to-yellow-300 border-emerald-600 text-emerald-950 shadow-md scale-105'
                  : 'bg-white hover:bg-lime-50 border-emerald-200 text-emerald-900'
              }`}
            >
              <span>{pose.animalAlias.split(' ')[0]}</span>
              <span className="font-extrabold">{pose.name.split('/')[0]}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-100/80 text-emerald-800">
                Lvl {pose.level}
              </span>
            </button>
          );
        })}
      </div>

      {lastPracticeMessage && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-900 text-center animate-bounce">
          {lastPracticeMessage}
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Live Camera Sensor */}
        <div className="lg:col-span-8">
          <CameraPoseTracker
            currentPose={selectedPose}
            ageGroup={ageGroup}
            soundEnabled={soundEnabled}
            voiceEnabled={voiceEnabled}
            onLevelComplete={handlePracticeComplete}
            comboStreak={practiceSuccessCount}
          />
        </div>

        {/* Pose Guide Card */}
        <div className="lg:col-span-4">
          <PoseGuideCard
            pose={selectedPose}
            ageGroup={ageGroup}
            soundEnabled={soundEnabled}
          />
        </div>
      </div>
    </div>
  );
};
