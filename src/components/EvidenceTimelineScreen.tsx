import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, ArrowLeft, CheckCircle2, Clock, Share2, ShieldCheck, Sparkles, ExternalLink, Copy, Check, FileText } from 'lucide-react';
import ProofMark from './ProofMark';
import ProofResumeModal from './ProofResumeModal';
import LinkedInShareModal from './LinkedInShareModal';
import { SkillProofRecord, TimelineEvent } from '../types';
import SkillVideoPlayer, { SkillVideoPlayerRef } from './SkillVideoPlayer';
import { getProofShareUrl, copyShareLink } from '../utils/shareUtils';

interface EvidenceTimelineScreenProps {
  proof: SkillProofRecord;
  onBack: () => void;
  onOpenPublicVerification: () => void;
}

export default function EvidenceTimelineScreen({
  proof,
  onBack,
  onOpenPublicVerification,
}: EvidenceTimelineScreenProps) {
  const playerRef = useRef<SkillVideoPlayerRef | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);

  const handleCopyShareLink = async () => {
    const url = getProofShareUrl(proof.proofId);
    const success = await copyShareLink(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Jump video to specific timestamp in seconds
  const jumpToTimestamp = (seconds: number, index: number) => {
    if (playerRef.current) {
      playerRef.current.seek(seconds);
      playerRef.current.play();
    }
    setCurrentTime(seconds);
    setIsPlaying(true);
    setActiveEventIndex(index);
  };

  const handleTimeUpdate = (cur: number) => {
    setCurrentTime(cur);

    // Find closest timeline item
    const foundIndex = proof.timeline.findIndex((item, idx) => {
      const nextItem = proof.timeline[idx + 1];
      if (nextItem) {
        return cur >= item.timestamp && cur < nextItem.timestamp;
      }
      return cur >= item.timestamp;
    });

    if (foundIndex !== -1) {
      setActiveEventIndex(foundIndex);
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
  };

  const formatSeconds = (sec: number) => {
    const s = Math.floor(sec);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `0${m}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div id="screen-07-evidence-timeline" className="min-h-screen bg-[#F4F1E8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#292B27]/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-white border border-[#292B27]/15 hover:bg-stone-100 text-[#10110F] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Passport</span>
            </button>

            <div>
              <div className="text-[11px] font-mono text-[#72766D] uppercase flex items-center gap-2">
                <span>INSPECTABLE PROOF OF WORK</span>
                <span>•</span>
                <span className="font-bold text-[#10110F]">{proof.proofId}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#10110F] tracking-tight">
                Evidence Timeline — {proof.skillTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Share to LinkedIn Button */}
            <button
              id="timeline-linkedin-btn"
              onClick={() => setIsLinkedInModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-[#0A66C2] hover:bg-[#004182] text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Post evidence and proof to LinkedIn"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>LinkedIn</span>
            </button>

            <button
              id="timeline-proof-resume-btn"
              onClick={() => setIsResumeModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-white hover:bg-stone-50 text-[#10110F] border border-[#292B27]/15 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Export Comprehensive Proof Resume (PDF & JSON)"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span>Proof Resume</span>
              <span className="text-[9px] font-mono px-1 rounded bg-[#10110F] text-[#C8F169]">
                PDF/JSON
              </span>
            </button>

            <button
              id="timeline-copy-share-btn"
              onClick={handleCopyShareLink}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white hover:bg-stone-50 text-[#10110F] border-[#292B27]/15'
              }`}
              title="Copy unique verification link to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
            </button>

            <button
              onClick={onOpenPublicVerification}
              className="px-4 py-2 rounded-xl bg-[#10110F] text-[#C8F169] text-xs font-mono font-bold hover:bg-black transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Public Verification Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Core Layout: Video on Left, Timeline on Right (Section 19) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Video Player on Left (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#10110F] rounded-2xl overflow-hidden shadow-2xl border border-black/20 relative">
              <div className="aspect-video bg-black relative flex items-center justify-center">
                <SkillVideoPlayer
                  ref={playerRef}
                  videoUrl={proof.videoUrl}
                  autoPlay={true}
                  loop={true}
                  playsInline={true}
                  onTimeUpdate={handleTimeUpdate}
                  onPlayStateChange={setIsPlaying}
                  seekToSeconds={currentTime}
                  altTitle="EVIDENCE VERIFIER"
                />

                {/* Real-time Milestone Overlay Stamp */}
                <div className="absolute top-3 left-3 z-20 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 text-xs font-mono text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C8F169] animate-pulse" />
                  <span>PLAYING: {formatSeconds(currentTime)}</span>
                  <span className="text-white/40">/</span>
                  <span className="text-white/60">{proof.videoDuration}</span>
                </div>

                <div className="absolute bottom-3 right-3 z-20 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-[11px] font-mono text-[#C8F169]">
                  {proof.timeline[activeEventIndex]?.title || 'Observation active'}
                </div>
              </div>

              {/* Video Controls Scrub Bar */}
              <div className="p-4 bg-[#10110F] text-white flex items-center justify-between gap-4 border-t border-white/10">
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                {/* Interactive Timestamp Quick Chips */}
                <div className="flex-1 flex items-center gap-1.5 overflow-x-auto py-1">
                  {proof.timeline.map((event, idx) => (
                    <button
                      key={idx}
                      onClick={() => jumpToTimestamp(event.timestamp, idx)}
                      className={`px-2 py-1 rounded font-mono text-xs whitespace-nowrap transition-all cursor-pointer ${
                        activeEventIndex === idx
                          ? 'bg-[#C8F169] text-[#10110F] font-bold'
                          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {event.timestampDisplay}
                    </button>
                  ))}
                </div>

                <div className="text-xs font-mono text-white/50 shrink-0">
                  Click to jump
                </div>
              </div>
            </div>

            {/* Micro Explainer Badge */}
            <div className="p-4 rounded-xl bg-white border border-[#292B27]/10 flex items-start gap-3 text-xs">
              <Sparkles className="w-4 h-4 text-[#10110F] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#10110F]">Why this matters: </span>
                <span className="text-[#72766D]">
                  SkillProof doesn't just output a score. It shows which precise physical actions created the evaluation.
                  Clicking any timestamp jumps to that moment.
                </span>
              </div>
            </div>
          </div>

          {/* Timeline on Right (5 cols - matching Section 19-20) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#292B27]/10">
              <span className="text-xs font-mono uppercase tracking-wider text-[#72766D] font-bold">
                Observed Sequence ({proof.timeline.length} Milestones)
              </span>
              <span className="text-xs font-mono text-[#10110F] font-semibold">
                Confidence: {proof.confidence}%
              </span>
            </div>

            <div className="space-y-3">
              {proof.timeline.map((event, idx) => {
                const isActive = activeEventIndex === idx;

                return (
                  <div
                    key={idx}
                    id={`timeline-event-${idx}`}
                    onClick={() => jumpToTimestamp(event.timestamp, idx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#10110F] text-white border-[#C8F169] shadow-lg translate-x-1 ring-1 ring-[#C8F169]/40'
                        : 'bg-[#FCFBF7] text-[#292B27] border-[#292B27]/10 hover:border-[#292B27]/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-xs px-2 py-0.5 rounded-sm font-bold ${
                            isActive
                              ? 'bg-[#C8F169] text-[#10110F]'
                              : 'bg-black/5 text-[#10110F]'
                          }`}
                        >
                          {event.timestampDisplay}
                        </span>
                        <h4 className="font-bold text-sm leading-snug">
                          {event.title}
                        </h4>
                      </div>

                      <div className="shrink-0">
                        <CheckCircle2
                          className={`w-4 h-4 ${
                            isActive ? 'text-[#C8F169]' : 'text-emerald-600'
                          }`}
                        />
                      </div>
                    </div>

                    <p
                      className={`text-xs leading-relaxed ${
                        isActive ? 'text-white/80' : 'text-[#72766D]'
                      }`}
                    >
                      {event.description}
                    </p>

                    <div
                      className={`mt-2 pt-2 border-t text-[10px] font-mono flex items-center justify-between ${
                        isActive ? 'border-white/10 text-white/40' : 'border-black/5 text-[#72766D]'
                      }`}
                    >
                      <span>RUBRIC EVIDENCE VERIFIED</span>
                      <span className={isActive ? 'text-[#C8F169]' : 'text-[#10110F]'}>
                        Jump to {event.timestampDisplay} →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Note on Unobserved/Reinforcement (Section 18) */}
            {proof.unobservedNotes && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900">
                <span className="font-bold">Observations for continuous improvement: </span>
                <span>{proof.unobservedNotes}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comprehensive Proof Resume Export Modal (PDF & JSON) */}
      <ProofResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        proof={proof}
      />

      {/* LinkedIn Seamless Sharing & Certification Modal */}
      <LinkedInShareModal
        isOpen={isLinkedInModalOpen}
        onClose={() => setIsLinkedInModalOpen(false)}
        proof={proof}
      />
    </div>
  );
}
