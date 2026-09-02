import React, { useState } from 'react';
import { Volume2, Sparkles, Heart, Activity, Check, Play, Image as ImageIcon, Video } from 'lucide-react';
import { AgeGroup, YogaPose } from '../types/yoga';
import { PoseIllustration } from './PoseIllustrations';
import { AnimatedPoseVideo } from './AnimatedPoseVideo';
import { speakGuidePhrase } from '../utils/audioEffects';

interface PoseGuideCardProps {
  pose: YogaPose;
  ageGroup: AgeGroup;
  soundEnabled: boolean;
  voiceEnabled?: boolean;
}

export const PoseGuideCard: React.FC<PoseGuideCardProps> = ({
  pose,
  ageGroup,
  soundEnabled,
  voiceEnabled = true,
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'blueprint'>('video');

  const handleReadAloud = () => {
    const textToSpeak = ageGroup === 'sprouts'
      ? `${pose.animalAlias}! ${pose.kidFriendlyGuide}`
      : `${pose.name}. ${pose.teenFocus}. Key tip: ${pose.keyTips[0]}`;
    speakGuidePhrase(textToSpeak, true);
  };

  return (
    <div id="pose-guide-card" className="bg-white rounded-3xl border-2 border-lime-300 p-4 sm:p-5 shadow-lg shadow-emerald-900/5 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-yellow-100 to-lime-100 text-emerald-900 text-xs font-black uppercase tracking-wider rounded-full border border-lime-200 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-300" />
              <span>Level {pose.level} Pose Guide</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 flex items-center gap-2">
              {pose.name}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-emerald-700 italic">
              {pose.sanskritName} • <span className="text-amber-700 not-italic font-bold">{pose.animalAlias}</span>
            </p>
          </div>

          <button
            id="speak-pose-instructions-btn"
            onClick={handleReadAloud}
            title="Read instructions aloud"
            className="p-2 sm:p-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 shadow-sm transition-transform active:scale-95 flex items-center gap-1 shrink-0"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
            <span className="text-xs font-bold hidden sm:inline">Listen</span>
          </button>
        </div>

        {/* View Mode Toggle Switcher: Animated Video vs Static Blueprint */}
        <div className="flex items-center gap-2 my-3 p-1 rounded-2xl bg-lime-100/80 border border-lime-300">
          <button
            id="tab-animated-video-btn"
            onClick={() => setActiveTab('video')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'video'
                ? 'bg-gradient-to-r from-lime-400 to-yellow-300 text-emerald-950 shadow-sm'
                : 'text-emerald-900 hover:bg-white/50'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-emerald-900" />
            <span>🎬 Animated Video Demo</span>
          </button>

          <button
            id="tab-blueprint-guide-btn"
            onClick={() => setActiveTab('blueprint')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'blueprint'
                ? 'bg-gradient-to-r from-lime-400 to-yellow-300 text-emerald-950 shadow-sm'
                : 'text-emerald-900 hover:bg-white/50'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-900" />
            <span>🖼️ Static Alignment Art</span>
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'video' ? (
          <div className="mb-3">
            <AnimatedPoseVideo
              pose={pose}
              ageGroup={ageGroup}
              soundEnabled={soundEnabled}
              voiceEnabled={voiceEnabled}
            />
          </div>
        ) : (
          <div className="relative my-3 p-4 rounded-2xl bg-gradient-to-b from-amber-50/80 to-lime-50/80 border border-emerald-100 flex items-center justify-center overflow-hidden h-52">
            <PoseIllustration type={pose.svgPoseType} className="max-h-full max-w-full drop-shadow-sm" />
            
            <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-emerald-800 border border-emerald-200 shadow-xs flex items-center gap-1">
              <span>⏱️ Hold: {pose.holdSeconds[ageGroup]}s</span>
            </div>

            <div className="absolute top-2 right-2 px-2.5 py-1 bg-yellow-100/90 rounded-lg text-xs font-bold text-amber-900 border border-amber-200 shadow-xs">
              <span>{pose.rewardBadge.icon} {pose.rewardBadge.title}</span>
            </div>
          </div>
        )}

        {/* Dynamic Age-Tailored Guide */}
        <div className="p-3.5 bg-lime-50/80 rounded-2xl border border-lime-200 mb-3 text-emerald-950 text-xs sm:text-sm">
          <p className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
            <span>✨ {ageGroup === 'sprouts' ? 'Animal Adventure Tip:' : ageGroup === 'juniors' ? 'Pose Mission:' : 'Form Precision Focus:'}</span>
          </p>
          <p className="leading-relaxed font-medium">
            {ageGroup === 'sprouts' ? pose.kidFriendlyGuide : pose.teenFocus}
          </p>
        </div>

        {/* Checklist Tips */}
        <div className="space-y-1.5 mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-lime-600" /> Alignment Checklist:
          </p>
          {pose.keyTips.map((tip, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs font-medium text-emerald-900 bg-white p-1.5 rounded-lg border border-emerald-100">
              <span className="w-4 h-4 rounded-full bg-lime-100 text-lime-800 text-[10px] font-black flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Footer */}
      <div className="pt-2.5 border-t border-emerald-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
        <div className="flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />
          <span>{pose.benefits[0]}</span>
        </div>
        <div className="flex items-center gap-1 text-amber-700">
          <Activity className="w-3.5 h-3.5" />
          <span>{pose.category.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};
