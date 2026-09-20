import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Play, Share2, ShieldCheck, CheckCircle2, ArrowRight, RotateCcw, AlertTriangle, ExternalLink, Copy, Check, Link2, QrCode, Download, Mail, Bell, Building, FileText, FileCode } from 'lucide-react';
import ProofCard from './ProofCard';
import ProofMark from './ProofMark';
import ShareProofBar from './ShareProofBar';
import SocialShareToolbar from './SocialShareToolbar';
import ObserverEndorsements from './ObserverEndorsements';
import EmailNotificationModal from './EmailNotificationModal';
import ProofResumeModal from './ProofResumeModal';
import LinkedInShareModal from './LinkedInShareModal';
import { SkillProofRecord } from '../types';
import { getProofShareUrl, copyShareLink } from '../utils/shareUtils';
import { generateProofPdf } from '../utils/pdfGenerator';
import { notificationService, EmailAlert, DEFAULT_USER_EMAIL } from '../services/notificationService';

interface TheRevealScreenProps {
  proof: SkillProofRecord;
  onViewEvidenceTimeline: () => void;
  onOpenPublicVerification: () => void;
  onRecordAgain: () => void;
  testMode?: 'normal' | 'unclear' | 'wrong_task';
}

export default function TheRevealScreen({
  proof,
  onViewEvidenceTimeline,
  onOpenPublicVerification,
  onRecordAgain,
  testMode = 'normal',
}: TheRevealScreenProps) {
  const [hasEntered, setHasEntered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showShareBar, setShowShareBar] = useState(true);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [alerts, setAlerts] = useState<EmailAlert[]>([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);

  useEffect(() => {
    const unsub = notificationService.subscribe((items) => {
      setAlerts(items);
    });
    return unsub;
  }, []);

  useEffect(() => {
    // Brief darkening and spring enter effect (Section 18)
    const timer = setTimeout(() => {
      setHasEntered(true);
      if (testMode === 'normal') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C8F169', '#10110F', '#F4F1E8', '#ffffff'],
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [testMode]);

  const handleShareClick = async () => {
    const url = getProofShareUrl(proof.proofId);
    const success = await copyShareLink(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadPdf = () => {
    try {
      setIsDownloadingPdf(true);
      setTimeout(() => {
        generateProofPdf(proof);
        setIsDownloadingPdf(false);
        setPdfDownloaded(true);
        setTimeout(() => setPdfDownloaded(false), 3000);
      }, 150);
    } catch (err) {
      console.error('Failed to generate proof PDF:', err);
      setIsDownloadingPdf(false);
    }
  };

  // If this is a tested failure state from Phase 9
  if (testMode === 'unclear' || testMode === 'wrong_task') {
    return (
      <div id="screen-06-reveal-failure" className="min-h-screen bg-[#F4F1E8] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center border border-rose-200">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-rose-600 font-bold mb-1">
              DEMONSTRATION FEEDBACK (PHASE 09 EDGE CASE)
            </div>
            <h1 className="text-3xl font-extrabold text-[#10110F]">
              {testMode === 'unclear'
                ? "We couldn't see enough evidence."
                : 'Task mismatch detected.'}
            </h1>
            <p className="text-base text-[#72766D] mt-3">
              {testMode === 'unclear'
                ? 'Try recording again with your hands, needle, button, and fabric clearly centered in the frame with steady lighting.'
                : 'The submitted evidence does not appear to demonstrate the selected skill (Four-Hole Button Attachment).'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#292B27]/10 text-left text-xs space-y-2">
            <div className="font-mono font-bold text-[#10110F]">AI Observation Report:</div>
            <div className="text-[#72766D]">
              • Confidence threshold: {testMode === 'unclear' ? '34% (Required: ≥75%)' : '12%'}
            </div>
            <div className="text-[#72766D]">
              • Recommendation: Ensure continuous unbroken view of thread pass and knot locking.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onRecordAgain}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#10110F] text-[#C8F169] font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Record new demonstration</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="screen-06-the-reveal"
      className="min-h-screen bg-[#F4F1E8] py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#C8F169] selection:text-[#10110F]"
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        {/* Step Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10110F] text-[#C8F169] text-xs font-mono mb-4">
          <ProofMark size={14} color="#C8F169" />
          <span>VERIFICATION SUCCESS</span>
          <span>•</span>
          <span>SP-7F21D9 ISSUED</span>
        </div>

        {/* Title (Section 18) */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#10110F] tracking-tight">
            SkillProof created.
          </h1>
          <p className="text-base text-[#72766D] mt-2">
            AI-observed evidence generated from submitted demonstration.
          </p>
        </div>

        {/* Employer Verification Alert Banner if evidence has been certified */}
        {alerts.find((a) => a.proofId === proof.proofId || a.decision !== 'service_ready') && (
          <div className="w-full max-w-xl mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 flex-wrap">
                  <span>Verified by {alerts.find((a) => a.proofId === proof.proofId)?.employerCompany || 'Savile Row Bespoke Tailors'}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 font-bold">
                    Email Alert Dispatched
                  </span>
                </div>
                <div className="text-[11px] text-emerald-800 mt-0.5">
                  Notification delivered to candidate at <strong>{DEFAULT_USER_EMAIL}</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEmailModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#10110F] text-[#C8F169] text-xs font-mono font-bold rounded-xl hover:bg-black transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>View Email Alert</span>
            </button>
          </div>
        )}

        {/* The Hero Proof Card with Reveal Entrance */}
        <div
          className={`w-full max-w-xl transition-all duration-700 transform ${
            hasEntered
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-12 scale-95'
          }`}
        >
          <ProofCard
            proof={proof}
            onInspectTimeline={onViewEvidenceTimeline}
            onShare={handleShareClick}
            interactive={false}
          />
        </div>

        {/* Primary Action Buttons */}
        <div className="w-full max-w-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mt-8">
          <button
            id="reveal-view-evidence-btn"
            onClick={onViewEvidenceTimeline}
            className="flex-1 bg-[#10110F] hover:bg-black text-[#C8F169] font-bold text-sm px-5 py-3.5 rounded-xl border border-[#C8F169]/40 shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
            <span>View Evidence Timeline</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="reveal-download-pdf-btn"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className={`px-4 py-3.5 rounded-xl font-bold text-sm border flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
              pdfDownloaded
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-[#FCFBF7] hover:bg-white text-[#10110F] border-[#292B27]/20 hover:border-[#10110F]/40'
            }`}
            title="Download clean branded PDF summary of verified skill evidence"
          >
            {pdfDownloaded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>PDF Downloaded!</span>
              </>
            ) : isDownloadingPdf ? (
              <>
                <span className="w-4 h-4 border-2 border-[#10110F] border-t-transparent rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#10110F]" />
                <span>Download PDF</span>
              </>
            )}
          </button>

          {/* Share to LinkedIn Custom Action Button */}
          <button
            id="reveal-linkedin-btn"
            onClick={() => setIsLinkedInModalOpen(true)}
            className="px-4 py-3.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-bold text-sm border border-[#0A66C2] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            title="Post verified skill proof to LinkedIn profile or feed"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span>LinkedIn</span>
          </button>

          {/* Export Proof Resume (JSON & PDF) Button */}
          <button
            id="reveal-proof-resume-btn"
            onClick={() => setIsResumeModalOpen(true)}
            className="px-4 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-[#10110F] font-bold text-sm border border-[#292B27]/20 hover:border-[#10110F]/40 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            title="Export Comprehensive Proof Resume in PDF or JSON format for job applications"
          >
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>Proof Resume</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#10110F] text-[#C8F169]">
              PDF/JSON
            </span>
          </button>

          <button
            id="reveal-copy-share-btn"
            onClick={handleShareClick}
            className={`px-4 py-3.5 rounded-xl font-bold text-sm border flex items-center justify-center gap-2 transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-[#FCFBF7] hover:bg-white text-[#10110F] border-[#292B27]/20 shadow-xs'
            }`}
            title="Copy unique verification URL to clipboard"
          >
            {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
          </button>

          <button
            id="reveal-employer-view-btn"
            onClick={onOpenPublicVerification}
            className="p-3.5 rounded-xl bg-white hover:bg-white/80 text-[#10110F] font-semibold text-sm border border-[#292B27]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            title="Open Employer Public Verification URL"
          >
            <ExternalLink className="w-4 h-4 text-[#72766D]" />
          </button>

          <button
            id="reveal-alerts-btn"
            onClick={() => setIsEmailModalOpen(true)}
            className="p-3.5 rounded-xl bg-white hover:bg-white/80 text-[#10110F] font-semibold text-sm border border-[#292B27]/20 flex items-center justify-center gap-2 transition-all cursor-pointer relative"
            title="View Candidate Email Alerts (Mock Notification Service)"
          >
            <Mail className="w-4 h-4 text-[#10110F]" />
            {alerts.filter((a) => !a.read).length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white font-mono text-[9px] font-bold flex items-center justify-center animate-pulse">
                {alerts.filter((a) => !a.read).length}
              </span>
            )}
          </button>
        </div>

        {/* Third-Party Observer Endorsement Widget & Counter */}
        <div className="w-full max-w-xl mt-6">
          <ObserverEndorsements proof={proof} />
        </div>

        {/* Social Sharing Toolbar with LinkedIn, Twitter and Slack quick-actions */}
        <div className="w-full max-w-xl mt-6">
          <SocialShareToolbar proof={proof} onOpenLinkedIn={() => setIsLinkedInModalOpen(true)} />
        </div>

        {/* Share Proof Bar with Unique URL and Instant Copy */}
        <div className="w-full max-w-xl mt-6">
          <ShareProofBar
            proofId={proof.proofId}
            workerName={proof.workerName}
            variant="light"
            showQrOption={true}
            onOpenQr={() => setShowQrModal(true)}
            onOpenLinkedIn={() => setIsLinkedInModalOpen(true)}
          />
        </div>

        {/* Footnote on Credibility (Section 8 & 18) */}
        <div className="mt-8 text-center max-w-md text-xs font-mono text-[#72766D]">
          This SkillProof represents AI-observed evidence from a submitted work demonstration.
          It does not claim to replace a state or trade licensing board. That distinction matters.
        </div>

        {/* QR Code Modal */}
        {showQrModal && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setShowQrModal(false)}
          >
            <div
              className="bg-[#FCFBF7] rounded-2xl p-6 max-w-sm w-full border border-[#292B27]/20 shadow-2xl space-y-4 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#292B27]/10 pb-3">
                <span className="font-mono text-xs font-bold uppercase text-[#10110F]">
                  SkillProof QR Code ({proof.proofId})
                </span>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="text-[#72766D] hover:text-[#10110F] text-sm font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Styled SVG QR Code */}
              <div className="p-4 bg-white rounded-xl border border-[#292B27]/10 inline-block shadow-inner">
                <svg className="w-48 h-48" viewBox="0 0 100 100" fill="#10110F">
                  {/* Outer corner patterns */}
                  <rect x="5" y="5" width="26" height="26" rx="4" />
                  <rect x="9" y="9" width="18" height="18" rx="2" fill="#FFFFFF" />
                  <rect x="13" y="13" width="10" height="10" rx="1" />

                  <rect x="69" y="5" width="26" height="26" rx="4" />
                  <rect x="73" y="9" width="18" height="18" rx="2" fill="#FFFFFF" />
                  <rect x="77" y="13" width="10" height="10" rx="1" />

                  <rect x="5" y="69" width="26" height="26" rx="4" />
                  <rect x="9" y="73" width="18" height="18" rx="2" fill="#FFFFFF" />
                  <rect x="13" y="77" width="10" height="10" rx="1" />

                  {/* Synthetic Data Matrix Bits */}
                  <rect x="36" y="8" width="6" height="6" rx="1" />
                  <rect x="46" y="8" width="6" height="6" rx="1" />
                  <rect x="56" y="8" width="6" height="6" rx="1" />
                  <rect x="36" y="18" width="6" height="6" rx="1" />
                  <rect x="46" y="24" width="6" height="6" rx="1" />
                  <rect x="56" y="18" width="6" height="6" rx="1" />
                  <rect x="36" y="36" width="26" height="26" rx="4" fill="#C8F169" />
                  <circle cx="49" cy="49" r="6" fill="#10110F" />
                  <rect x="8" y="36" width="6" height="6" rx="1" />
                  <rect x="18" y="46" width="6" height="6" rx="1" />
                  <rect x="24" y="36" width="6" height="6" rx="1" />
                  <rect x="8" y="56" width="6" height="6" rx="1" />
                  <rect x="68" y="36" width="6" height="6" rx="1" />
                  <rect x="78" y="46" width="6" height="6" rx="1" />
                  <rect x="86" y="36" width="6" height="6" rx="1" />
                  <rect x="68" y="56" width="6" height="6" rx="1" />
                  <rect x="36" y="68" width="6" height="6" rx="1" />
                  <rect x="46" y="76" width="6" height="6" rx="1" />
                  <rect x="56" y="68" width="6" height="6" rx="1" />
                  <rect x="46" y="86" width="6" height="6" rx="1" />
                  <rect x="76" y="76" width="12" height="12" rx="2" />
                </svg>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-[#10110F]">
                  Scan to Verify Proof #{proof.proofId}
                </div>
                <div className="text-[11px] font-mono text-[#72766D]">
                  Directly opens tamper-evident evidence document
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isDownloadingPdf}
                  className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#292B27]/20 text-[#10110F] text-xs font-mono font-bold flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  {pdfDownloaded ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      <span>PDF Downloaded!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-[#10110F]" />
                      <span>Download PDF Summary</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShareClick}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#10110F] text-[#C8F169] text-xs font-mono font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Candidate Email Notification Alert Modal */}
        <EmailNotificationModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          onOpenVerification={onOpenPublicVerification}
        />

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
    </div>
  );
}
