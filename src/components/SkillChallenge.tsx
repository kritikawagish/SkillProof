import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Video, Play, StopCircle, RefreshCw, AlertCircle, Sparkles, Check, ArrowRight } from 'lucide-react';
import ProofMark from './ProofMark';
import { SAMPLE_VIDEO_URL } from '../data/mockData';

interface SkillChallengeProps {
  onVideoCaptured: (videoBlobUrl: string, durationSeconds: number, workerName: string) => void;
  onBack: () => void;
}

export default function SkillChallenge({ onVideoCaptured, onBack }: SkillChallengeProps) {
  const [workerName, setWorkerName] = useState('Kritika W.');
  const [mode, setMode] = useState<'idle' | 'camera' | 'uploading'>('idle');
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    setMode('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Camera access unavailable or declined. You can still upload a video or use the benchmark sample video below.');
      setMode('idle');
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    recordedChunksRef.current = [];
    setRecordTime(0);
    setIsRecording(true);

    try {
      const recorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const blobUrl = URL.createObjectURL(blob);
        const duration = recordTime || 43;
        onVideoCaptured(blobUrl, duration, workerName.trim() || 'Kritika W.');
      };

      recorder.start(500);

      timerIntervalRef.current = setInterval(() => {
        setRecordTime((prev) => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (e: any) {
      console.error('MediaRecorder error:', e);
      setCameraError('Could not start video recorder.');
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    onVideoCaptured(blobUrl, 43, workerName.trim() || 'Kritika W.');
  };

  const handleUseSampleBenchmark = () => {
    onVideoCaptured(SAMPLE_VIDEO_URL, 43, workerName.trim() || 'Kritika W.');
  };

  return (
    <div id="screen-03-skill-challenge" className="min-h-screen bg-[#F4F1E8] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Navigation & Step */}
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10110F] text-[#C8F169] text-xs font-mono">
            <span>STEP 02 OF 04</span>
            <span>•</span>
            <span>TAILORING CHALLENGE</span>
          </div>

          <button
            onClick={onBack}
            className="text-xs font-mono text-[#72766D] hover:text-[#10110F] underline cursor-pointer"
          >
            ← Change occupation
          </button>
        </div>

        {/* Big Heading & Instructions as per PDF Section 15 */}
        <div className="mb-8">
          <div className="text-xs font-mono uppercase tracking-widest text-[#72766D] mb-1">
            DEMONSTRATION PROMPT
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10110F] tracking-tight">
            Show us how you attach a button.
          </h1>
          <p className="text-[#72766D] mt-2 text-base">
            Record one clear demonstration from start to finish.
          </p>
        </div>

        {/* Worker Name Input */}
        <div className="bg-[#FCFBF7] p-4 rounded-xl border border-[#292B27]/10 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <label htmlFor="worker-name-input" className="text-xs font-mono text-[#10110F] font-bold uppercase tracking-wider block">
              Candidate / Artisan Name:
            </label>
            <span className="text-[11px] text-[#72766D]">This will appear on the issued Skill Passport</span>
          </div>
          <input
            id="worker-name-input"
            type="text"
            value={workerName}
            onChange={(e) => setWorkerName(e.target.value)}
            placeholder="e.g. Kritika W."
            className="w-full sm:w-64 bg-white border border-[#292B27]/20 rounded-lg px-3 py-1.5 text-sm font-semibold text-[#10110F] focus:outline-none focus:border-[#10110F]"
          />
        </div>

        {/* Three Minimal Instructions (Section 15) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#FCFBF7] p-4 rounded-xl border border-[#292B27]/10">
            <div className="font-mono text-xs font-bold text-[#72766D] mb-1">01</div>
            <p className="text-sm font-semibold text-[#10110F]">
              Keep your hands and material visible.
            </p>
          </div>
          <div className="bg-[#FCFBF7] p-4 rounded-xl border border-[#292B27]/10">
            <div className="font-mono text-xs font-bold text-[#72766D] mb-1">02</div>
            <p className="text-sm font-semibold text-[#10110F]">
              Show the complete process.
            </p>
          </div>
          <div className="bg-[#FCFBF7] p-4 rounded-xl border border-[#292B27]/10">
            <div className="font-mono text-xs font-bold text-[#72766D] mb-1">03</div>
            <p className="text-sm font-semibold text-[#10110F]">
              Keep the video under 60 seconds.
            </p>
          </div>
        </div>

        {/* Camera or Capture Container */}
        {mode === 'camera' ? (
          <div className="bg-[#10110F] rounded-2xl p-4 sm:p-6 text-white border-2 border-[#C8F169]/40 mb-8 shadow-2xl">
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onError={(e) => e.preventDefault()}
                className="w-full h-full object-cover"
              />

              {/* Recording Overlay Badge */}
              {isRecording && (
                <div className="absolute top-4 left-4 bg-rose-600/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-2 animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-white" />
                  <span>RECORDING 00:{recordTime < 10 ? `0${recordTime}` : recordTime} / 01:00</span>
                </div>
              )}

              {/* Camera Framing Grid */}
              <div className="absolute inset-0 pointer-events-none border border-white/10 grid grid-cols-3 grid-rows-3">
                <div className="border-r border-b border-white/5" />
                <div className="border-r border-b border-white/5" />
                <div className="border-b border-white/5" />
                <div className="border-r border-b border-white/5" />
                <div className="border-r border-b border-white/5 border-dashed border-white/20" />
                <div className="border-b border-white/5" />
                <div className="border-r border-white/5" />
                <div className="border-r border-white/5" />
                <div />
              </div>
            </div>

            {/* Recording Controls */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  if (isRecording) stopRecording();
                  setMode('idle');
                }}
                className="text-xs font-mono text-white/60 hover:text-white"
              >
                Cancel Camera
              </button>

              <div className="flex items-center gap-3">
                {!isRecording ? (
                  <button
                    id="camera-record-start-btn"
                    onClick={startRecording}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                  >
                    <span className="w-3 h-3 rounded-full bg-white animate-ping" />
                    <span>Start Recording</span>
                  </button>
                ) : (
                  <button
                    id="camera-record-stop-btn"
                    onClick={stopRecording}
                    className="bg-[#C8F169] hover:bg-[#bbf04b] text-[#10110F] font-extrabold px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                  >
                    <StopCircle className="w-5 h-5 fill-current" />
                    <span>Finish & Analyze</span>
                  </button>
                )}
              </div>

              <div className="text-xs font-mono text-white/40">
                1080p HD • Direct Stream
              </div>
            </div>
          </div>
        ) : (
          /* Idle Action Cards: Record, Upload, or Quick Benchmark Sample */
          <div className="space-y-4 mb-8">
            {cameraError && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: Start Recording */}
              <button
                id="challenge-start-recording-btn"
                onClick={startCamera}
                className="p-6 rounded-2xl bg-[#10110F] text-white border border-[#C8F169]/30 hover:border-[#C8F169] transition-all flex flex-col items-start justify-between cursor-pointer group shadow-md hover:shadow-xl text-left"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 text-[#C8F169] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Start Recording</h3>
                    <p className="text-xs text-white/70 mt-1">
                      Use device camera to record a live 30–60s demonstration.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-3 border-t border-white/10 w-full flex items-center justify-between text-xs font-mono text-[#C8F169]">
                  <span>Launch camera</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Option B: Upload Existing Video */}
              <label
                htmlFor="video-file-input"
                id="challenge-upload-video-label"
                className="p-6 rounded-2xl bg-[#FCFBF7] border border-[#292B27]/20 hover:border-[#292B27]/40 transition-all flex flex-col items-start justify-between cursor-pointer group shadow-sm hover:shadow-md text-left"
              >
                <input
                  id="video-file-input"
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-black/5 text-[#292B27] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#10110F]">Upload Existing Video</h3>
                    <p className="text-xs text-[#72766D] mt-1">
                      Drag and drop MP4, MOV, or WEBM demonstration files.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-3 border-t border-[#292B27]/10 w-full flex items-center justify-between text-xs font-mono text-[#10110F] font-semibold">
                  <span>Choose file from device</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </label>
            </div>

            {/* Quick Benchmark Demo Option (Instant Judgement Tester) */}
            <div className="p-4 rounded-xl bg-white border border-[#C8F169] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#10110F] text-[#C8F169] flex items-center justify-center font-mono text-xs shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#10110F]">
                    Judging & Testing Shortcut
                  </h4>
                  <p className="text-[11px] text-[#72766D]">
                    No cloth or needle at your desk? Use our verified 43s four-hole button demonstration video.
                  </p>
                </div>
              </div>

              <button
                id="use-sample-benchmark-btn"
                onClick={handleUseSampleBenchmark}
                className="w-full sm:w-auto shrink-0 bg-[#10110F] hover:bg-black text-[#C8F169] text-xs font-mono font-bold px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Use Benchmark Video</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Footer Reassurance */}
        <div className="text-center text-xs font-mono text-[#72766D]">
          Protected by AWS S3 Private Storage • Evaluated solely for observable craftsmanship
        </div>
      </div>
    </div>
  );
}
