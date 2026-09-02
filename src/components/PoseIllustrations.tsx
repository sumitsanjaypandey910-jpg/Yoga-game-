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
  // Color palette for friendly cartoon human yogi
  const skin = isGhost ? 'rgba(253, 230, 138, 0.4)' : '#fde68a';
  const skinShadow = isGhost ? 'rgba(245, 158, 11, 0.3)' : '#fcd34d';
  const hair = isGhost ? 'rgba(120, 53, 15, 0.35)' : '#78350f';
  const shirt = isGhost ? 'rgba(52, 211, 153, 0.4)' : '#10b981';
  const shirtDark = isGhost ? 'rgba(5, 150, 105, 0.4)' : '#059669';
  const pants = isGhost ? 'rgba(99, 102, 241, 0.4)' : '#4338ca';
  const pantsDark = isGhost ? 'rgba(67, 56, 202, 0.4)' : '#3730a3';
  const headband = isGhost ? 'rgba(245, 158, 11, 0.4)' : '#f59e0b';
  const blush = isGhost ? 'rgba(244, 63, 94, 0.2)' : 'rgba(244, 63, 94, 0.35)';
  const outline = isGhost ? 'rgba(30, 41, 59, 0.25)' : '#1e293b';
  const aura = isGhost ? 'transparent' : '#fef9c3';
  const matColor = isGhost ? 'rgba(74, 222, 128, 0.2)' : '#86efac';

  // Helper for rendering the cartoon face
  const renderFace = (cx: number, cy: number, lookDirection: 'center' | 'right' | 'left' = 'center') => (
    <g id="cartoon-face">
      {/* Head base */}
      <circle cx={cx} cy={cy} r="16" fill={skin} stroke={outline} strokeWidth="2.5" />
      {/* Hair back / volume */}
      <path
        d={`M${cx - 16} ${cy - 2} C${cx - 18} ${cy - 18}, ${cx + 18} ${cy - 18}, ${cx + 16} ${cy - 2} C${cx + 10} ${cy - 10}, ${cx - 10} ${cy - 10}, ${cx - 16} ${cy - 2} Z`}
        fill={hair}
      />
      {/* Hair top-knot / cute bun */}
      <circle cx={cx} cy={cy - 17} r="7" fill={hair} stroke={outline} strokeWidth="1.5" />
      {/* Headband */}
      <path
        d={`M${cx - 15} ${cy - 6} Q${cx} ${cy - 10} ${cx + 15} ${cy - 6}`}
        stroke={headband}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Hair fringe / bangs */}
      <path
        d={`M${cx - 14} ${cy - 6} Q${cx - 4} ${cy - 2} ${cx} ${cy - 6} Q${cx + 6} ${cy - 3} ${cx + 14} ${cy - 6}`}
        fill={hair}
      />
      {/* Eyes */}
      {lookDirection === 'center' && (
        <>
          <ellipse cx={cx - 5.5} cy={cy + 1} rx="2" ry="2.5" fill={outline} />
          <ellipse cx={cx + 5.5} cy={cy + 1} rx="2" ry="2.5" fill={outline} />
          {/* Eye shines */}
          <circle cx={cx - 6} cy={cy} r="0.8" fill="#ffffff" />
          <circle cx={cx + 5} cy={cy} r="0.8" fill="#ffffff" />
        </>
      )}
      {lookDirection === 'right' && (
        <>
          <ellipse cx={cx - 2} cy={cy + 1} rx="2" ry="2.5" fill={outline} />
          <ellipse cx={cx + 7} cy={cy + 1} rx="2" ry="2.5" fill={outline} />
          <circle cx={cx - 1.5} cy={cy} r="0.8" fill="#ffffff" />
          <circle cx={cx + 7.5} cy={cy} r="0.8" fill="#ffffff" />
        </>
      )}
      {lookDirection === 'left' && (
        <>
          <ellipse cx={cx - 7} cy={cy + 1} rx="2" ry="2.5" fill={outline} />
          <ellipse cx={cx + 2} cy={cy + 1} rx="2" ry="2.5" fill={outline} />
          <circle cx={cx - 6.5} cy={cy} r="0.8" fill="#ffffff" />
          <circle cx={cx + 2.5} cy={cy} r="0.8" fill="#ffffff" />
        </>
      )}
      {/* Cheeks blush */}
      <circle cx={cx - 9} cy={cy + 4} r="3" fill={blush} />
      <circle cx={cx + 9} cy={cy + 4} r="3" fill={blush} />
      {/* Happy Smile */}
      <path
        d={`M${cx - 4} ${cy + 6} Q${cx} ${cy + 9} ${cx + 4} ${cy + 6}`}
        stroke={outline}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );

  switch (type) {
    case 'mountain':
      return (
        <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Mountain & Nature Backdrop */}
          {!isGhost && (
            <>
              <path d="M15 220 L75 110 L135 220 Z" fill="#dcfce7" opacity="0.7" />
              <path d="M85 220 L135 125 L185 220 Z" fill="#bbf7d0" opacity="0.6" />
              <ellipse cx="100" cy="225" rx="75" ry="9" fill={matColor} stroke="#22c55e" strokeWidth="2" />
            </>
          )}

          {/* Legs (Standing tall in leggings) */}
          <g id="legs">
            {/* Left Leg */}
            <path
              d="M91 135 L86 175 L86 215 C86 218 80 222 75 222 C70 222 70 216 74 214 L80 175 L85 135 Z"
              fill={pants}
              stroke={outline}
              strokeWidth="2"
            />
            {/* Right Leg */}
            <path
              d="M109 135 L114 175 L114 215 C114 218 120 222 125 222 C130 222 130 216 126 214 L120 175 L115 135 Z"
              fill={pantsDark}
              stroke={outline}
              strokeWidth="2"
            />
            {/* Feet */}
            <ellipse cx="80" cy="220" rx="8" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />
            <ellipse cx="120" cy="220" rx="8" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />
          </g>

          {/* Torso & Yoga Shirt */}
          <path
            d="M84 72 L116 72 L113 138 L87 138 Z"
            fill={shirt}
            stroke={outline}
            strokeWidth="2.5"
            rx="4"
          />
          {/* Shirt details */}
          <path d="M84 72 Q100 80 116 72" stroke={shirtDark} strokeWidth="2.5" fill="none" />
          <circle cx="100" cy="98" r="4" fill="#facc15" stroke={outline} strokeWidth="1" />

          {/* Arms with Namaste Hands at Heart */}
          <g id="arms-namaste">
            {/* Left Arm */}
            <path
              d="M84 75 L70 95 L92 102 L95 95 L76 90 L85 75 Z"
              fill={skin}
              stroke={outline}
              strokeWidth="2"
            />
            {/* Right Arm */}
            <path
              d="M116 75 L130 95 L108 102 L105 95 L124 90 L115 75 Z"
              fill={skinShadow}
              stroke={outline}
              strokeWidth="2"
            />
            {/* Namaste Joined Palms */}
            <path
              d="M96 90 C96 85 104 85 104 90 L104 105 L96 105 Z"
              fill="#fef08a"
              stroke={outline}
              strokeWidth="2"
            />
            <line x1="100" y1="88" x2="100" y2="104" stroke={outline} strokeWidth="1.5" />
          </g>

          {/* Cartoon Human Head & Smiling Face */}
          {renderFace(100, 52, 'center')}
        </svg>
      );

    case 'tree':
      return (
        <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {!isGhost && (
            <>
              {/* Forest Tree Canopy Aura */}
              <circle cx="100" cy="65" r="50" fill={aura} opacity="0.7" />
              <circle cx="65" cy="55" r="25" fill="#dcfce7" opacity="0.6" />
              <circle cx="135" cy="55" r="25" fill="#dcfce7" opacity="0.6" />
              <ellipse cx="100" cy="225" rx="75" ry="9" fill={matColor} stroke="#22c55e" strokeWidth="2" />
            </>
          )}

          {/* Standing Leg (Straight, strong trunk) */}
          <path
            d="M93 135 L93 216 C93 219 96 222 100 222 C104 222 107 219 107 216 L107 135 Z"
            fill={pants}
            stroke={outline}
            strokeWidth="2"
          />
          <ellipse cx="100" cy="220" rx="9" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Bent Tree Leg (Foot resting gently on inner standing thigh) */}
          <g id="bent-leg">
            <path
              d="M107 135 L145 160 C148 163 148 168 143 170 L108 178 L105 170 L135 160 L105 140 Z"
              fill={pantsDark}
              stroke={outline}
              strokeWidth="2"
            />
            {/* Foot pressed to knee */}
            <ellipse cx="106" cy="173" rx="6" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />
          </g>

          {/* Torso & Shirt */}
          <path d="M85 72 L115 72 L112 138 L88 138 Z" fill={shirt} stroke={outline} strokeWidth="2.5" />
          <circle cx="100" cy="98" r="4" fill="#facc15" stroke={outline} strokeWidth="1" />

          {/* Overhead Tree Branch Arms with Namaste / Leaf Hands */}
          <g id="overhead-arms">
            {/* Left Arm reaching up in curve */}
            <path
              d="M85 75 C70 55 70 35 94 20 L99 26 C82 38 82 55 90 75 Z"
              fill={skin}
              stroke={outline}
              strokeWidth="2"
            />
            {/* Right Arm reaching up in curve */}
            <path
              d="M115 75 C130 55 130 35 106 20 L101 26 C118 38 118 55 110 75 Z"
              fill={skinShadow}
              stroke={outline}
              strokeWidth="2"
            />
            {/* Hands joined overhead */}
            <circle cx="100" cy="20" r="6" fill="#fef08a" stroke={outline} strokeWidth="1.5" />
          </g>

          {/* Head & Face */}
          {renderFace(100, 52, 'center')}
        </svg>
      );

    case 'star':
      return (
        <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {!isGhost && (
            <>
              {/* Star Shine Glow */}
              <polygon
                points="100,10 120,65 185,70 135,110 155,170 100,135 45,170 65,110 15,70 80,65"
                fill={aura}
                opacity="0.5"
              />
              <ellipse cx="100" cy="225" rx="85" ry="9" fill={matColor} stroke="#22c55e" strokeWidth="2" />
            </>
          )}

          {/* Wide Legs in Stance */}
          <g id="wide-star-legs">
            {/* Left Leg */}
            <path
              d="M90 135 L48 214 C46 218 41 219 37 217 C34 214 35 210 39 206 L82 135 Z"
              fill={pants}
              stroke={outline}
              strokeWidth="2"
            />
            {/* Right Leg */}
            <path
              d="M110 135 L152 214 C154 218 159 219 163 217 C166 214 165 210 161 206 L118 135 Z"
              fill={pantsDark}
              stroke={outline}
              strokeWidth="2"
            />
            <ellipse cx="40" cy="216" rx="8" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />
            <ellipse cx="160" cy="216" rx="8" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />
          </g>

          {/* Torso */}
          <path d="M85 72 L115 72 L113 138 L87 138 Z" fill={shirt} stroke={outline} strokeWidth="2.5" />
          <circle cx="100" cy="98" r="4" fill="#facc15" stroke={outline} strokeWidth="1" />

          {/* Wide Star Arms (Reaching out with open joy) */}
          <g id="star-arms">
            {/* Left Arm extended */}
            <path
              d="M85 78 L25 80 C20 80 18 86 22 89 L85 92 Z"
              fill={skin}
              stroke={outline}
              strokeWidth="2"
            />
            {/* Right Arm extended */}
            <path
              d="M115 78 L175 80 C180 80 182 86 178 89 L115 92 Z"
              fill={skinShadow}
              stroke={outline}
              strokeWidth="2"
            />
            {/* Open Palm Hands */}
            <ellipse cx="20" cy="85" rx="5" ry="6" fill={skin} stroke={outline} strokeWidth="1.5" />
            <ellipse cx="180" cy="85" rx="5" ry="6" fill={skin} stroke={outline} strokeWidth="1.5" />
          </g>

          {/* Head & Face */}
          {renderFace(100, 52, 'center')}
        </svg>
      );

    case 'warrior2':
      return (
        <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {!isGhost && (
            <>
              {/* Courage & Bravery Aura */}
              <ellipse cx="100" cy="120" rx="80" ry="45" fill={aura} opacity="0.4" />
              <ellipse cx="100" cy="225" rx="85" ry="9" fill={matColor} stroke="#22c55e" strokeWidth="2" />
            </>
          )}

          {/* Warrior Legs: Bent front knee (right), straight back leg (left) */}
          <g id="warrior-legs">
            {/* Back Straight Leg (Left) */}
            <path
              d="M90 135 L42 215 C40 219 35 220 31 217 C28 214 30 209 34 206 L82 135 Z"
              fill={pantsDark}
              stroke={outline}
              strokeWidth="2"
            />
            <ellipse cx="35" cy="216" rx="8" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />

            {/* Front 90-degree bent leg (Right) */}
            <path
              d="M105 135 L145 155 L145 216 C145 220 152 222 156 220 C160 217 158 212 156 208 L155 158 L115 135 Z"
              fill={pants}
              stroke={outline}
              strokeWidth="2"
            />
            <ellipse cx="152" cy="218" rx="8" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />
          </g>

          {/* Torso upright & strong */}
          <path d="M85 75 L115 75 L112 138 L88 138 Z" fill={shirt} stroke={outline} strokeWidth="2.5" />

          {/* Parallel Warrior Arms Reaching Front and Back */}
          <g id="warrior-arms">
            {/* Back Arm (Reaching Left) */}
            <path
              d="M85 80 L22 80 C18 80 18 86 22 88 L85 88 Z"
              fill={skinShadow}
              stroke={outline}
              strokeWidth="2"
            />
            <ellipse cx="20" cy="84" rx="5" ry="5" fill={skin} stroke={outline} strokeWidth="1.5" />

            {/* Front Arm (Reaching Right toward focal point) */}
            <path
              d="M115 80 L178 80 C182 80 182 86 178 88 L115 88 Z"
              fill={skin}
              stroke={outline}
              strokeWidth="2"
            />
            <ellipse cx="180" cy="84" rx="5" ry="5" fill={skin} stroke={outline} strokeWidth="1.5" />
          </g>

          {/* Head & Face gazing confidently over right fingertips */}
          {renderFace(100, 52, 'right')}
        </svg>
      );

    case 'airplane': // Warrior III / Airplane Balance
      return (
        <svg viewBox="0 0 240 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {!isGhost && (
            <>
              {/* Airplane Flight Clouds & Golden Glow */}
              <ellipse cx="120" cy="95" rx="100" ry="45" fill={aura} opacity="0.4" />
              <ellipse cx="135" cy="188" rx="65" ry="7" fill={matColor} stroke="#22c55e" strokeWidth="2" />
              <line x1="190" y1="65" x2="230" y2="65" stroke="#facc15" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="180" y1="90" x2="225" y2="90" stroke="#facc15" strokeWidth="2" strokeDasharray="4 4" />
            </>
          )}

          {/* Standing Pillar Leg */}
          <path
            d="M128 92 L132 180 C132 184 136 187 140 187 C144 187 146 183 146 180 L142 92 Z"
            fill={pants}
            stroke={outline}
            strokeWidth="2"
          />
          <ellipse cx="139" cy="184" rx="8" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Horizontal Torso & Flying Leg */}
          <g id="flying-body">
            {/* Flying Back Leg (Horizontal to sky) */}
            <path
              d="M135 84 L215 80 C219 80 222 84 219 88 L135 94 Z"
              fill={pantsDark}
              stroke={outline}
              strokeWidth="2"
            />
            <ellipse cx="218" cy="84" rx="5" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />

            {/* Horizontal Torso */}
            <path
              d="M65 80 L135 80 L135 96 L65 96 Z"
              fill={shirt}
              stroke={outline}
              strokeWidth="2.5"
              rx="4"
            />

            {/* Airplane Wing Arms Swept Back */}
            {/* Upper Wing */}
            <path
              d="M95 80 L75 35 C73 31 68 33 69 38 L90 85 Z"
              fill={skin}
              stroke={outline}
              strokeWidth="2"
            />
            <circle cx="72" cy="35" r="4.5" fill={skin} stroke={outline} strokeWidth="1.5" />
            {/* Lower Wing */}
            <path
              d="M95 95 L115 140 C117 144 122 142 121 137 L100 90 Z"
              fill={skinShadow}
              stroke={outline}
              strokeWidth="2"
            />
            <circle cx="118" cy="140" r="4.5" fill={skin} stroke={outline} strokeWidth="1.5" />
          </g>

          {/* Head looking forward toward horizon */}
          {renderFace(52, 88, 'left')}
        </svg>
      );

    case 'downward_dog':
      return (
        <svg viewBox="0 0 220 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {!isGhost && (
            <>
              {/* Pyramid Glow */}
              <polygon points="40,175 125,55 185,175" fill={aura} opacity="0.4" />
              <ellipse cx="110" cy="180" rx="90" ry="8" fill={matColor} stroke="#22c55e" strokeWidth="2" />
            </>
          )}

          {/* Legs from Hips to Floor */}
          <path
            d="M125 55 L175 170 C177 174 182 176 186 173 C189 170 188 165 184 162 L137 55 Z"
            fill={pants}
            stroke={outline}
            strokeWidth="2.5"
          />
          <ellipse cx="180" cy="172" rx="7" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Torso descending from hips to shoulders */}
          <path
            d="M135 55 L75 110 L65 100 L125 45 Z"
            fill={shirt}
            stroke={outline}
            strokeWidth="2.5"
          />

          {/* Arms reaching down to ground palms */}
          <path
            d="M72 105 L38 168 C36 172 40 176 44 175 C48 174 49 170 48 166 L82 105 Z"
            fill={skin}
            stroke={outline}
            strokeWidth="2"
          />
          <ellipse cx="40" cy="172" rx="6" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Head & Face relaxed between arms */}
          {renderFace(70, 118, 'center')}
        </svg>
      );

    case 'cobra':
      return (
        <svg viewBox="0 0 220 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {!isGhost && (
            <>
              <circle cx="65" cy="55" r="40" fill={aura} opacity="0.5" />
              <ellipse cx="110" cy="155" rx="90" ry="8" fill={matColor} stroke="#22c55e" strokeWidth="2" />
            </>
          )}

          {/* Lower Body & Legs flat on mat */}
          <path
            d="M100 135 L190 148 C195 149 198 153 195 156 C192 159 187 157 182 155 L100 148 Z"
            fill={pants}
            stroke={outline}
            strokeWidth="2"
          />
          <ellipse cx="192" cy="152" rx="6" ry="3" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Arched Torso */}
          <path
            d="M60 75 Q90 120 120 142 L105 150 Q75 125 50 82 Z"
            fill={shirt}
            stroke={outline}
            strokeWidth="2.5"
          />

          {/* Supportive Arms */}
          <path
            d="M62 85 L72 145 C73 149 78 152 82 150 C86 148 85 143 83 140 L74 85 Z"
            fill={skin}
            stroke={outline}
            strokeWidth="2"
          />
          <ellipse cx="78" cy="148" rx="6" ry="3" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Head gazing proudly upward */}
          {renderFace(55, 58, 'right')}
        </svg>
      );

    case 'triangle':
      return (
        <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {!isGhost && (
            <>
              <polygon points="50,215 80,30 165,215" fill={aura} opacity="0.4" />
              <ellipse cx="100" cy="225" rx="85" ry="9" fill={matColor} stroke="#22c55e" strokeWidth="2" />
            </>
          )}

          {/* Wide Legs */}
          <path
            d="M105 130 L52 214 C50 218 45 219 41 217 C38 214 39 209 43 206 L96 130 Z"
            fill={pants}
            stroke={outline}
            strokeWidth="2"
          />
          <path
            d="M115 130 L158 214 C160 218 165 219 169 217 C172 214 171 209 167 206 L124 130 Z"
            fill={pantsDark}
            stroke={outline}
            strokeWidth="2"
          />
          <ellipse cx="44" cy="216" rx="8" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />
          <ellipse cx="166" cy="216" rx="8" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Slanted Torso */}
          <path
            d="M80 82 L105 70 L125 130 L100 138 Z"
            fill={shirt}
            stroke={outline}
            strokeWidth="2.5"
          />

          {/* Arms: One reaching up to the sky, one down to shin */}
          <g id="triangle-arms">
            {/* Sky Arm */}
            <path
              d="M92 72 L78 28 C76 24 71 25 72 30 L84 76 Z"
              fill={skin}
              stroke={outline}
              strokeWidth="2"
            />
            <circle cx="76" cy="26" r="5" fill={skin} stroke={outline} strokeWidth="1.5" />
            {/* Shin Reach Arm */}
            <path
              d="M88 84 L58 175 C56 179 61 182 64 179 L96 88 Z"
              fill={skinShadow}
              stroke={outline}
              strokeWidth="2"
            />
            <circle cx="60" cy="178" r="5" fill={skin} stroke={outline} strokeWidth="1.5" />
          </g>

          {/* Head & Face gazing to sky hand */}
          {renderFace(96, 60, 'left')}
        </svg>
      );

    case 'chair':
      return (
        <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {!isGhost && (
            <>
              <ellipse cx="100" cy="160" rx="45" ry="35" fill={aura} opacity="0.4" />
              <ellipse cx="100" cy="225" rx="75" ry="9" fill={matColor} stroke="#22c55e" strokeWidth="2" />
            </>
          )}

          {/* Squatting Thighs & Calves (Chair Seat) */}
          <g id="chair-legs">
            <path
              d="M78 135 L120 155 L115 216 C115 220 121 222 125 220 C129 217 127 212 125 208 L128 158 L85 135 Z"
              fill={pants}
              stroke={outline}
              strokeWidth="2"
            />
            <ellipse cx="122" cy="218" rx="8" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />
          </g>

          {/* Angled Torso */}
          <path
            d="M98 75 L125 80 L88 140 L65 135 Z"
            fill={shirt}
            stroke={outline}
            strokeWidth="2.5"
          />

          {/* Arms Reaching Upward diagonally */}
          <g id="chair-arms">
            <path
              d="M110 75 L145 28 C148 24 153 27 151 31 L118 82 Z"
              fill={skin}
              stroke={outline}
              strokeWidth="2"
            />
            <circle cx="148" cy="28" r="5.5" fill={skin} stroke={outline} strokeWidth="1.5" />
          </g>

          {/* Head */}
          {renderFace(108, 55, 'right')}
        </svg>
      );

    case 'boat':
      return (
        <svg viewBox="0 0 220 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {!isGhost && (
            <>
              <ellipse cx="110" cy="110" rx="75" ry="50" fill={aura} opacity="0.4" />
              <ellipse cx="110" cy="165" rx="75" ry="8" fill={matColor} stroke="#22c55e" strokeWidth="2" />
            </>
          )}

          {/* Lifted V-Legs */}
          <path
            d="M102 135 L168 62 C172 58 177 62 174 66 L108 142 Z"
            fill={pants}
            stroke={outline}
            strokeWidth="2"
          />
          <ellipse cx="172" cy="62" rx="6" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Lean-back Torso */}
          <path
            d="M58 75 L80 62 L112 135 L90 142 Z"
            fill={shirt}
            stroke={outline}
            strokeWidth="2.5"
          />

          {/* Parallel Balance Arms */}
          <path
            d="M80 95 L145 95 C149 95 149 101 145 101 L80 101 Z"
            fill={skin}
            stroke={outline}
            strokeWidth="2"
          />
          <circle cx="147" cy="98" r="4.5" fill={skin} stroke={outline} strokeWidth="1.5" />

          {/* Head & Smiling Face */}
          {renderFace(62, 54, 'right')}
        </svg>
      );

    case 'lotus':
    default:
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {!isGhost && (
            <>
              {/* Lotus Blossom Aura */}
              <path d="M100 35 C60 75 50 135 100 155 C150 135 140 75 100 35 Z" fill={aura} opacity="0.5" />
              <ellipse cx="100" cy="180" rx="75" ry="9" fill={matColor} stroke="#22c55e" strokeWidth="2" />
            </>
          )}

          {/* Crossed Lotus Legs */}
          <g id="crossed-legs">
            <path
              d="M75 135 C50 145 50 170 95 172 C140 170 140 145 115 135 Z"
              fill={pants}
              stroke={outline}
              strokeWidth="2.5"
            />
            {/* Cute yoga feet resting on knees */}
            <ellipse cx="62" cy="158" rx="6" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />
            <ellipse cx="138" cy="158" rx="6" ry="4" fill={skin} stroke={outline} strokeWidth="1.5" />
          </g>

          {/* Upright Torso */}
          <path d="M84 75 L116 75 L113 140 L87 140 Z" fill={shirt} stroke={outline} strokeWidth="2.5" />
          <circle cx="100" cy="98" r="4" fill="#facc15" stroke={outline} strokeWidth="1" />

          {/* Mudra Rest Arms on Knees */}
          <g id="mudra-arms">
            {/* Left Arm */}
            <path
              d="M84 78 L60 115 L62 148 L68 148 L70 115 L86 78 Z"
              fill={skin}
              stroke={outline}
              strokeWidth="2"
            />
            {/* Right Arm */}
            <path
              d="M116 78 L140 115 L138 148 L132 148 L130 115 L114 78 Z"
              fill={skinShadow}
              stroke={outline}
              strokeWidth="2"
            />
            {/* Chin Mudra Hands (Index & thumb circle) */}
            <circle cx="65" cy="150" r="5" fill="#fef08a" stroke={outline} strokeWidth="1.5" />
            <circle cx="135" cy="150" r="5" fill="#fef08a" stroke={outline} strokeWidth="1.5" />
          </g>

          {/* Head & Peaceful Smiling Face */}
          {renderFace(100, 52, 'center')}
        </svg>
      );
  }
};
