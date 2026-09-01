// Synthesized Web Audio API sound effects & Speech synthesis helper

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playHoldTickSound(pitchMultiplier = 1) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33 * pitchMultiplier, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880 * pitchMultiplier, ctx.currentTime + 0.08); // A5
    
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    console.debug('Audio error', e);
  }
}

export function playPoseLockedSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25]; // C5, E5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.06);
      osc.stop(ctx.currentTime + i * 0.06 + 0.25);
    });
  } catch (e) {
    console.debug('Audio error', e);
  }
}

export function playLevelSuccessSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    // Cheerful arpeggio: C5, E5, G5, C6
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + index * 0.09;
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  } catch (e) {
    console.debug('Audio error', e);
  }
}

export function playGrandMasterFanfare() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    // Triumphant fanfare chord progression for Level 11 Milestone
    const chords = [
      [523.25, 659.25, 783.99], // C Major
      [587.33, 739.99, 880.00], // D Major
      [659.25, 830.61, 987.77], // E Major
      [783.99, 987.77, 1318.51], // G Major High
      [1046.50, 1318.51, 1567.98, 2093.00], // High C Major Victory
    ];

    chords.forEach((chord, step) => {
      const stepTime = ctx.currentTime + step * 0.22;
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = step === chords.length - 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, stepTime);
        
        const duration = step === chords.length - 1 ? 1.2 : 0.28;
        gain.gain.setValueAtTime(0.25, stepTime);
        gain.gain.exponentialRampToValueAtTime(0.001, stepTime + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(stepTime);
        osc.stop(stepTime + duration + 0.05);
      });
    });
  } catch (e) {
    console.debug('Fanfare audio error', e);
  }
}

export function playSingingBowlSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(432, ctx.currentTime); // 432 Hz healing frequency
    
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.0);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 3.1);
  } catch (e) {
    console.debug('Singing bowl error', e);
  }
}

// Spoken voice guidance helper using Web Speech Synthesis
let lastSpokenText = '';
let lastSpokenTime = 0;

export function speakGuidePhrase(text: string, force = false) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  
  const now = Date.now();
  // Prevent repeating too frequently (at least 3.5 seconds apart unless forced)
  if (!force && text === lastSpokenText && now - lastSpokenTime < 4500) {
    return;
  }
  if (!force && now - lastSpokenTime < 3000) {
    return;
  }

  try {
    window.speechSynthesis.cancel(); // clear previous queued speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.2; // Slightly higher, friendly tone for kids and youth
    utterance.volume = 0.9;
    
    lastSpokenText = text;
    lastSpokenTime = now;
    
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.debug('Speech error', e);
  }
}
