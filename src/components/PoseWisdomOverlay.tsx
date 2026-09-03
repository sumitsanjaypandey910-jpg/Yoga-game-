import React, { useState } from 'react';
import { Sparkles, Volume2, ChevronRight, ChevronLeft, Video, Image as ImageIcon, Eye, Play, Pause, X, BookOpen, Star, Flame, Lightbulb } from 'lucide-react';
import { AgeGroup, YogaPose } from '../types/yoga';
import { PoseIllustration } from './PoseIllustrations';
import { AnimatedPoseVideo } from './AnimatedPoseVideo';
import { speakGuidePhrase } from '../utils/audioEffects';

interface PoseWisdomOverlayProps {
  pose: YogaPose;
  ageGroup: AgeGroup;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  className?: string;
}

export const PoseWisdomOverlay: React.FC<PoseWisdomOverlayProps> = ({
  pose,
  ageGroup,
  soundEnabled,
  voiceEnabled,
  className = '',
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'art' | 'video'>('art');

  const wisdomText = ageGroup === 'sprouts'
    ? pose.kidFriendlyGuide
    : `Focus: ${pose.teenFocus}. Key wisdom: ${pose.keyTips[0] || 'Maintain steady natural breath and elongate spine.'}`;

  const handleSpeakWisdom = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phrase = `${pose.name}, also known as ${pose.animalAlias}. ${wisdomText}`;
    speakGuidePhrase(phrase, true);
  };

  // If minimized, show an elegant compact pill on the right side
  if (isMinimized) {
    return (
      <div className={`absolute top-14 sm:top-16 right-2 sm:right-4 z-30 ${className}`}>
        <button
          id="expand-pose-wisdom-btn"
          onClick={() => setIsMinimized(false)}
          className="group flex items-center gap-2 px-3 py-2 rounded-2xl bg-stone-950/90 hover:bg-stone-900 border-2 border-lime-400 shadow-2xl backdrop-blur-md text-white transition-all transform hover:scale-105 active:scale-95"
          title="Open Pose Wisdom Window"
        >
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-yellow-400 to-lime-400 flex items-center justify-center text-emerald-950 font-black shrink-0 shadow-sm">
            <Lightbulb className="w-4 h-4 fill-emerald-950" />
          </div>
          <div className="text-left pr-1">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-lime-300">Pose Wisdom</span>
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
            </div>
            <p className="text-xs font-black text-white truncate max-w-[130px]">{pose.name.split('/')[0]}</p>
          </div>
          <ChevronLeft className="w-4 h-4 text-lime-300 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div
      id="pose-wisdom-overlay"
      className={`absolute top-14 sm:top-16 right-2 sm:right-4 z-30 w-60 sm:w-68 md:w-72 max-h-[calc(100%-80px)] overflow-y-auto scrollbar-none rounded-3xl bg-stone-950/90 backdrop-blur-md border-2 border-lime-400 shadow-2xl shadow-black/60 text-white flex flex-col p-2.5 sm:p-3 transition-all animate-in fade-in slide-in-from-right-4 duration-200 pointer-events-auto ${className}`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-yellow-400 to-lime-400 flex items-center justify-center text-emerald-950 font-black shadow-xs shrink-0">
            <Lightbulb className="w-3.5 h-3.5 fill-emerald-950" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-lime-300">Pose Wisdom</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-800/80 text-lime-200 font-bold">Lvl {pose.level}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Audio Wisdom button */}
          <button
            id="wisdom-speak-btn"
            onClick={handleSpeakWisdom}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-yellow-300 border border-white/10 transition-transform active:scale-90"
            title="Listen to Pose Wisdom"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>

          {/* Minimize button */}
          <button
            id="minimize-pose-wisdom-btn"
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white border border-white/10 transition-transform active:scale-90"
            title="Minimize Wisdom Window"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mode Switcher: Cartoon Art vs Animated Video */}
      <div className="flex items-center gap-1 p-0.5 my-2 rounded-xl bg-white/10 border border-white/10 text-[10px] font-bold">
        <button
          id="wisdom-view-art-btn"
          onClick={() => setViewMode('art')}
          className={`flex-1 py-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
            viewMode === 'art'
              ? 'bg-gradient-to-r from-lime-400 to-yellow-300 text-emerald-950 font-black shadow-xs'
              : 'text-stone-300 hover:text-white'
          }`}
        >
          <ImageIcon className="w-3 h-3" />
          <span>🖼️ Cartoon Art</span>
        </button>

        <button
          id="wisdom-view-video-btn"
          onClick={() => setViewMode('video')}
          className={`flex-1 py-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
            viewMode === 'video'
              ? 'bg-gradient-to-r from-lime-400 to-yellow-300 text-emerald-950 font-black shadow-xs'
              : 'text-stone-300 hover:text-white'
          }`}
        >
          <Video className="w-3 h-3" />
          <span>🎬 Motion Demo</span>
        </button>
      </div>

      {/* Visual Window: Cartoon Yoga Pose (Art or Video) */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-lime-400/40 bg-gradient-to-b from-teal-950/70 via-emerald-900/40 to-stone-900 shadow-inner flex items-center justify-center">
        {viewMode === 'art' ? (
          <div className="w-full h-36 sm:h-40 p-2 flex items-center justify-center">
            <PoseIllustration
              type={pose.svgPoseType}
              className="w-full h-full max-h-36 drop-shadow-md"
            />
          </div>
        ) : (
          <div className="w-full">
            <AnimatedPoseVideo
              pose={pose}
              ageGroup={ageGroup}
              soundEnabled={soundEnabled}
              voiceEnabled={voiceEnabled}
              compact={true}
            />
          </div>
        )}
      </div>

      {/* Pose Identity & Animal Alias */}
      <div className="mt-2 text-center">
        <h4 className="text-sm sm:text-base font-black text-yellow-300 leading-tight">
          {pose.name}
        </h4>
        <p className="text-[11px] font-semibold text-lime-200/90 italic">
          {pose.sanskritName} • <span className="text-amber-300 not-italic font-bold">{pose.animalAlias}</span>
        </p>
      </div>

      {/* Wisdom Coaching Cue Bubble */}
      <div className="mt-2 p-2 rounded-xl bg-gradient-to-r from-emerald-900/80 to-teal-900/80 border border-lime-400/30 text-left">
        <div className="flex items-center gap-1 text-[10px] font-extrabold text-lime-300 uppercase tracking-wider mb-0.5">
          <Sparkles className="w-3 h-3 text-yellow-300" />
          <span>Wisdom Guide</span>
        </div>
        <p className="text-[11px] font-medium text-stone-200 leading-snug">
          {wisdomText}
        </p>
      </div>

      {/* Target Hold Indicator Footer */}
      <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-stone-300 px-1">
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span>Hold Target:</span>
        </span>
        <span className="px-2 py-0.5 rounded-full bg-lime-400/20 text-lime-300 border border-lime-400/40 font-black">
          {pose.holdSeconds[ageGroup]}s Hold
        </span>
      </div>
    </div>
  );
};
