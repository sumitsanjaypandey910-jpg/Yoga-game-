import React, { useState } from 'react';
import { YOGA_POSES } from '../data/yogaPoses';
import { AgeGroup, YogaPose } from '../types/yoga';
import { CameraPoseTracker } from './CameraPoseTracker';
import { PoseGuideCard } from './PoseGuideCard';
import { Sparkles, Compass, CheckCircle2, BookOpen, Maximize } from 'lucide-react';

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
  const [showDetailedGuide, setShowDetailedGuide] = useState<boolean>(false);
  const [isFullscreenPractice, setIsFullscreenPractice] = useState<boolean>(false);

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
              onClick={() => {
                setSelectedPose(pose);
                setIsFullscreenPractice(true);
              }}
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

      {/* Big Camera Sensor Stage with Corner Animated Guide */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-emerald-950 uppercase tracking-wider px-3 py-1.5 rounded-xl bg-lime-200 border border-lime-400">
              Active Pose: {selectedPose.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="toggle-fullscreen-practice-studio-btn"
              onClick={() => setIsFullscreenPractice(true)}
              className="px-3 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-emerald-950 border border-lime-500 text-xs font-black flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
              title="Open Fullscreen Camera Yoga with Corner Pose Guide"
            >
              <Maximize className="w-3.5 h-3.5" />
              <span>Fullscreen</span>
            </button>

            <button
              id="toggle-practice-guide-details-btn"
              onClick={() => setShowDetailedGuide(!showDetailedGuide)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-lime-50 text-emerald-900 border border-lime-300 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
              title="Toggle in-depth pose guide below camera"
            >
              <BookOpen className="w-3.5 h-3.5 text-lime-700" />
              <span>{showDetailedGuide ? 'Hide In-Depth Guide' : 'Pose Guide & Lore'}</span>
            </button>
          </div>
        </div>

        <div className="w-full">
          <CameraPoseTracker
            currentPose={selectedPose}
            ageGroup={ageGroup}
            soundEnabled={soundEnabled}
            voiceEnabled={voiceEnabled}
            onLevelComplete={handlePracticeComplete}
            comboStreak={practiceSuccessCount}
            isFullscreen={isFullscreenPractice}
            onExitFullscreen={() => setIsFullscreenPractice(false)}
            levelNumber={selectedPose.level}
            totalLevels={YOGA_POSES.length}
            onNextPose={() => {
              const currentIndex = YOGA_POSES.findIndex((p) => p.id === selectedPose.id);
              if (currentIndex < YOGA_POSES.length - 1) {
                setSelectedPose(YOGA_POSES[currentIndex + 1]);
              }
            }}
            onPrevPose={() => {
              const currentIndex = YOGA_POSES.findIndex((p) => p.id === selectedPose.id);
              if (currentIndex > 0) {
                setSelectedPose(YOGA_POSES[currentIndex - 1]);
              }
            }}
          />
        </div>

        {/* Optional In-Depth Pose Guide Card Below Camera */}
        {showDetailedGuide && (
          <div className="pt-2 animate-in fade-in slide-in-from-top-3 duration-200">
            <PoseGuideCard
              pose={selectedPose}
              ageGroup={ageGroup}
              soundEnabled={soundEnabled}
              voiceEnabled={voiceEnabled}
            />
          </div>
        )}
      </div>
    </div>
  );
};
