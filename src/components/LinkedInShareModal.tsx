import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Award,
  Sparkles,
  ShieldCheck,
  FileCheck,
  Linkedin,
} from 'lucide-react';
import { SkillProofRecord } from '../types';
import {
  getProofShareUrl,
  getLinkedInShareUrl,
  getLinkedInAddCertificationUrl,
  generateLinkedInPostText,
  copyShareLink,
} from '../utils/shareUtils';
import ProofMark from './ProofMark';

interface LinkedInShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  proof: SkillProofRecord;
}

export default function LinkedInShareModal({
  isOpen,
  onClose,
  proof,
}: LinkedInShareModalProps) {
  const [activeTab, setActiveTab] = useState<'feed_post' | 'profile_cert'>('feed_post');
  const [copiedPost, setCopiedPost] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const shareUrl = getProofShareUrl(proof.proofId);
  const linkedInPostUrl = getLinkedInShareUrl(proof.proofId);
  const linkedInCertUrl = getLinkedInAddCertificationUrl({
    name: proof.skillTitle,
    organizationName: 'SkillProof Evidence Registry',
    issueDate: proof.issuedDate,
    proofId: proof.proofId,
  });

  const postText = generateLinkedInPostText({
    workerName: proof.workerName,
    skillTitle: proof.skillTitle,
    occupation: proof.occupation,
    proofId: proof.proofId,
    confidence: proof.confidence > 1 ? proof.confidence : Math.round(proof.confidence * 100),
    hash: proof.verificationHash,
  });

  const handleCopyPost = async () => {
    const success = await copyShareLink(postText);
    if (success) {
      setCopiedPost(true);
      setTimeout(() => setCopiedPost(false), 2500);
    }
  };

  const handleCopyUrl = async () => {
    const success = await copyShareLink(shareUrl);
    if (success) {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  const handleLaunchLinkedIn = () => {
    window.open(linkedInPostUrl, '_blank', 'noopener,noreferrer,width=650,height=600');
  };

  const handleLaunchCert = () => {
    window.open(linkedInCertUrl, '_blank', 'noopener,noreferrer,width=700,height=750');
  };

  return (
    <div
      id="linkedin-share-modal"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#FCFBF7] rounded-3xl border border-[#292B27]/15 shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col text-[#10110F] overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-[#292B27]/10 bg-white flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center font-bold shadow-xs">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-[#10110F]">
                  Post Verified Skill to LinkedIn
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0A66C2] text-white font-bold">
                  Reach Boost
                </span>
              </div>
              <p className="text-xs text-[#72766D] mt-0.5">
                Expand job opportunities by publishing your tamper-evident proof to your network
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#72766D] hover:text-[#10110F] hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between px-6 pt-3 pb-2 border-b border-[#292B27]/10 bg-[#F4F1E8]/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('feed_post')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'feed_post'
                  ? 'bg-[#10110F] text-[#C8F169] shadow-xs'
                  : 'text-[#5C6057] hover:text-[#10110F]'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share to Feed</span>
            </button>

            <button
              onClick={() => setActiveTab('profile_cert')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'profile_cert'
                  ? 'bg-[#10110F] text-[#C8F169] shadow-xs'
                  : 'text-[#5C6057] hover:text-[#10110F]'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Add to Licenses & Certs</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-[#72766D] hidden sm:block">
            {proof.proofId}
          </span>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          {activeTab === 'feed_post' ? (
            <div className="space-y-4">
              {/* LinkedIn Post Preview Box */}
              <div className="bg-white rounded-2xl border border-[#292B27]/15 p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#292B27]/10 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#10110F] text-[#C8F169] flex items-center justify-center font-bold text-xs">
                      {proof.workerName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#10110F]">
                        {proof.workerName}
                      </div>
                      <div className="text-[10px] text-[#72766D]">
                        {proof.workerTitle || `${proof.occupation} Specialist`} • Just now
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCopyPost}
                      className="px-2.5 py-1 rounded-lg border border-[#292B27]/15 bg-[#FCFBF7] hover:bg-stone-100 font-mono text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      title="Copy full post text with hashtags"
                    >
                      {copiedPost ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Post Text</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Pre-written Copy */}
                <div className="bg-[#FCFBF7] p-3 rounded-xl border border-[#292B27]/10 font-sans text-xs text-[#292B27] whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                  {postText}
                </div>

                {/* Rich Link Card Preview (OpenGraph style) */}
                <div className="rounded-xl border border-[#292B27]/15 overflow-hidden bg-white hover:border-[#0A66C2] transition-colors">
                  <div className="bg-[#10110F] p-3 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ProofMark size={16} color="#C8F169" />
                      <span className="font-bold font-mono text-[11px] text-[#C8F169]">
                        SKILLPROOF VERIFIED RECORD
                      </span>
                    </div>
                    <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-white/80">
                      {proof.proofId}
                    </span>
                  </div>

                  <div className="p-3 bg-[#FCFBF7] space-y-1">
                    <div className="font-bold text-xs text-[#10110F]">
                      {proof.workerName}: {proof.skillTitle}
                    </div>
                    <p className="text-[11px] text-[#5C6057] line-clamp-2">
                      {proof.taskDescription}
                    </p>
                    <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-[#72766D]">
                      <span>{proof.videoDuration} Video</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">{proof.confidence}% Confidence</span>
                      <span>•</span>
                      <span>skillproof.app</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-[#292B27]/15 p-4 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 border-b border-[#292B27]/10 pb-2">
                  <Award className="w-4 h-4 text-[#0A66C2]" />
                  <span className="font-mono font-bold text-xs uppercase text-[#10110F]">
                    Permanent LinkedIn Certification Entry
                  </span>
                </div>

                <p className="text-xs text-[#5C6057] leading-relaxed">
                  Add this verified skill directly into your LinkedIn profile's{' '}
                  <strong className="text-[#10110F]">Licenses & Certifications</strong> section.
                  Recruiters and hiring managers can click to instantly audit your continuous single-take video evidence.
                </p>

                {/* Field Details */}
                <div className="space-y-2 font-mono text-xs bg-[#FCFBF7] p-3 rounded-xl border border-[#292B27]/10">
                  <div className="flex justify-between py-1 border-b border-[#292B27]/5">
                    <span className="text-[#72766D]">Name:</span>
                    <span className="font-bold text-[#10110F]">SkillProof: {proof.skillTitle}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#292B27]/5">
                    <span className="text-[#72766D]">Issuing Org:</span>
                    <span className="font-bold text-[#10110F]">SkillProof Evidence Registry</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#292B27]/5">
                    <span className="text-[#72766D]">Credential ID:</span>
                    <span className="font-bold text-[#10110F]">{proof.proofId}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#72766D]">Credential URL:</span>
                    <span className="font-bold text-[#0A66C2] truncate max-w-[200px]">{shareUrl}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-[#292B27]/10 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleCopyUrl}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#292B27]/20 bg-[#FCFBF7] hover:bg-white text-[#10110F] font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span>URL Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Proof URL</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {activeTab === 'feed_post' ? (
              <button
                id="btn-confirm-post-linkedin"
                onClick={handleLaunchLinkedIn}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>Post to LinkedIn Feed</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </button>
            ) : (
              <button
                id="btn-confirm-add-cert-linkedin"
                onClick={handleLaunchCert}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Add Certificate to Profile</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
