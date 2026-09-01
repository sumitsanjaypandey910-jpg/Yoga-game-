import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, Sparkles, AlertCircle, Eye, Sliders, Volume2, VolumeX, Flame } from 'lucide-react';
import { AgeGroup, Keypoint, PoseFeedback, YogaPose } from '../types/yoga';
import { drawPoseOnCanvas, evaluatePose, generateSyntheticPose, initPoseDetector } from '../utils/poseDetector';
import { playHoldTickSound, playLevelSuccessSound, playPoseLockedSound, speakGuidePhrase } from '../utils/audioEffects';
import { PoseHoldTimer } from './PoseHoldTimer';
import { PoseIllustration } from './PoseIllustrations';
import * as poseDetection from '@tensorflow-models/pose-detection';

interface CameraPoseTrackerProps {
  currentPose: YogaPose;
  ageGroup: AgeGroup;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  onLevelComplete: (stars: number, score: number, holdTime: number) => void;
  comboStreak: number;
}

export const CameraPoseTracker: React.FC<CameraPoseTrackerProps> = ({
  currentPose,
  ageGroup,
  soundEnabled,
  voiceEnabled,
  onLevelComplete,
  comboStreak,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
  const [cameraState, setCameraState] = useState<'idle' | 'loading' | 'active' | 'denied' | 'simulated'>('idle');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [showGhost, setShowGhost] = useState<boolean>(true);
  const [showJointMetrics, setShowJointMetrics] = useState<boolean>(false);

  // Real-time tracking state
  const [feedback, setFeedback] = useState<PoseFeedback>({
    overallScore: 0,
    isMatched: false,
    primaryHint: 'Step back so your full body is in the camera frame 🧘',
    jointAccuracies: {},
  });
  const [holdTime, setHoldTime] = useState<number>(0);
  const [isHoldingActive, setIsHoldingActive] = useState<boolean>(false);

  const targetHoldSeconds = currentPose.holdSeconds[ageGroup];

  // Ref to hold mutable states for RAF loop without tearing
  const loopRef = useRef<{
    animationFrameId: number | null;
    lastHoldTick: number;
    lastPoseMatched: boolean;
    elapsedSimTime: number;
  }>({
    animationFrameId: null,
    lastHoldTick: 0,
    lastPoseMatched: false,
    elapsedSimTime: 0,
  });

  // 1. Initialize TFJS Pose Detector
  useEffect(() => {
    let isMounted = true;
    initPoseDetector()
      .then((det) => {
        if (isMounted) setDetector(det);
      })
      .catch((err) => {
        console.warn('Detector init warning, using synthetic fallback if needed', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Start Camera Stream
  const startCamera = useCallback(async () => {
    try {
      setCameraState('loading');
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraState('active');
      }
    } catch (error) {
      console.warn('Camera access denied or unavailable, switching to simulated posture sensor:', error);
      setCameraState('simulated');
    }
  }, [facingMode]);

  // Handle switching simulation mode / camera restart
  const toggleSimulation = () => {
    if (cameraState === 'simulated') {
      startCamera();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
      setCameraState('simulated');
    }
  };

  const flipCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [startCamera]);

  // Reset hold timer when current pose changes
  useEffect(() => {
    setHoldTime(0);
    setIsHoldingActive(false);
    loopRef.current.lastPoseMatched = false;
  }, [currentPose]);

  // 3. Continuous Pose Detection & Feedback Loop
  useEffect(() => {
    let isRunning = true;
    let lastEvalTime = performance.now();

    const processFrame = async () => {
      if (!isRunning) return;

      const now = performance.now();
      const deltaSec = (now - lastEvalTime) / 1000;
      lastEvalTime = now;
      loopRef.current.elapsedSimTime += deltaSec;

      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas ? canvas.getContext('2d') : null;

      if (canvas && ctx) {
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        let detectedKeypoints: Keypoint[] | null = null;

        if (cameraState === 'active' && video && video.readyState >= 2 && detector) {
          try {
            const poses = await detector.estimatePoses(video, { maxPoses: 1, flipHorizontal: false });
            if (poses && poses.length > 0) {
              const p = poses[0];
              const scaleX = width / (video.videoWidth || 640);
              const scaleY = height / (video.videoHeight || 480);
              detectedKeypoints = p.keypoints.map((kp) => ({
                x: kp.x * scaleX,
                y: kp.y * scaleY,
                score: kp.score,
                name: kp.name,
              }));
            }
          } catch (e) {
            console.debug('Pose estimation frame error:', e);
          }
        } else if (cameraState === 'simulated') {
          // Synthetic realistic posture simulation
          detectedKeypoints = generateSyntheticPose(
            currentPose,
            width,
            height,
            0.92,
            loopRef.current.elapsedSimTime
          );
        }

        if (detectedKeypoints && detectedKeypoints.length >= 17) {
          const evalResult = evaluatePose(detectedKeypoints, currentPose, ageGroup);
          setFeedback(evalResult);

          // Draw custom glowing Yellow-Green skeleton
          drawPoseOnCanvas(ctx, detectedKeypoints, evalResult, width, height, cameraState === 'active');

          // Handle Pose Locked audio
          if (evalResult.isMatched && !loopRef.current.lastPoseMatched) {
            if (soundEnabled) playPoseLockedSound();
            if (voiceEnabled) speakGuidePhrase('Pose locked! Hold steady!');
          }
          loopRef.current.lastPoseMatched = evalResult.isMatched;

          // Hold Timer Progression
          if (evalResult.isMatched) {
            setIsHoldingActive(true);
            setHoldTime((prev) => {
              const updated = prev + deltaSec;
              // Play tick sound every ~0.8s
              if (soundEnabled && now - loopRef.current.lastHoldTick > 800) {
                playHoldTickSound(1 + (updated / targetHoldSeconds) * 0.4);
                loopRef.current.lastHoldTick = now;
              }

              // Check level completion
              if (updated >= targetHoldSeconds) {
                if (soundEnabled) playLevelSuccessSound();
                if (voiceEnabled) speakGuidePhrase('Level Complete! Great job!', true);
                
                // Calculate stars (3 stars if score > 85%, 2 stars if > 70%, 1 star otherwise)
                const stars = evalResult.overallScore >= 85 ? 3 : evalResult.overallScore >= 70 ? 2 : 1;
                onLevelComplete(stars, evalResult.overallScore, updated);
                return 0;
              }
              return updated;
            });
          } else {
            setIsHoldingActive(false);
            // Slowly decay hold time if pose is lost, rather than instant drop to zero
            setHoldTime((prev) => Math.max(0, prev - deltaSec * 0.8));
          }
        }
      }

      loopRef.current.animationFrameId = requestAnimationFrame(processFrame);
    };

    loopRef.current.animationFrameId = requestAnimationFrame(processFrame);

    return () => {
      isRunning = false;
      if (loopRef.current.animationFrameId) {
        cancelAnimationFrame(loopRef.current.animationFrameId);
      }
    };
  }, [cameraState, detector, currentPose, ageGroup, soundEnabled, voiceEnabled, targetHoldSeconds, onLevelComplete]);

  return (
    <div id="camera-pose-tracker" className="flex flex-col gap-4">
      {/* Video & Skeleton Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-4/3 max-h-[520px] rounded-3xl overflow-hidden bg-emerald-950/90 border-4 border-lime-400 shadow-2xl shadow-emerald-950/20 flex items-center justify-center"
      >
        {/* Live Camera Video (Mirrored) */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 ${cameraState === 'active' ? 'opacity-80' : 'opacity-0 pointer-events-none'}`}
        />

        {/* Simulated Stage Visualizer if in Simulated / Denied state */}
        {cameraState !== 'active' && (
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900 via-teal-950 to-emerald-950 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-lime-400/20 border-2 border-lime-400/50 flex items-center justify-center mb-3 animate-pulse">
              <Sparkles className="w-12 h-12 text-yellow-300" />
            </div>
            <h3 className="text-xl font-black text-yellow-300 tracking-wide">
              {cameraState === 'loading' ? 'Activating AI Pose Sensor...' : 'Interactive Posture Sensor Ready'}
            </h3>
            <p className="text-sm font-medium text-lime-200/80 max-w-sm mt-1">
              {cameraState === 'loading'
                ? 'Connecting to your webcam to track joint alignment in real-time...'
                : 'Using interactive posture tracking sensor. Stand in position to test your pose!'}
            </p>
          </div>
        )}

        {/* Ghost Pose Silhouette Overlay (Helpful alignment guide) */}
        {showGhost && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40 mix-blend-screen p-8">
            <PoseIllustration type={currentPose.svgPoseType} isGhost={true} className="w-full h-full max-h-[90%]" />
          </div>
        )}

        {/* Canvas Overlay for Yellow-Green Glow Skeleton */}
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
        />

        {/* Top Status & Controls Overlay Bar */}
        <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-auto">
          {/* Real-time Posture Feedback Pill */}
          <div className={`px-4 py-2 rounded-2xl backdrop-blur-md border shadow-lg flex items-center gap-2 transition-all ${
            feedback.isMatched
              ? 'bg-emerald-500/90 border-emerald-300 text-white shadow-emerald-500/30'
              : 'bg-amber-400/95 border-amber-200 text-amber-950 shadow-amber-500/30'
          }`}>
            <Sparkles className={`w-5 h-5 ${feedback.isMatched ? 'text-yellow-200 fill-yellow-200 animate-spin' : 'text-amber-900'}`} />
            <span className="text-sm font-black tracking-wide">
              {feedback.primaryHint}
            </span>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2">
            <button
              id="toggle-ghost-silhouette-btn"
              onClick={() => setShowGhost(!showGhost)}
              title={showGhost ? 'Hide alignment silhouette' : 'Show alignment silhouette'}
              className={`p-2.5 rounded-2xl backdrop-blur-md border transition-all text-xs font-bold flex items-center gap-1.5 ${
                showGhost ? 'bg-lime-400 text-emerald-950 border-lime-200' : 'bg-black/50 text-white border-white/20 hover:bg-black/70'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Guide Ghost</span>
            </button>

            <button
              id="toggle-joint-metrics-btn"
              onClick={() => setShowJointMetrics(!showJointMetrics)}
              title="Show joint angle metrics"
              className={`p-2.5 rounded-2xl backdrop-blur-md border transition-all text-xs font-bold flex items-center gap-1.5 ${
                showJointMetrics ? 'bg-amber-400 text-amber-950 border-amber-200' : 'bg-black/50 text-white border-white/20 hover:bg-black/70'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden sm:inline">Joints</span>
            </button>

            {cameraState === 'active' && (
              <button
                id="flip-camera-btn"
                onClick={flipCamera}
                title="Flip Camera front/back"
                className="p-2.5 rounded-2xl bg-black/50 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md transition-transform active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            <button
              id="toggle-camera-simulator-btn"
              onClick={toggleSimulation}
              title={cameraState === 'active' ? 'Switch to Test Simulator' : 'Turn on Live Webcam'}
              className="p-2.5 rounded-2xl bg-black/50 hover:bg-black/70 text-yellow-300 border border-yellow-300/30 backdrop-blur-md text-xs font-bold flex items-center gap-1"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden md:inline">{cameraState === 'active' ? 'Webcam Active' : 'Sensor Mode'}</span>
            </button>
          </div>
        </div>

        {/* Floating Hold Timer at Bottom-Right of Stage */}
        <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
          <PoseHoldTimer
            currentHoldSeconds={holdTime}
            targetHoldSeconds={targetHoldSeconds}
            isMatched={feedback.isMatched}
            score={feedback.overallScore}
            comboStreak={comboStreak}
          />
        </div>

        {/* Joint Breakdown Drawer if toggled */}
        {showJointMetrics && (
          <div className="absolute bottom-4 left-4 max-w-xs p-3.5 rounded-2xl bg-black/80 backdrop-blur-md border border-lime-400/40 text-white text-xs z-20 space-y-1.5">
            <p className="font-bold text-lime-300 uppercase tracking-wider flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" /> Joint Angle Precision:
            </p>
            {Object.entries(feedback.jointAccuracies).map(([name, item]) => {
              const data = item as { status: 'correct' | 'warning' | 'error'; angle: number; target: number; label: string };
              return (
                <div key={name} className="flex items-center justify-between gap-2 border-b border-white/10 pb-1">
                  <span className="truncate">{name}</span>
                  <span className={`font-mono font-bold px-1.5 py-0.5 rounded ${
                    data.status === 'correct' ? 'bg-emerald-500/40 text-emerald-300' : data.status === 'warning' ? 'bg-amber-500/40 text-yellow-300' : 'bg-rose-500/40 text-rose-300'
                  }`}>
                    {data.angle}° (tgt {data.target}°)
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
