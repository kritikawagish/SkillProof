import React, { useEffect, useState } from 'react';
import { Check, Loader2, Sparkles, Film, Server, Database, BrainCircuit, ShieldAlert } from 'lucide-react';
import ProofMark from './ProofMark';

interface AiAnalysisScreenProps {
  onComplete: () => void;
  workerName: string;
  testMode?: 'normal' | 'unclear' | 'wrong_task';
}

interface FrameEvidence {
  timestamp: string;
  label: string;
  confidence: number;
  highlight: string;
  bgGradient: string;
}

export default function AiAnalysisScreen({
  onComplete,
  workerName,
  testMode = 'normal',
}: AiAnalysisScreenProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [visibleFrames, setVisibleFrames] = useState<number>(0);

  const steps = [
    {
      title: 'Evidence received',
      desc: 'S3 private bucket encrypted • Digest SHA-256 computed',
      service: 'Amazon S3 + Lambda',
    },
    {
      title: 'Identifying work sequence',
      desc: 'Extracting key action keyframes and gesture transitions',
      service: 'AWS Step Functions',
    },
    {
      title: 'Mapping competencies',
      desc: 'Evaluating against Four-Hole Button Attachment rubric',
      service: 'Multimodal AI Model',
    },
    {
      title: 'Building SkillProof',
      desc: 'Synthesizing evidence timeline & generating proof ID',
      service: 'Amazon DynamoDB',
    },
  ];

  const extractedFrames: FrameEvidence[] = [
    {
      timestamp: '00:03',
      label: 'Preparation & Thread Tension',
      confidence: 94,
      highlight: 'Double ply thread verified (12mm knot)',
      bgGradient: 'from-amber-950/60 to-stone-900',
    },
    {
      timestamp: '00:11',
      label: 'Initial Anchor Stitch',
      confidence: 89,
      highlight: 'Sub-surface catch stitch verified',
      bgGradient: 'from-blue-950/60 to-stone-900',
    },
    {
      timestamp: '00:19',
      label: 'Button Centering & Hole Alignment',
      confidence: 91,
      highlight: 'Concentric alignment over fabric grain',
      bgGradient: 'from-emerald-950/60 to-stone-900',
    },
    {
      timestamp: '00:29',
      label: 'Cross-Pass Stitch Sequence',
      confidence: 88,
      highlight: '6 diagonal passes detected through hole pairs',
      bgGradient: 'from-purple-950/60 to-stone-900',
    },
    {
      timestamp: '00:39',
      label: 'Shank Wrapping & Final Anchor',
      confidence: 85,
      highlight: 'Locking loop under button verified',
      bgGradient: 'from-teal-950/60 to-stone-900',
    },
  ];

  useEffect(() => {
    // Sequential step timeline for cinematic feel
    const t1 = setTimeout(() => {
      setCurrentStep(1);
      setVisibleFrames(1);
    }, 1200);

    const t2 = setTimeout(() => {
      setCurrentStep(2);
      setVisibleFrames(3);
    }, 2800);

    const t3 = setTimeout(() => {
      setCurrentStep(3);
      setVisibleFrames(5);
    }, 4500);

    const t4 = setTimeout(() => {
      onComplete();
    }, 6200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div
      id="screen-05-ai-analysis"
      className="min-h-screen bg-[#10110F] text-white flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#C8F169] selection:text-[#10110F]"
    >
      <div className="max-w-5xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black border border-[#C8F169]/40 flex items-center justify-center">
              <ProofMark size={18} color="#C8F169" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-[#C8F169] uppercase tracking-wider block">
                SKILLPROOF PIPELINE
              </span>
              <span className="text-xs font-mono text-white/50">
                Candidate: {workerName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70">
            <Server className="w-3.5 h-3.5 text-[#C8F169] animate-pulse" />
            <span>AWS Step Functions #sf-9a81</span>
          </div>
        </div>

        {/* Main Cinematic Split: Stages on Left, Extracted Frame Reel on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Vertically animated sequence matching Section 17 */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#C8F169] block mb-1">
                AI Vision Ingestion
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#FCFBF7] tracking-tight">
                Reading the work.
              </h1>
              <p className="text-sm text-white/60 mt-2 font-mono">
                Multimodal analysis evaluating observable craftsmanship against established rubric.
              </p>
            </div>

            {/* Stages List */}
            <div className="space-y-4 pt-2">
              {steps.map((step, idx) => {
                const isPast = currentStep > idx;
                const isCurrent = currentStep === idx;
                const isFuture = currentStep < idx;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all duration-500 flex items-start gap-4 ${
                      isPast
                        ? 'bg-white/[0.04] border-[#C8F169]/40 text-white'
                        : isCurrent
                        ? 'bg-white/[0.08] border-[#C8F169] text-white shadow-lg ring-1 ring-[#C8F169]/30'
                        : 'bg-white/[0.01] border-white/5 text-white/30'
                    }`}
                  >
                    {/* Status Icon */}
                    <div className="mt-0.5 shrink-0">
                      {isPast ? (
                        <div className="w-6 h-6 rounded-full bg-[#C8F169] text-[#10110F] flex items-center justify-center font-bold">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-6 h-6 rounded-full bg-[#C8F169]/20 text-[#C8F169] border border-[#C8F169] flex items-center justify-center">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono">
                          {idx + 1}
                        </div>
                      )}
                    </div>

                    {/* Step Description */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className={`text-base font-bold ${isCurrent ? 'text-[#C8F169]' : ''}`}>
                          {step.title}
                        </h3>
                        <span className="text-[10px] font-mono text-white/40 uppercase">
                          {isPast ? 'COMPLETE' : isCurrent ? 'ANALYZING...' : 'QUEUED'}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 mt-0.5">{step.desc}</p>
                      <div className="mt-1.5 text-[10px] font-mono text-white/40 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C8F169]/60" />
                        <span>{step.service}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Safety Banner (Section 27) */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white/60 space-y-1">
              <div className="font-mono text-[10px] text-[#C8F169] uppercase font-bold tracking-wider">
                Strict Rubric Isolation Policy:
              </div>
              <p className="text-[11px] leading-relaxed">
                SkillProof strictly analyzes physical task execution. System instructions forbid inferring caste, religion, gender, ethnicity, or socioeconomic status.
              </p>
            </div>
          </div>

          {/* Right Column: Extracted Video Frames Appearing Slowly (Section 17) */}
          <div className="lg:col-span-6">
            <div className="bg-black/60 rounded-2xl p-5 border border-white/10 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#C8F169]" />
                  <span className="text-xs font-mono uppercase tracking-wider text-white">
                    Extracted Video Frames
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#C8F169]">
                  {Math.min(visibleFrames, 5)} / 5 Detected Milestones
                </span>
              </div>

              {/* Frames Feed */}
              <div className="space-y-3">
                {extractedFrames.slice(0, visibleFrames).map((frame, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border border-white/15 bg-gradient-to-r ${frame.bgGradient} flex items-center justify-between gap-3 animate-fade-in shadow-md`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-10 rounded bg-black/80 border border-white/20 flex flex-col items-center justify-center shrink-0">
                        <span className="font-mono text-[11px] text-[#C8F169] font-bold">
                          {frame.timestamp}
                        </span>
                        <span className="text-[8px] font-mono text-white/50">KEYFRAME</span>
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{frame.label}</div>
                        <div className="text-[11px] text-white/70 font-mono truncate">
                          {frame.highlight}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-[#C8F169]">
                        {frame.confidence}%
                      </div>
                      <div className="text-[9px] font-mono text-white/50 uppercase">MATCH</div>
                    </div>
                  </div>
                ))}

                {visibleFrames === 0 && (
                  <div className="h-44 flex flex-col items-center justify-center text-white/40 text-xs font-mono space-y-2 border border-dashed border-white/10 rounded-xl">
                    <Loader2 className="w-6 h-6 animate-spin text-[#C8F169]" />
                    <span>Synchronizing stream with inference worker...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/50">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#C8F169] animate-pulse" />
            <span>Multi-modal Bedrock / Vision worker operational</span>
          </div>

          <div className="text-[#C8F169] font-semibold">
            DO NOT CLOSE BROWSER • PREPARING CREDENTIAL
          </div>
        </div>
      </div>
    </div>
  );
}
