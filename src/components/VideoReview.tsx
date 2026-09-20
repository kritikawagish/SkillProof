import React, { useState, useRef } from 'react';
import { Play, Pause, RotateCcw, ArrowRight, Shield, CheckCircle2, AlertTriangle, EyeOff, Scissors } from 'lucide-react';
import ProofMark from './ProofMark';
import SkillVideoPlayer, { SkillVideoPlayerRef } from './SkillVideoPlayer';

interface VideoReviewProps {
  videoUrl: string;
  durationSeconds: number;
  workerName: string;
  onConfirmEvidence: (testMode: 'normal' | 'unclear' | 'wrong_task') => void;
  onRecordAgain: () => void;
}

export default function VideoReview({
  videoUrl,
  durationSeconds,
  workerName,
  onConfirmEvidence,
  onRecordAgain,
}: VideoReviewProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [testScenario, setTestScenario] = useState<'normal' | 'unclear' | 'wrong_task'>('normal');
  const playerRef = useRef<SkillVideoPlayerRef | null>(null);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `0${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div id="screen-04-video-review" className="min-h-screen bg-[#F4F1E8] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10110F] text-[#C8F169] text-xs font-mono">
            <span>STEP 03 OF 04</span>
            <span>•</span>
            <span>EVIDENCE REVIEW</span>
          </div>

          <div className="text-xs font-mono text-[#72766D]">
            Candidate: <span className="text-[#10110F] font-bold">{workerName}</span>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10110F] tracking-tight">
            Review your demonstration
          </h1>
          <p className="text-sm text-[#72766D] mt-1">
            Ensure your hands, needle, button, and fabric are clear throughout the sequence.
          </p>
        </div>

        {/* Large Video Preview Container (PDF Section 16) */}
        <div className="bg-[#10110F] rounded-2xl overflow-hidden shadow-2xl border border-black/20 mb-6">
          <div className="relative aspect-video bg-black flex items-center justify-center">
            <SkillVideoPlayer
              ref={playerRef}
              videoUrl={videoUrl}
              autoPlay={true}
              loop={true}
              playsInline={true}
              altTitle="EVIDENCE BUFFER READY"
              onPlayStateChange={setIsPlaying}
            />
          </div>

          {/* Metadata Below (from Section 16) */}
          <div className="p-4 sm:p-5 bg-[#10110F] text-white flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
            <div className="flex items-center gap-6 font-mono text-xs">
              <div>
                <span className="text-white/50 block text-[10px] uppercase">Duration</span>
                <span className="text-[#C8F169] font-bold text-sm">
                  {formatTime(durationSeconds || 43)}
                </span>
              </div>
              <div>
                <span className="text-white/50 block text-[10px] uppercase">Resolution</span>
                <span className="text-white font-bold text-sm">1080p HD</span>
              </div>
              <div>
                <span className="text-white/50 block text-[10px] uppercase">Status</span>
                <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Evidence ready</span>
                </span>
              </div>
            </div>

            {/* Action Buttons (Section 16) */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                id="review-record-again-btn"
                onClick={onRecordAgain}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Record again</span>
              </button>

              <button
                id="review-use-evidence-btn"
                onClick={() => onConfirmEvidence(testScenario)}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#C8F169] hover:bg-[#bbf04b] text-[#10110F] font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <span>Use this evidence →</span>
              </button>
            </div>
          </div>
        </div>

        {/* Evaluation Scenario Selector for Judges (from PDF Phase 9) */}
        <div className="mb-6 p-4 rounded-xl bg-white border border-[#292B27]/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#10110F] uppercase tracking-wide flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Judge Testing Matrix (Phase 9 Quality Checks)</span>
            </span>
            <span className="text-[10px] font-mono text-[#72766D]">Select test outcome</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => setTestScenario('normal')}
              className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                testScenario === 'normal'
                  ? 'border-[#10110F] bg-[#10110F] text-[#C8F169] font-bold shadow-xs'
                  : 'border-[#292B27]/15 bg-stone-50 text-[#292B27] hover:bg-stone-100'
              }`}
            >
              <div className="font-semibold">Valid Craft Video</div>
              <div className="text-[11px] opacity-80">Generates 87% SkillProof</div>
            </button>

            <button
              onClick={() => setTestScenario('unclear')}
              className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                testScenario === 'unclear'
                  ? 'border-amber-600 bg-amber-600 text-white font-bold shadow-xs'
                  : 'border-[#292B27]/15 bg-stone-50 text-[#292B27] hover:bg-stone-100'
              }`}
            >
              <div className="font-semibold flex items-center gap-1">
                <EyeOff className="w-3 h-3" />
                <span>Unclear Video</span>
              </div>
              <div className="text-[11px] opacity-80">Triggers graceful rejection</div>
            </button>

            <button
              onClick={() => setTestScenario('wrong_task')}
              className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                testScenario === 'wrong_task'
                  ? 'border-rose-600 bg-rose-600 text-white font-bold shadow-xs'
                  : 'border-[#292B27]/15 bg-stone-50 text-[#292B27] hover:bg-stone-100'
              }`}
            >
              <div className="font-semibold flex items-center gap-1">
                <Scissors className="w-3 h-3" />
                <span>Wrong Task</span>
              </div>
              <div className="text-[11px] opacity-80">Detects task mismatch</div>
            </button>
          </div>
        </div>

        {/* Tiny Reassurance as specified in PDF Section 16 */}
        <div className="text-center p-3 rounded-xl bg-white/60 border border-[#292B27]/10">
          <p className="text-xs font-mono text-[#72766D]">
            🔒 <strong className="text-[#10110F]">Tiny reassurance:</strong> Your video is analyzed only for demonstrated skill evidence.
            No identity or personal biometric traits are stored or evaluated.
          </p>
        </div>
      </div>
    </div>
  );
}
