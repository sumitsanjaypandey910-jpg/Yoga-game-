import React from 'react';
import { Trophy, Award, Star, Flame, Sparkles, Clock, CheckCircle2, User } from 'lucide-react';
import { AVATAR_CHARACTERS, YOGA_POSES } from '../data/yogaPoses';
import { AgeGroup, UserProgress } from '../types/yoga';

interface RewardGalleryProps {
  userProgress: UserProgress;
  onSelectAvatar: (avatarId: string) => void;
  onOpenLevel11Diploma: () => void;
  onUpdatePlayerName: (name: string) => void;
  onUpdateAgeGroup: (ageGroup: AgeGroup) => void;
}

export const RewardGallery: React.FC<RewardGalleryProps> = ({
  userProgress,
  onSelectAvatar,
  onOpenLevel11Diploma,
  onUpdatePlayerName,
  onUpdateAgeGroup,
}) => {
  const totalStars = Object.values(userProgress.levelStars).reduce((a: number, b: number) => a + (b || 0), 0);
  const isLevel11Done = userProgress.completedLevels.includes(11);

  return (
    <div id="reward-gallery-section" className="space-y-6">
      {/* Player Profile & Stats Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-200 via-yellow-200 to-lime-300 border-2 border-yellow-400 shadow-xl text-emerald-950">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white border-4 border-yellow-400 flex items-center justify-center text-4xl shadow-md">
              {AVATAR_CHARACTERS.find((a) => a.id === userProgress.selectedAvatar)?.emoji || '🐼'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <input
                  id="player-name-input"
                  type="text"
                  value={userProgress.playerName}
                  onChange={(e) => onUpdatePlayerName(e.target.value)}
                  placeholder="Enter Student Name"
                  className="font-black text-2xl bg-white/70 hover:bg-white focus:bg-white px-3 py-1 rounded-xl border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-emerald-950 max-w-xs shadow-xs"
                />
              </div>
              <p className="text-xs font-bold text-emerald-800 mt-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>
                  {AVATAR_CHARACTERS.find((a) => a.id === userProgress.selectedAvatar)?.name} •{' '}
                  <span className="capitalize">{userProgress.ageGroup} Bracket</span>
                </span>
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <div className="p-3 bg-white/90 rounded-2xl border border-yellow-300 text-center shadow-xs">
              <div className="flex items-center justify-center gap-1 text-amber-500 font-black text-lg">
                <Star className="w-5 h-5 fill-amber-400" />
                <span>{totalStars}</span>
              </div>
              <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Stars Earned</span>
            </div>

            <div className="p-3 bg-white/90 rounded-2xl border border-yellow-300 text-center shadow-xs">
              <div className="flex items-center justify-center gap-1 text-emerald-600 font-black text-lg">
                <CheckCircle2 className="w-5 h-5" />
                <span>{userProgress.completedLevels.length}/12</span>
              </div>
              <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Poses Mastered</span>
            </div>

            <div className="p-3 bg-white/90 rounded-2xl border border-yellow-300 text-center shadow-xs">
              <div className="flex items-center justify-center gap-1 text-orange-500 font-black text-lg">
                <Flame className="w-5 h-5 fill-orange-400" />
                <span>{userProgress.currentStreak}</span>
              </div>
              <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Level 11 Grand Milestone Showcase Banner */}
      <div className={`p-6 rounded-3xl border-2 transition-all ${
        isLevel11Done
          ? 'bg-gradient-to-r from-yellow-100 via-amber-100 to-lime-100 border-yellow-400 shadow-xl shadow-yellow-500/10'
          : 'bg-stone-50 border-stone-200 opacity-80'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${
              isLevel11Done ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-white animate-bounce' : 'bg-stone-200 text-stone-400'
            }`}>
              🏆
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-amber-900 mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Level 11 Milestone Reward</span>
              </div>
              <h3 className="text-xl font-black text-emerald-950">
                Grand Master Yoga Diploma & Golden Trophy
              </h3>
              <p className="text-xs font-semibold text-emerald-800 max-w-md">
                {isLevel11Done
                  ? 'Congratulations! You unlocked the Grand Master certificate and the Golden Lotus celestial avatar.'
                  : 'Complete Level 11 (Warrior III Airplane Pose) to unlock this grand milestone certificate and reward suite!'}
              </p>
            </div>
          </div>

          <button
            id="view-diploma-btn"
            disabled={!isLevel11Done}
            onClick={onOpenLevel11Diploma}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-transform active:scale-95 ${
              isLevel11Done
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-emerald-950 shadow-md cursor-pointer'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{isLevel11Done ? 'Open Grand Diploma' : 'Complete Lvl 11 to Unlock'}</span>
          </button>
        </div>
      </div>

      {/* Unlockable Animal Avatar Buddies */}
      <div className="space-y-3">
        <h3 className="text-lg font-black text-emerald-950 flex items-center gap-2">
          <span>🐾 Unlockable Yoga Mascot Buddies</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {AVATAR_CHARACTERS.map((char) => {
            const isUnlocked = userProgress.completedLevels.length >= char.unlockedAtLevel - 1 || userProgress.completedLevels.includes(char.unlockedAtLevel);
            const isSelected = userProgress.selectedAvatar === char.id;

            return (
              <div
                key={char.id}
                id={`avatar-card-${char.id}`}
                onClick={() => isUnlocked && onSelectAvatar(char.id)}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-lime-50 shadow-md ring-2 ring-lime-400'
                    : isUnlocked
                    ? 'border-emerald-200 bg-white hover:border-lime-400 cursor-pointer shadow-xs'
                    : 'border-stone-200 bg-stone-100 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="text-3xl mb-1.5">{char.emoji}</div>
                <h4 className="font-extrabold text-xs text-emerald-950 line-clamp-1">{char.name}</h4>
                <span className="text-[10px] font-bold text-emerald-700 mt-0.5">{char.title}</span>

                <div className="mt-2 w-full">
                  {isSelected ? (
                    <span className="inline-block w-full py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-black">
                      Selected
                    </span>
                  ) : isUnlocked ? (
                    <span className="inline-block w-full py-0.5 rounded-md bg-lime-100 text-emerald-900 text-[10px] font-bold">
                      Choose
                    </span>
                  ) : (
                    <span className="inline-block w-full py-0.5 rounded-md bg-stone-200 text-stone-600 text-[10px] font-bold">
                      Lvl {char.unlockedAtLevel}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Collection Grid */}
      <div className="space-y-3">
        <h3 className="text-lg font-black text-emerald-950 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Yoga Pose Mastery Badges</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {YOGA_POSES.map((pose) => {
            const isEarned = userProgress.completedLevels.includes(pose.level);
            const badge = pose.rewardBadge;

            return (
              <div
                key={badge.id}
                id={`badge-card-${badge.id}`}
                className={`p-4 rounded-2xl border-2 flex items-start gap-3 transition-all ${
                  isEarned
                    ? 'border-yellow-300 bg-gradient-to-br from-white to-amber-50 shadow-sm'
                    : 'border-stone-200 bg-stone-100/60 opacity-60'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-xs ${
                  isEarned ? `bg-gradient-to-br ${badge.color} text-white` : 'bg-stone-200 text-stone-400'
                }`}>
                  {isEarned ? badge.icon : '🔒'}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-xs text-emerald-950 truncate">{badge.title}</h4>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                      Lvl {pose.level}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-emerald-900/80 mt-0.5 line-clamp-2 leading-tight">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
