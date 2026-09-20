import React, { useState, useEffect } from 'react';
import { Check, AlertTriangle, Play, ShieldCheck, Share2, Sparkles, Award } from 'lucide-react';
import ProofMark from './ProofMark';
import { SkillProofRecord } from '../types';
import { endorsementService } from '../services/endorsementService';

interface ProofCardProps {
  proof: SkillProofRecord;
  onInspectTimeline?: () => void;
  onShare?: () => void;
  compact?: boolean;
  interactive?: boolean;
}

export default function ProofCard({
  proof,
  onInspectTimeline,
  onShare,
  compact = false,
  interactive = true,
}: ProofCardProps) {
  const verifiedCount = proof.competencies.filter((c) => c.observed).length;
  const [endorsementCount, setEndorsementCount] = useState<number>(() =>
    endorsementService.getEndorsementCount(proof.proofId)
  );

  useEffect(() => {
    setEndorsementCount(endorsementService.getEndorsementCount(proof.proofId));
    const unsub = endorsementService.subscribe((pid, count) => {
      if (pid === proof.proofId) {
        setEndorsementCount(count);
      }
    });
    return unsub;
  }, [proof.proofId]);

  return (
    <div
      id={`skillproof-credential-card-${proof.proofId}`}
      className={`group relative rounded-2xl bg-[#10110F] text-[#FCFBF7] border border-[#C8F169]/30 shadow-2xl transition-all duration-300 ${
        interactive ? 'hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:border-[#C8F169]/50' : ''
      } ${compact ? 'p-5 max-w-sm' : 'p-6 sm:p-8 max-w-xl'} w-full overflow-hidden`}
    >
      {/* Background Subtle Craft Watermark Pattern */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#C8F169]/5 blur-3xl pointer-events-none" />
      <div className="absolute right-6 top-6 opacity-10 pointer-events-none">
        <ProofMark size={84} color="#FFFFFF" />
      </div>

      {/* Header Band */}
      <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center border border-[#C8F169]/40 shadow-inner">
            <ProofMark size={20} color="#C8F169" />
          </div>
          <div>
            <div className="text-[11px] font-mono tracking-widest text-[#C8F169] uppercase flex items-center gap-1.5">
              <span>SKILLPROOF</span>
              <span className="w-1 h-1 rounded-full bg-[#C8F169]" />
              <span>OFFICIAL EVIDENCE</span>
            </div>
            <h3 className="font-sans font-bold text-lg text-[#FCFBF7] tracking-tight">
              Evidence-Backed Skill Passport
            </h3>
          </div>
        </div>

        {/* Proof ID in DM Mono */}
        <div className="text-right">
          <span className="text-[10px] font-mono uppercase text-white/50 tracking-wider block">Proof ID</span>
          <span className="font-mono text-xs text-[#C8F169] bg-white/5 px-2 py-0.5 rounded-sm border border-white/10 font-semibold tracking-wider">
            {proof.proofId}
          </span>
        </div>
      </div>

      {/* Primary Qualification Block */}
      <div className="mb-6">
        <div className="text-[11px] font-mono uppercase tracking-widest text-white/60 mb-1">
          {proof.occupation.toUpperCase()}
        </div>
        <h4 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
          {proof.skill}
        </h4>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-medium text-[#C8F169]">{proof.workerName}</span>
          <span className="text-white/30 text-xs">•</span>
          <span className="text-xs text-white/60 font-mono">Issued {proof.issuedDate}</span>
        </div>
      </div>

      {/* Hero Metrics Row: Confidence, Observed Competencies & Endorsements */}
      <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'} gap-3 mb-6 p-3.5 rounded-xl bg-white/[0.04] border border-white/10`}>
        <div>
          <span className="text-[11px] font-mono uppercase text-white/60 block">
            Evidence Confidence
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-mono text-3xl font-extrabold text-[#C8F169] tracking-tight">
              {proof.confidence}%
            </span>
            <span className="text-[10px] font-mono text-white/50">AI-OBSERVED</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase text-white/60 block">
            Competencies
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-mono text-3xl font-extrabold text-white tracking-tight">
              {verifiedCount}
            </span>
            <span className="text-sm text-white/50 font-mono">/ {proof.competencies.length}</span>
            <span className="text-[10px] font-mono text-[#C8F169] ml-1">VERIFIED</span>
          </div>
        </div>

        {!compact && (
          <div className="col-span-2 sm:col-span-1 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-white/10 sm:pl-3">
            <span className="text-[11px] font-mono uppercase text-white/60 block flex items-center gap-1">
              <span>Endorsements</span>
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-mono text-3xl font-extrabold text-[#C8F169] tracking-tight">
                {endorsementCount}
              </span>
              <span className="text-[10px] font-mono text-white/50 ml-1">OBSERVERS</span>
            </div>
          </div>
        )}
      </div>

      {/* Observed Competencies List */}
      <div className="mb-5 space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-white/60 block">
          Observed Competencies
        </span>
        <div className="space-y-1.5">
          {proof.competencies.slice(0, compact ? 3 : 5).map((comp) => (
            <div
              key={comp.id}
              className="flex items-center justify-between text-xs py-1 px-2.5 rounded-md bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors"
            >
              <div className="flex items-center gap-2 text-white/90">
                <span className="w-4 h-4 rounded-full bg-[#C8F169]/20 text-[#C8F169] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span className="font-medium text-white/95">{comp.label}</span>
              </div>
              <span className="font-mono text-[11px] text-white/50">{comp.timestampDisplay}</span>
            </div>
          ))}
        </div>

        {/* Needs more evidence section if present (from Section 18) */}
        {proof.unobservedNotes && !compact && (
          <div className="mt-2.5 p-2 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-300">Observation note: </span>
              <span className="text-amber-200/90">{proof.unobservedNotes}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Details: Video Duration, Hash, QR Badge */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C8F169] animate-pulse" />
            <span className="font-mono text-xs text-white/80">● Evidence available</span>
          </div>
          <div className="text-[11px] font-mono text-white/50">
            {proof.videoDuration} demonstration • {proof.videoResolution}
          </div>
        </div>

        {/* Action buttons if interactive */}
        <div className="flex items-center gap-2">
          {interactive && onShare && (
            <button
              type="button"
              id={`share-proof-btn-${proof.proofId}`}
              onClick={onShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
              title="Copy unique share link"
            >
              <Share2 className="w-3 h-3" />
              <span>Share Link</span>
            </button>
          )}

          {interactive && onInspectTimeline && (
            <button
              type="button"
              id={`inspect-evidence-btn-${proof.proofId}`}
              onClick={onInspectTimeline}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C8F169] text-[#10110F] text-xs font-bold hover:bg-[#bbf04b] transition-all cursor-pointer shadow-sm"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Inspect Evidence</span>
            </button>
          )}
        </div>
      </div>

      {/* Trust Tag */}
      <div className="mt-3 pt-2 text-[10px] text-white/40 font-mono flex items-center justify-between">
        <span>AWS-POWERED MULTIMODAL INFERENCE</span>
        <span className="tracking-widest">SHA-256: {proof.verificationHash.slice(0, 8)}...</span>
      </div>
    </div>
  );
}
