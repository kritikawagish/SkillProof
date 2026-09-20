import React from 'react';
import { X, Server, Database, Shield, Cpu, Cloud, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import ProofMark from './ProofMark';

interface AwsArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AwsArchitectureModal({ isOpen, onClose }: AwsArchitectureModalProps) {
  if (!isOpen) return null;

  return (
    <div
      id="aws-architecture-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="aws-architecture-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FCFBF7] text-[#292B27] rounded-3xl border border-[#292B27]/20 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 my-8"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#292B27]/10 pb-5 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#10110F] text-[#C8F169] flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-[#72766D]">
                  PHASE 12 ARCHITECTURE & SYSTEM DESIGN
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">
                  BHARAT BUILDS 2026
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10110F] tracking-tight">
                SkillProof Serverless Architecture
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-black/5 hover:bg-black/10 text-[#292B27] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Exact ASCII / Vector Architecture Flow from Section 37 */}
        <div className="mb-10 p-6 rounded-2xl bg-[#10110F] text-white border border-[#C8F169]/30">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 font-mono text-xs">
            <span className="text-[#C8F169] font-bold">EVENT-DRIVEN INFERENCE PIPELINE</span>
            <span className="text-white/40">ap-south-1 (Mumbai)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-xs font-mono">
            {/* Step 1 */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-between">
              <div className="text-[10px] text-[#C8F169]">1. CAPTURE</div>
              <div className="font-bold text-sm my-1 text-white">Worker Device</div>
              <div className="text-[10px] text-white/50">Mobile Camera (30–60s)</div>
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-between">
              <div className="text-[10px] text-[#C8F169]">2. INGESTION</div>
              <div className="font-bold text-sm my-1 text-white">AWS Amplify</div>
              <div className="text-[10px] text-white/50">API Gateway + Lambda</div>
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-between">
              <div className="text-[10px] text-[#C8F169]">3. STORAGE & ORCH</div>
              <div className="font-bold text-sm my-1 text-white">S3 + Step Functions</div>
              <div className="text-[10px] text-white/50">Signed URLs & Keyframes</div>
            </div>

            {/* Step 4 */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-between">
              <div className="text-[10px] text-[#C8F169]">4. MULTIMODAL AI</div>
              <div className="font-bold text-sm my-1 text-white">Vision Rubric</div>
              <div className="text-[10px] text-white/50">Observable Milestones</div>
            </div>

            {/* Step 5 */}
            <div className="p-3 rounded-xl bg-white/5 border border-[#C8F169]/50 flex flex-col items-center justify-between bg-[#C8F169]/10">
              <div className="text-[10px] text-[#C8F169] font-bold">5. PORTABLE PROOF</div>
              <div className="font-bold text-sm my-1 text-[#C8F169]">DynamoDB + Public Page</div>
              <div className="text-[10px] text-white/70">SP-7F21D9 URL & QR</div>
            </div>
          </div>
        </div>

        {/* 7 Services Breakdown (Phase 35 & Section 23) */}
        <div className="mb-10 space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-wider text-[#72766D] font-bold">
            AWS Services Implementation Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#292B27]/10 space-y-1">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-orange-600" />
                <span className="font-bold text-sm text-[#10110F]">AWS Amplify</span>
              </div>
              <p className="text-xs text-[#72766D]">
                Hosts the live mobile-first frontend with instant global CDN distribution and SSL termination.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#292B27]/10 space-y-1">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-sm text-[#10110F]">AWS Lambda & API Gateway</span>
              </div>
              <p className="text-xs text-[#72766D]">
                Generates time-restricted signed upload URLs so video never touches intermediate web servers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#292B27]/10 space-y-1">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-sm text-[#10110F]">Amazon S3 (Private Bucket)</span>
              </div>
              <p className="text-xs text-[#72766D]">
                Encrypted object storage. Videos are private by default; employers see only verified evidence timestamps.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#292B27]/10 space-y-1">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-sm text-[#10110F]">AWS Step Functions</span>
              </div>
              <p className="text-xs text-[#72766D]">
                Coordinates the 4-phase pipeline: VideoUploaded → PrepareEvidence → AnalyzeDemonstration → SaveToDynamoDB.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#292B27]/10 space-y-1">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-sm text-[#10110F]">Amazon DynamoDB</span>
              </div>
              <p className="text-xs text-[#72766D]">
                Single-digit millisecond retrieval of SkillProof records by unique Proof ID (e.g. SP-7F21D9).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#292B27]/10 space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-600" />
                <span className="font-bold text-sm text-[#10110F]">Multimodal AI & Safety Guard</span>
              </div>
              <p className="text-xs text-[#72766D]">
                System prompt strictly limits evaluation to physical rubric items; forbids inferring caste, religion, or gender.
              </p>
            </div>
          </div>
        </div>

        {/* What We Learned (Section 35) */}
        <div className="p-5 rounded-2xl bg-[#F4F1E8] border border-[#292B27]/10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase text-[#10110F]">
              What We Learned (Hackathon Writeup Note)
            </span>
          </div>
          <p className="text-xs text-[#72766D] leading-relaxed">
            "This was our first time building an event-driven video-analysis workflow where AI acts not as a general chatbot,
            but as a deterministic rubric inspector. Linking timestamped video coordinates directly to competency cards
            moves employability from <em>claim</em> to <em>evidence</em>."
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-5 border-t border-[#292B27]/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#10110F] text-[#C8F169] font-bold text-xs cursor-pointer hover:bg-black"
          >
            Close Architecture View
          </button>
        </div>
      </div>
    </div>
  );
}
