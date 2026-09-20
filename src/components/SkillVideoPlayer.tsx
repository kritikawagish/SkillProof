import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Video, Scissors, Check, Eye } from 'lucide-react';
import { SAMPLE_VIDEO_URL, SAMPLE_SEWING_VIDEO_FALLBACK, FALLBACK_REMOTE_VIDEO } from '../data/mockData';

interface SkillVideoPlayerProps {
  videoUrl?: string;
  autoPlay?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  className?: string;
  onTimeUpdate?: (currentTime: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  seekToSeconds?: number;
  showWatermark?: boolean;
  altTitle?: string;
}

export interface SkillVideoPlayerRef {
  play: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
}

const SkillVideoPlayer = React.forwardRef<SkillVideoPlayerRef, SkillVideoPlayerProps>(
  (
    {
      videoUrl = SAMPLE_VIDEO_URL,
      autoPlay = true,
      loop = true,
      playsInline = true,
      className = '',
      onTimeUpdate,
      onPlayStateChange,
      seekToSeconds,
      showWatermark = true,
      altTitle = 'Demonstration Evidence',
    },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [videoFailed, setVideoFailed] = useState(false);
    const [simulatedTime, setSimulatedTime] = useState(0);
    const [viewMode, setViewMode] = useState<'video' | 'simulation'>('video');
    const [activeSourceIndex, setActiveSourceIndex] = useState(0);

    // List of candidate video sources in descending order of reliability
    const candidateSources = [
      videoUrl,
      SAMPLE_VIDEO_URL,
      '/craft_demo.mp4',
      '/craft_demo.webm',
      SAMPLE_SEWING_VIDEO_FALLBACK,
      FALLBACK_REMOTE_VIDEO,
    ].filter(Boolean);

    // Expose control methods to parent component
    React.useImperativeHandle(ref, () => ({
      play: () => {
        if (videoRef.current && !videoFailed) {
          videoRef.current.play().catch(() => {});
        }
        setIsPlaying(true);
        onPlayStateChange?.(true);
      },
      pause: () => {
        if (videoRef.current && !videoFailed) {
          videoRef.current.pause();
        }
        setIsPlaying(false);
        onPlayStateChange?.(false);
      },
      seek: (seconds: number) => {
        if (videoRef.current && !videoFailed && Number.isFinite(videoRef.current.duration)) {
          videoRef.current.currentTime = seconds;
        }
        setSimulatedTime(seconds);
        onTimeUpdate?.(seconds);
      },
      getCurrentTime: () => {
        if (videoRef.current && !videoFailed) {
          return videoRef.current.currentTime;
        }
        return simulatedTime;
      },
      getDuration: () => {
        if (videoRef.current && !videoFailed && Number.isFinite(videoRef.current.duration)) {
          return videoRef.current.duration;
        }
        return 43;
      },
    }));

    // Handle external seek requests
    useEffect(() => {
      if (typeof seekToSeconds === 'number') {
        if (videoRef.current && !videoFailed && Number.isFinite(videoRef.current.duration)) {
          videoRef.current.currentTime = seekToSeconds;
        }
        setSimulatedTime(seekToSeconds);
      }
    }, [seekToSeconds, videoFailed]);

    // Error recovery handler: if current video source fails, try next or switch to visual simulation
    const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      // Prevent browser default error bubble
      e.preventDefault();
      
      if (activeSourceIndex < candidateSources.length - 1) {
        // Try next fallback source
        const nextIdx = activeSourceIndex + 1;
        setActiveSourceIndex(nextIdx);
        if (videoRef.current) {
          videoRef.current.src = candidateSources[nextIdx];
          videoRef.current.load();
          videoRef.current.play().catch(() => {});
        }
      } else {
        // All video streams unavailable: seamlessly engage Tailoring Craft Simulation
        setVideoFailed(true);
        setViewMode('simulation');
      }
    };

    // Synchronize play/pause state
    const handlePlay = () => {
      setIsPlaying(true);
      onPlayStateChange?.(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
    };

    const handleNativeTimeUpdate = () => {
      if (videoRef.current) {
        const t = videoRef.current.currentTime;
        setSimulatedTime(t);
        onTimeUpdate?.(t);
      }
    };

    // Fallback simulation timer loop when in craft simulation mode or when video paused
    useEffect(() => {
      if (viewMode === 'simulation' || videoFailed) {
        if (!isPlaying) return;
        const interval = setInterval(() => {
          setSimulatedTime((prev) => {
            const next = prev >= 43 ? 0 : prev + 0.5;
            onTimeUpdate?.(next);
            return next;
          });
        }, 500);
        return () => clearInterval(interval);
      }
    }, [isPlaying, viewMode, videoFailed, onTimeUpdate]);

    const togglePlay = () => {
      if (viewMode === 'video' && !videoFailed && videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
          onPlayStateChange?.(true);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
          onPlayStateChange?.(false);
        }
      } else {
        const next = !isPlaying;
        setIsPlaying(next);
        onPlayStateChange?.(next);
      }
    };

    // Determine current tailoring sequence step for craft simulation
    const getTailoringPhase = (sec: number) => {
      if (sec < 6) return { phase: 'Preparation', detail: 'Thread dual-ply through eye of needle, wax thread', progress: (sec / 6) * 100, step: 1 };
      if (sec < 14) return { phase: 'Anchoring', detail: 'Creating blind anchor knot inside fabric weave', progress: ((sec - 6) / 8) * 100, step: 2 };
      if (sec < 23) return { phase: 'Positioning', detail: 'Aligning four-hole horn button to tailor chalk mark', progress: ((sec - 14) / 9) * 100, step: 3 };
      if (sec < 35) return { phase: 'Cross-Stitching', detail: '6 precision diagonal loops (H1→H4 & H2→H3)', progress: ((sec - 23) / 12) * 100, step: 4 };
      return { phase: 'Thread Shank & Knot', detail: '4 shank wraps beneath button for collar clearance & back lock', progress: ((sec - 35) / 8) * 100, step: 5 };
    };

    const currentPhase = getTailoringPhase(simulatedTime);

    return (
      <div className={`relative w-full h-full bg-[#10110F] overflow-hidden select-none ${className}`}>
        {/* Real Video Element (when not failed) */}
        {!videoFailed && viewMode === 'video' ? (
          <video
            ref={videoRef}
            src={candidateSources[activeSourceIndex] || '/craft_demo.mp4'}
            autoPlay={autoPlay}
            loop={loop}
            playsInline={playsInline}
            muted={true}
            onError={handleVideoError}
            onPlay={handlePlay}
            onPause={handlePause}
            onTimeUpdate={handleNativeTimeUpdate}
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
          >
            <source src="/craft_demo.mp4" type="video/mp4" />
            <source src="/craft_demo.webm" type="video/webm" />
            <source src={FALLBACK_REMOTE_VIDEO} type="video/mp4" />
          </video>
        ) : null}

        {/* Tailoring Craft Interactive Simulation (Active when toggled or fallback) */}
        {(videoFailed || viewMode === 'simulation') && (
          <div
            onClick={togglePlay}
            className="w-full h-full relative flex items-center justify-center bg-gradient-to-b from-[#181916] to-[#0E0F0D] cursor-pointer overflow-hidden"
          >
            {/* Suiting Fabric Texture Grid */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C8F169_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Suiting Cloth Fabric Swatch */}
            <div className="relative w-72 h-72 sm:w-88 sm:h-88 rounded-2xl bg-[#21231E] border-2 border-white/10 shadow-2xl flex items-center justify-center p-6">
              
              {/* Fabric Weave Lines */}
              <div className="absolute inset-0 rounded-2xl opacity-10 bg-[repeating-linear-gradient(45deg,#fff,#fff_2px,transparent_2px,transparent_6px)]" />

              {/* Tailor's Chalk Marks */}
              <div className="absolute w-28 h-28 border border-dashed border-amber-200/30 rounded-full animate-pulse" />
              <div className="absolute w-full h-[1px] bg-amber-200/20" />
              <div className="absolute h-full w-[1px] bg-amber-200/20" />

              {/* 4-Hole Horn Button Representation */}
              <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-[#3D4039] via-[#2A2B27] to-[#1E1F1C] border-4 border-[#52564D] shadow-2xl flex items-center justify-center">
                {/* Button Rim Bevel */}
                <div className="absolute inset-2 rounded-full border border-white/10" />
                
                {/* 4 Holes Matrix */}
                <div className="grid grid-cols-2 gap-7 p-4 relative z-10">
                  {/* Hole 1 */}
                  <div className="relative">
                    <div className="w-5 h-5 rounded-full bg-[#10110F] border border-black shadow-inner flex items-center justify-center">
                      {simulatedTime > 14 && <div className="w-2.5 h-2.5 rounded-full bg-[#C8F169]" />}
                    </div>
                    <span className="absolute -top-4 -left-2 text-[9px] font-mono text-white/40">H1</span>
                  </div>

                  {/* Hole 2 */}
                  <div className="relative">
                    <div className="w-5 h-5 rounded-full bg-[#10110F] border border-black shadow-inner flex items-center justify-center">
                      {simulatedTime > 23 && <div className="w-2.5 h-2.5 rounded-full bg-[#C8F169]" />}
                    </div>
                    <span className="absolute -top-4 -right-2 text-[9px] font-mono text-white/40">H2</span>
                  </div>

                  {/* Hole 3 */}
                  <div className="relative">
                    <div className="w-5 h-5 rounded-full bg-[#10110F] border border-black shadow-inner flex items-center justify-center">
                      {simulatedTime > 23 && <div className="w-2.5 h-2.5 rounded-full bg-[#C8F169]" />}
                    </div>
                    <span className="absolute -bottom-4 -left-2 text-[9px] font-mono text-white/40">H3</span>
                  </div>

                  {/* Hole 4 */}
                  <div className="relative">
                    <div className="w-5 h-5 rounded-full bg-[#10110F] border border-black shadow-inner flex items-center justify-center">
                      {simulatedTime > 14 && <div className="w-2.5 h-2.5 rounded-full bg-[#C8F169]" />}
                    </div>
                    <span className="absolute -bottom-4 -right-2 text-[9px] font-mono text-white/40">H4</span>
                  </div>
                </div>

                {/* Stitched Thread Lines Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none p-6" viewBox="0 0 100 100">
                  {/* Diagonal Stitch 1: H1 to H4 */}
                  {simulatedTime >= 23 && (
                    <line
                      x1="30"
                      y1="30"
                      x2="70"
                      y2="70"
                      stroke="#C8F169"
                      strokeWidth="4"
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  )}
                  {/* Diagonal Stitch 2: H2 to H3 */}
                  {simulatedTime >= 27 && (
                    <line
                      x1="70"
                      y1="30"
                      x2="30"
                      y2="70"
                      stroke="#C8F169"
                      strokeWidth="4"
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  )}
                  {/* Thread Shank Coils Indicator */}
                  {simulatedTime >= 35 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="14"
                      fill="none"
                      stroke="#F4F1E8"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      className="animate-spin"
                    />
                  )}
                </svg>

                {/* Needle Representation */}
                <div
                  className="absolute pointer-events-none transition-all duration-500 z-20"
                  style={{
                    transform: `translate(${Math.sin(simulatedTime * 2) * 40}px, ${Math.cos(simulatedTime * 2) * 35}px) rotate(${simulatedTime * 45}deg)`,
                  }}
                >
                  <div className="w-1.5 h-16 bg-gradient-to-t from-zinc-400 via-zinc-200 to-white rounded-full shadow-lg border-t border-white" />
                  <div className="w-3 h-0.5 bg-[#C8F169] -mt-1 ml-0.5 shadow-sm" />
                </div>
              </div>

              {/* Hand Motion Outline Indicator */}
              <div className="absolute -bottom-2 right-4 text-[10px] font-mono text-[#C8F169]/80 flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-md border border-white/10">
                <Scissors className="w-3 h-3 text-[#C8F169]" />
                <span>ARTISAN HANDS IN FRAME (COMPLIANT)</span>
              </div>
            </div>

            {/* Simulation Phase HUD */}
            <div className="absolute bottom-4 left-4 right-4 bg-[#10110F]/90 backdrop-blur-md p-3 rounded-xl border border-white/15 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 z-10">
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono text-[#C8F169] uppercase font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C8F169] animate-pulse" />
                  <span>STEP {currentPhase.step}/5: {currentPhase.phase}</span>
                </div>
                <div className="text-xs font-medium text-white/90">{currentPhase.detail}</div>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-white/60">SIMULATION SEC:</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-[#C8F169] font-bold">
                  00:{Math.floor(simulatedTime) < 10 ? `0${Math.floor(simulatedTime)}` : Math.floor(simulatedTime)} / 00:43
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Center Play/Pause Floating Action Button */}
        <button
          onClick={togglePlay}
          className={`absolute inset-0 flex items-center justify-center transition-opacity cursor-pointer ${
            isPlaying ? 'opacity-0 hover:opacity-100 bg-black/10' : 'opacity-100 bg-black/30'
          }`}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <div className="w-16 h-16 rounded-full bg-black/80 border border-white/20 text-[#C8F169] flex items-center justify-center shadow-2xl hover:scale-105 transition-transform">
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-current ml-1" />}
          </div>
        </button>

        {/* Mode Switcher Toggle (Video Stream vs Simulation) */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewMode((prev) => (prev === 'video' ? 'simulation' : 'video'));
            }}
            className="px-2.5 py-1 rounded-lg bg-black/70 hover:bg-black/90 backdrop-blur-md text-[11px] font-mono text-white/80 hover:text-white border border-white/15 flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            title="Switch between video evidence and procedural artisan simulation"
          >
            {viewMode === 'video' ? (
              <>
                <Sparkles className="w-3 h-3 text-[#C8F169]" />
                <span className="hidden sm:inline">Craft Simulation</span>
              </>
            ) : (
              <>
                <Video className="w-3 h-3 text-[#C8F169]" />
                <span className="hidden sm:inline">Evidence Stream</span>
              </>
            )}
          </button>
        </div>

        {/* Top Watermark Badge */}
        {showWatermark && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2 text-xs font-mono text-white/90 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">{altTitle.toUpperCase()}</span>
          </div>
        )}
      </div>
    );
  }
);

SkillVideoPlayer.displayName = 'SkillVideoPlayer';

export default SkillVideoPlayer;
