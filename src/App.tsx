import React, { useState, useEffect } from 'react';
import { YOGA_POSES, AVATAR_CHARACTERS } from './data/yogaPoses';
import { AgeGroup, UserProgress, YogaPose } from './types/yoga';
import { Header } from './components/Header';
import { CameraPoseTracker } from './components/CameraPoseTracker';
import { PoseGuideCard } from './components/PoseGuideCard';
import { LevelSelector } from './components/LevelSelector';
import { LevelSuccessModal } from './components/LevelSuccessModal';
import { Level11RewardModal } from './components/Level11RewardModal';
import { RewardGallery } from './components/RewardGallery';
import { PracticeStudio } from './components/PracticeStudio';
import { BreathStation } from './components/BreathStation';
import { Trophy, Sparkles, Star, ChevronLeft, ChevronRight, Award, Play } from 'lucide-react';

const STORAGE_KEY = 'zenquest_yoga_progress_v2';

const INITIAL_PROGRESS: UserProgress = {
  playerName: 'Little Yogi',
  ageGroup: 'juniors',
  completedLevels: [],
  levelStars: {},
  levelHighScores: {},
  unlockedBadges: [],
  unlockedAvatars: ['zen-panda', 'sunny-bunny'],
  selectedAvatar: 'zen-panda',
  totalHoldSeconds: 0,
  totalSessions: 1,
  currentStreak: 1,
  soundEnabled: true,
  voiceEnabled: true,
  level11RewardClaimed: false,
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<'adventure' | 'practice' | 'breath' | 'rewards'>('adventure');
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return { ...INITIAL_PROGRESS, ...JSON.parse(saved) };
        } catch (e) {
          console.debug('Failed to parse saved progress', e);
        }
      }
    }
    return INITIAL_PROGRESS;
  });

  // Modals state
  const [successModalState, setSuccessModalState] = useState<{
    isOpen: boolean;
    stars: number;
    score: number;
    holdTime: number;
    pose: YogaPose | null;
  }>({
    isOpen: false,
    stars: 0,
    score: 0,
    holdTime: 0,
    pose: null,
  });

  const [showLevel11Modal, setShowLevel11Modal] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
    }
  }, [userProgress]);

  const activePose = YOGA_POSES.find((p) => p.level === currentLevel) || YOGA_POSES[0];

  // Level Completion Handler
  const handleLevelComplete = (stars: number, score: number, holdTime: number) => {
    setUserProgress((prev) => {
      const completed = Array.from(new Set([...prev.completedLevels, currentLevel]));
      const existingStars = prev.levelStars[currentLevel] || 0;
      const updatedStars = {
        ...prev.levelStars,
        [currentLevel]: Math.max(existingStars, stars),
      };
      const existingScore = prev.levelHighScores[currentLevel] || 0;
      const updatedScores = {
        ...prev.levelHighScores,
        [currentLevel]: Math.max(existingScore, score),
      };

      const newBadge = activePose.rewardBadge.id;
      const updatedBadges = Array.from(new Set([...prev.unlockedBadges, newBadge]));

      // Check for unlockable avatars
      let updatedAvatars = [...prev.unlockedAvatars];
      if (currentLevel >= 3 && !updatedAvatars.includes('forest-frog')) updatedAvatars.push('forest-frog');
      if (currentLevel >= 6 && !updatedAvatars.includes('golden-tiger')) updatedAvatars.push('golden-tiger');
      if (currentLevel >= 9 && !updatedAvatars.includes('cosmic-dragon')) updatedAvatars.push('cosmic-dragon');
      if (currentLevel >= 11 && !updatedAvatars.includes('golden-lotus')) updatedAvatars.push('golden-lotus');

      return {
        ...prev,
        completedLevels: completed,
        levelStars: updatedStars,
        levelHighScores: updatedScores,
        unlockedBadges: updatedBadges,
        unlockedAvatars: updatedAvatars,
        totalHoldSeconds: prev.totalHoldSeconds + holdTime,
        currentStreak: prev.currentStreak + 1,
        level11RewardClaimed: currentLevel === 11 ? true : prev.level11RewardClaimed,
      };
    });

    setSuccessModalState({
      isOpen: true,
      stars,
      score,
      holdTime,
      pose: activePose,
    });

    // If completed Level 11, trigger grand milestone celebration
    if (currentLevel === 11) {
      setTimeout(() => {
        setShowLevel11Modal(true);
      }, 900);
    }
  };

  const handleNextLevel = () => {
    setSuccessModalState((prev) => ({ ...prev, isOpen: false }));
    if (currentLevel < 12) {
      setCurrentLevel((lvl) => lvl + 1);
    }
  };

  const handleReplayLevel = () => {
    setSuccessModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSelectLevel = (level: number) => {
    setCurrentLevel(level);
    setCurrentTab('adventure');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAvatar = (avatarId: string) => {
    setUserProgress((prev) => ({ ...prev, selectedAvatar: avatarId }));
  };

  const handleUpdatePlayerName = (name: string) => {
    setUserProgress((prev) => ({ ...prev, playerName: name }));
  };

  const handleUpdateAgeGroup = (ageGroup: AgeGroup) => {
    setUserProgress((prev) => ({ ...prev, ageGroup }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-lime-50/40 to-emerald-50/30 text-emerald-950 flex flex-col justify-between">
      {/* Top Navigation & Controls */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        ageGroup={userProgress.ageGroup}
        onSelectAgeGroup={handleUpdateAgeGroup}
        soundEnabled={userProgress.soundEnabled}
        onToggleSound={() => setUserProgress((p) => ({ ...p, soundEnabled: !p.soundEnabled }))}
        voiceEnabled={userProgress.voiceEnabled}
        onToggleVoice={() => setUserProgress((p) => ({ ...p, voiceEnabled: !p.voiceEnabled }))}
        userProgress={userProgress}
        onOpenLevel11Diploma={() => setShowLevel11Modal(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 py-6 flex-1">
        {/* Tab 1: Adventure Quest Mode */}
        {currentTab === 'adventure' && (
          <div className="space-y-8">
            {/* Level 11 Callout Banner if approaching or completed */}
            {currentLevel === 11 && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-300 via-amber-300 to-lime-300 border-2 border-yellow-400 shadow-md flex items-center justify-between gap-3 text-emerald-950 animate-pulse">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🌟</span>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-wide">GRAND MILESTONE: LEVEL 11</h3>
                    <p className="text-xs font-bold text-emerald-900">Hold Warrior III Airplane Pose to unlock the Grand Master Trophy & Diploma!</p>
                  </div>
                </div>
                <Trophy className="w-6 h-6 text-amber-900 fill-amber-300 shrink-0" />
              </div>
            )}

            {/* Active Stage & Pose Card Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Camera Sensor Stage */}
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      id="prev-level-btn"
                      disabled={currentLevel <= 1}
                      onClick={() => setCurrentLevel((l) => Math.max(1, l - 1))}
                      className="p-2 rounded-xl bg-white hover:bg-lime-100 disabled:opacity-40 disabled:cursor-not-allowed border border-lime-300 text-emerald-950 shadow-xs transition-transform active:scale-95"
                      title="Previous Level"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <span className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-yellow-200 to-lime-300 border border-lime-400 font-black text-xs text-emerald-950 shadow-xs">
                      Level {currentLevel} of 12
                    </span>

                    <button
                      id="next-level-top-btn"
                      disabled={currentLevel >= 12 || (!userProgress.completedLevels.includes(currentLevel) && currentLevel !== 1)}
                      onClick={() => setCurrentLevel((l) => Math.min(12, l + 1))}
                      className="p-2 rounded-xl bg-white hover:bg-lime-100 disabled:opacity-40 disabled:cursor-not-allowed border border-lime-300 text-emerald-950 shadow-xs transition-transform active:scale-95"
                      title="Next Level"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900 bg-amber-100/90 px-3 py-1.5 rounded-xl border border-amber-300">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span>Stars: {userProgress.levelStars[currentLevel] || 0}/3</span>
                  </div>
                </div>

                <CameraPoseTracker
                  currentPose={activePose}
                  ageGroup={userProgress.ageGroup}
                  soundEnabled={userProgress.soundEnabled}
                  voiceEnabled={userProgress.voiceEnabled}
                  onLevelComplete={handleLevelComplete}
                  comboStreak={userProgress.currentStreak}
                />
              </div>

              {/* Target Pose Guide Card */}
              <div className="lg:col-span-4">
                <PoseGuideCard
                  pose={activePose}
                  ageGroup={userProgress.ageGroup}
                  soundEnabled={userProgress.soundEnabled}
                  voiceEnabled={userProgress.voiceEnabled}
                />
              </div>
            </div>

            {/* Level Quest Map at Bottom of Adventure view */}
            <div className="pt-4 border-t-2 border-lime-200">
              <LevelSelector
                poses={YOGA_POSES}
                completedLevels={userProgress.completedLevels}
                levelStars={userProgress.levelStars}
                currentLevel={currentLevel}
                onSelectLevel={handleSelectLevel}
                ageGroup={userProgress.ageGroup}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Free Practice Studio */}
        {currentTab === 'practice' && (
          <PracticeStudio
            ageGroup={userProgress.ageGroup}
            soundEnabled={userProgress.soundEnabled}
            voiceEnabled={userProgress.voiceEnabled}
          />
        )}

        {/* Tab 3: Mindful Breath Oasis */}
        {currentTab === 'breath' && <BreathStation />}

        {/* Tab 4: Rewards & Trophy Showcase */}
        {currentTab === 'rewards' && (
          <RewardGallery
            userProgress={userProgress}
            onSelectAvatar={handleSelectAvatar}
            onOpenLevel11Diploma={() => setShowLevel11Modal(true)}
            onUpdatePlayerName={handleUpdatePlayerName}
            onUpdateAgeGroup={handleUpdateAgeGroup}
          />
        )}
      </main>

      {/* Level Success Celebration Modal */}
      {successModalState.pose && (
        <LevelSuccessModal
          isOpen={successModalState.isOpen}
          onClose={() => setSuccessModalState((p) => ({ ...p, isOpen: false }))}
          pose={successModalState.pose}
          stars={successModalState.stars}
          score={successModalState.score}
          holdTime={successModalState.holdTime}
          onNextLevel={handleNextLevel}
          onReplayLevel={handleReplayLevel}
          onOpenLevel11Celebration={() => {
            setSuccessModalState((p) => ({ ...p, isOpen: false }));
            setShowLevel11Modal(true);
          }}
          hasNextLevel={currentLevel < 12}
        />
      )}

      {/* Special Level 11 Milestone Grand Master Diploma Modal */}
      <Level11RewardModal
        isOpen={showLevel11Modal}
        onClose={() => setShowLevel11Modal(false)}
        playerName={userProgress.playerName}
        ageGroup={userProgress.ageGroup}
        soundEnabled={userProgress.soundEnabled}
      />

      {/* Footer */}
      <footer className="mt-8 border-t border-lime-200/80 bg-white/70 py-4 text-center text-xs font-semibold text-emerald-900/70">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🌿 ZenQuest AI Yoga Game • Designed for youth & children (ages 2 to 20)</span>
          <span className="text-amber-800 font-bold">✨ Yellow-Green Solar Vitality Theme</span>
        </div>
      </footer>
    </div>
  );
}
