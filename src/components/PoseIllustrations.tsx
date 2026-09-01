import React from 'react';

interface PoseIllustrationProps {
  type: string;
  className?: string;
  isGhost?: boolean;
}

export const PoseIllustration: React.FC<PoseIllustrationProps> = ({
  type,
  className = 'w-full h-full',
  isGhost = false,
}) => {
  const strokeColor = isGhost ? 'rgba(74, 222, 128, 0.45)' : '#15803d';
  const fillColor = isGhost ? 'rgba(250, 204, 21, 0.15)' : '#fef08a';
  const accentColor = isGhost ? 'rgba(34, 197, 94, 0.35)' : '#22c55e';
  const strokeWidth = isGhost ? '3' : '4';

  switch (type) {
    case 'mountain':
      return (
        <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Mountain silhouette background */}
          <path d="M20 220 L100 80 L180 220 Z" fill={isGhost ? 'transparent' : '#dcfce7'} opacity="0.6" />
          <path d="M70 220 L100 140 L130 220 Z" fill={isGhost ? 'transparent' : '#bbf7d0'} opacity="0.8" />
          
          {/* Character Head */}
          <circle cx="100" cy="45" r="16" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Namaste hands */}
          <path d="M100 75 L100 95" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
          <path d="M85 85 L100 75 L115 85" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          {/* Torso */}
          <path d="M100 62 L100 135" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Arms at heart */}
          <path d="M72 82 L85 85" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M128 82 L115 85" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M100 68 L72 82" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M100 68 L128 82" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Legs standing tall */}
          <path d="M100 135 L88 220" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M100 135 L112 220" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Ground line */}
          <path d="M50 225 L150 225" stroke={accentColor} strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4" />
        </svg>
      );

    case 'tree':
      return (
        <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Foliage aura */}
          <circle cx="100" cy="50" r="45" fill={isGhost ? 'transparent' : '#fef9c3'} opacity="0.7" />
          {/* Head */}
          <circle cx="100" cy="52" r="15" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Torso */}
          <path d="M100 67 L100 135" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Branch arms overhead like leaves */}
          <path d="M100 72 L65 50 L75 25" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M100 72 L135 50 L125 25" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="75" cy="25" r="6" fill={accentColor} />
          <circle cx="125" cy="25" r="6" fill={accentColor} />
          {/* Standing Leg */}
          <path d="M100 135 L100 220" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Bent Leg resting on knee */}
          <path d="M100 135 L142 165 L102 175" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          {/* Roots */}
          <path d="M70 225 L130 225" stroke={accentColor} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'star':
      return (
        <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Star sparkle background */}
          <polygon points="100,10 120,70 185,75 135,115 155,175 100,140 45,175 65,115 15,75 80,70" fill={isGhost ? 'transparent' : '#fef08a'} opacity="0.35" />
          {/* Head */}
          <circle cx="100" cy="45" r="16" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Torso */}
          <path d="M100 61 L100 130" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Wide Star Arms */}
          <path d="M25 85 L100 72 L175 85" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="25" cy="85" r="6" fill={accentColor} />
          <circle cx="175" cy="85" r="6" fill={accentColor} />
          {/* Wide Star Legs */}
          <path d="M100 130 L45 220" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M100 130 L155 220" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );

    case 'warrior2':
      return (
        <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Head looking right */}
          <circle cx="95" cy="48" r="15" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Torso upright */}
          <path d="M95 63 L95 130" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Arms extended front & back */}
          <path d="M20 80 L95 72 L175 78" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <circle cx="175" cy="78" r="6" fill={accentColor} />
          {/* Front Bent Leg (90 deg lunge) */}
          <path d="M95 130 L145 155 L145 220" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          {/* Back Straight Leg */}
          <path d="M95 130 L40 220" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Mat ground */}
          <path d="M20 225 L180 225" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'airplane': // Grand Milestone Level 11 Warrior III
      return (
        <svg viewBox="0 0 240 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Golden wings aura */}
          <ellipse cx="120" cy="90" rx="90" ry="40" fill={isGhost ? 'transparent' : '#fef08a'} opacity="0.4" />
          {/* Horizontal Torso & Head */}
          <circle cx="48" cy="85" r="14" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Horizontal Spine */}
          <path d="M62 88 L140 88" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Wing arms extended */}
          <path d="M100 88 L90 35 L75 25" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M100 88 L110 140 L125 150" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="75" cy="25" r="6" fill="#eab308" />
          <circle cx="125" cy="150" r="6" fill="#eab308" />
          {/* Standing Leg (pillar) */}
          <path d="M140 88 L140 185" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Back Flying Leg (horizontal) */}
          <path d="M140 88 L215 88" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <circle cx="215" cy="88" r="5" fill={accentColor} />
          {/* Speed flight trails */}
          <path d="M180 75 L225 75" stroke="#eab308" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M170 100 L220 100" stroke="#eab308" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      );

    case 'downward_dog':
      return (
        <svg viewBox="0 0 220 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Inverted V shape */}
          <circle cx="65" cy="115" r="13" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Arms to hands */}
          <path d="M65 115 L35 175" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Spine to hips (top of pyramid) */}
          <path d="M65 115 L125 55" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <circle cx="125" cy="55" r="8" fill={accentColor} />
          {/* Legs to feet */}
          <path d="M125 55 L185 175" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Floor */}
          <path d="M20 180 L200 180" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'cobra':
      return (
        <svg viewBox="0 0 220 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Head high */}
          <circle cx="65" cy="45" r="15" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Arched chest & spine */}
          <path d="M65 60 Q95 115 170 145" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Arms supporting */}
          <path d="M78 80 L78 145" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Floor line */}
          <path d="M30 150 L200 150" stroke={accentColor} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'triangle':
      return (
        <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Head */}
          <circle cx="95" cy="70" r="14" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Slanted torso */}
          <path d="M95 84 L120 135" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Top sky arm */}
          <path d="M95 84 L80 25" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <circle cx="80" cy="25" r="6" fill="#eab308" />
          {/* Bottom shin arm */}
          <path d="M95 84 L60 175" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Wide Legs */}
          <path d="M120 135 L55 215" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M120 135 L165 215" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );

    case 'chair':
      return (
        <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Head */}
          <circle cx="105" cy="55" r="15" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Angled Torso */}
          <path d="M105 70 L80 130" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Arms reaching overhead */}
          <path d="M105 75 L135 25" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <circle cx="135" cy="25" r="5" fill="#eab308" />
          {/* Squatting thighs */}
          <path d="M80 130 L120 155 L115 220" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'boat':
      return (
        <svg viewBox="0 0 220 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Head */}
          <circle cx="65" cy="55" r="14" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Torso */}
          <path d="M65 69 L105 130" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* V-legs up */}
          <path d="M105 130 L165 60" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Parallel arms */}
          <path d="M85 95 L145 95" stroke={accentColor} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );

    case 'lotus':
    default:
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Lotus petal aura */}
          <path d="M100 40 C60 80 50 140 100 160 C150 140 140 80 100 40 Z" fill={isGhost ? 'transparent' : '#fef08a'} opacity="0.4" />
          {/* Head */}
          <circle cx="100" cy="55" r="16" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Upright spine */}
          <path d="M100 71 L100 135" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Mudra arms */}
          <path d="M100 80 L65 110 L55 130" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M100 80 L135 110 L145 130" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="55" cy="130" r="5" fill="#eab308" />
          <circle cx="145" cy="130" r="5" fill="#eab308" />
          {/* Crossed Lotus legs */}
          <path d="M100 135 L50 155 Q100 175 150 155 L100 135" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
        </svg>
      );
  }
};
