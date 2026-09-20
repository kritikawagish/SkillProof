import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, QrCode, Copy, Check, ArrowRight, ExternalLink, Clock, Play, FileText, ArrowLeft, Link2, Share2, Download, Building, Mail, Send, Award, Bell, UserCheck } from 'lucide-react';
import ProofMark from './ProofMark';
import ShareProofBar from './ShareProofBar';
import ObserverEndorsements from './ObserverEndorsements';
import EmailNotificationModal from './EmailNotificationModal';
import ProofResumeModal from './ProofResumeModal';
import LinkedInShareModal from './LinkedInShareModal';
import { SkillProofRecord } from '../types';
import { getProofShareUrl, copyShareLink } from '../utils/shareUtils';
import { generateProofPdf } from '../utils/pdfGenerator';
import { notificationService, EmailAlert, DEFAULT_USER_EMAIL } from '../services/notificationService';

interface EmployerVerificationScreenProps {
  proof: SkillProofRecord;
  onInspectEvidence: () => void;
  onBackToApp: () => void;
}

export default function EmployerVerificationScreen({
  proof,
  onInspectEvidence,
  onBackToApp,
}: EmployerVerificationScreenProps) {
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  // Employer Verification Action & Alert state
  const [employerCompany, setEmployerCompany] = useState('Savile Row Bespoke Tailors');
  const [employerVerifier, setEmployerVerifier] = useState('Arthur Pendelton');
  const [employerRole, setEmployerRole] = useState('Master Tailor & Head Cutter');
  const [decision, setDecision] = useState<'verified' | 'accepted_for_interview' | 'offer_extended'>('verified');
  const [notes, setNotes] = useState('Inspected full 43-second timeline. Knot security, thread tension, and 4 shank rotations verified against master tailoring standards.');
  const [isCertifying, setIsCertifying] = useState(false);
  const [certifiedAlert, setCertifiedAlert] = useState<EmailAlert | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);

  const verificationUrl = getProofShareUrl(proof.proofId);

  const copyUrl = async () => {
    const success = await copyShareLink(verificationUrl);
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

  const handleCertifyVerification = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!employerCompany.trim() || !employerVerifier.trim()) return;

    setIsCertifying(true);
    try {
      const alert = await notificationService.triggerEmployerVerificationNotification({
        proofId: proof.proofId,
        workerName: proof.workerName,
        workerEmail: DEFAULT_USER_EMAIL,
        employerCompany,
        employerName: employerVerifier,
        employerTitle: employerRole,
        decision,
        notes,
      });
      setCertifiedAlert(alert);
      setIsCertifying(false);
    } catch (err) {
      console.error('Failed to trigger employer verification alert', err);
      setIsCertifying(false);
    }
  };

  return (
    <div id="screen-08-employer-verification" className="min-h-screen bg-[#F4F1E8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation & Public Status Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#292B27]/10">
          <button
            onClick={onBackToApp}
            className="flex items-center gap-1.5 text-xs font-mono text-[#72766D] hover:text-[#10110F] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Candidate Studio</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-[#10110F]">
              Public Trust Verifier (No Login Required)
            </span>
          </div>
        </div>

        {/* Main Verification Document Card */}
        <div className="bg-[#FCFBF7] rounded-3xl border border-[#292B27]/15 p-6 sm:p-10 shadow-xl relative overflow-hidden">
          {/* Subtle Watermark */}
          <div className="absolute top-6 right-6 opacity-5 pointer-events-none">
            <ProofMark size={140} color="#10110F" />
          </div>

          {/* Header (Section 20) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#292B27]/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#10110F] flex items-center justify-center border border-[#C8F169]/40 shadow-xs">
                <ProofMark size={22} color="#C8F169" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#72766D] font-bold">
                  SKILLPROOF VERIFICATION
                </span>
                <h2 className="text-2xl font-black text-[#10110F] tracking-tight">
                  SkillProof
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold flex items-center gap-1.5 border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>● Evidence intact</span>
              </span>
            </div>
          </div>

          {/* Structured Key Details (Section 20 of PDF) */}
          <div className="py-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Field 1: Demonstrated Competency */}
              <div className="space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#72766D]">
                  Demonstrated competency:
                </div>
                <div className="text-lg font-extrabold text-[#10110F]">
                  {proof.occupation} — {proof.skill}
                </div>
                <div className="text-xs text-[#72766D]">
                  Four-hole button attachment on suiting fabric
                </div>
              </div>

              {/* Field 2: Worker */}
              <div className="space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#72766D]">
                  Worker:
                </div>
                <div className="text-lg font-extrabold text-[#10110F] flex items-center gap-2">
                  <span>{proof.workerName}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/5 text-[#72766D]">
                    ID Verified
                  </span>
                </div>
                <div className="text-xs text-[#72766D]">
                  Specialist Garment Artisan
                </div>
              </div>

              {/* Field 3: Evidence */}
              <div className="space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#72766D]">
                  Evidence:
                </div>
                <div className="text-base font-bold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Available ({proof.videoDuration} demonstration)</span>
                </div>
                <div className="text-xs text-[#72766D]">
                  1080p recorded demonstration in S3 private archive
                </div>
              </div>

              {/* Field 4: Competencies Observed */}
              <div className="space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#72766D]">
                  Competencies observed:
                </div>
                <div className="text-2xl font-extrabold text-[#10110F]">
                  {proof.competencies.filter((c) => c.observed).length}{' '}
                  <span className="text-sm font-normal text-[#72766D]">of 5 Rubric Points</span>
                </div>
                <div className="text-xs text-[#72766D]">
                  Preparation, Anchoring, Positioning, Stitching, Finishing
                </div>
              </div>

              {/* Field 5: Evidence Confidence */}
              <div className="space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#72766D]">
                  Evidence confidence:
                </div>
                <div className="text-3xl font-mono font-black text-[#10110F] flex items-baseline gap-2">
                  <span>{proof.confidence}%</span>
                  <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    HIGH CERTAINTY
                  </span>
                </div>
              </div>

              {/* Field 6: Proof ID & Cryptographic Stamp */}
              <div className="space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#72766D]">
                  Proof ID:
                </div>
                <div className="font-mono text-base font-bold text-[#10110F] bg-black/5 p-2 rounded-lg border border-black/10 flex items-center justify-between">
                  <span>{proof.proofId}</span>
                  <span className="text-[10px] text-[#72766D]">SHA-256 VALIDATED</span>
                </div>
              </div>
            </div>

            {/* Issued Date & Cloud Proof Location */}
            <div className="p-4 rounded-2xl bg-[#F4F1E8] border border-[#292B27]/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div>
                <span className="text-[#72766D]">Issued: </span>
                <span className="font-bold text-[#10110F]">{proof.issuedDate}</span>
              </div>
              <div>
                <span className="text-[#72766D]">AWS Region: </span>
                <span className="font-bold text-[#10110F]">{proof.awsRegion}</span>
              </div>
              <div>
                <span className="text-[#72766D]">Digest: </span>
                <span className="font-bold text-[#10110F]">{proof.verificationHash.slice(0, 12)}...</span>
              </div>
            </div>
          </div>

          {/* Primary CTA (Section 20) */}
          <div className="pt-6 border-t border-[#292B27]/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <button
              id="employer-inspect-evidence-btn"
              onClick={onInspectEvidence}
              className="bg-[#10110F] hover:bg-black text-[#C8F169] font-bold text-sm px-8 py-3.5 rounded-xl border border-[#C8F169]/40 shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer group"
            >
              <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
              <span>Inspect evidence</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                id="employer-download-pdf-btn"
                onClick={handleDownloadPdf}
                disabled={isDownloadingPdf}
                className={`px-4 py-3 rounded-xl border font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  pdfDownloaded
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white hover:bg-stone-50 border-[#292B27]/20 text-[#10110F] shadow-xs'
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

              {/* Share to LinkedIn Button */}
              <button
                id="employer-linkedin-btn"
                onClick={() => setIsLinkedInModalOpen(true)}
                className="px-4 py-3 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="Share candidate proof on LinkedIn or add to certifications"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>LinkedIn</span>
              </button>

              {/* Export Full Proof Resume for HR/ATS */}
              <button
                id="employer-proof-resume-btn"
                onClick={() => setIsResumeModalOpen(true)}
                className="px-4 py-3 rounded-xl bg-white hover:bg-stone-50 border border-[#292B27]/20 text-[#10110F] font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="Export Comprehensive Proof Resume (PDF & JSON) for ATS or hiring files"
              >
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Proof Resume</span>
                <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-[#10110F] text-[#C8F169]">
                  JSON/PDF
                </span>
              </button>

              <button
                id="employer-copy-share-btn"
                onClick={copyUrl}
                className={`px-4 py-3 rounded-xl border font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white hover:bg-stone-50 border-[#292B27]/20 text-[#10110F] shadow-xs'
                }`}
                title="Copy unique verification URL to clipboard"
              >
                {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
              </button>

              <button
                id="employer-qr-btn"
                onClick={() => setShowQrModal(true)}
                className="px-4 py-3 rounded-xl bg-white hover:bg-stone-50 border border-[#292B27]/20 text-[#10110F] text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="View QR Code"
              >
                <QrCode className="w-4 h-4" />
                <span className="hidden sm:inline">QR Code</span>
              </button>
            </div>
          </div>

          {/* Employer Verification Certification & Email Alert Trigger */}
          <div className="mt-8 pt-8 border-t border-[#292B27]/15">
            <div className="rounded-2xl border border-[#292B27]/20 bg-gradient-to-br from-[#F4F1E8] to-white p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#10110F] text-[#C8F169] flex items-center justify-center font-bold">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#10110F]">
                      Official Employer Verification Sign-off
                    </h3>
                    <p className="text-xs text-[#72766D]">
                      Certify this candidate's demonstrated skill & dispatch an instant email alert
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono bg-white px-2.5 py-1 rounded-lg border border-[#292B27]/15 text-[#5C6057]">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Target: {DEFAULT_USER_EMAIL}</span>
                </div>
              </div>

              {certifiedAlert ? (
                /* Confirmed Verification State */
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-emerald-900">
                          Evidence Officially Verified & Audit Signed
                        </div>
                        <div className="text-xs text-emerald-800">
                          {certifiedAlert.employerCompany} verified {proof.workerName}'s SkillProof ({proof.proofId}).
                        </div>
                        <div className="text-[11px] font-mono text-emerald-700 mt-0.5">
                          Email alert successfully dispatched to <strong>{certifiedAlert.to}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        id="btn-view-sent-email-alert"
                        onClick={() => setIsEmailModalOpen(true)}
                        className="flex-1 sm:flex-initial px-4 py-2 bg-[#10110F] hover:bg-black text-[#C8F169] text-xs font-mono font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>View Candidate Email Alert</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCertifiedAlert(null)}
                        className="px-3 py-2 bg-white hover:bg-stone-50 border border-emerald-300 text-emerald-900 text-xs font-mono rounded-xl transition-colors cursor-pointer"
                        title="Re-open form"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Interactive Verification Form */
                <form onSubmit={handleCertifyVerification} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-mono text-[11px] font-bold text-[#5C6057] mb-1">
                        Hiring Company / Organization
                      </label>
                      <input
                        type="text"
                        value={employerCompany}
                        onChange={(e) => setEmployerCompany(e.target.value)}
                        placeholder="e.g. Savile Row Bespoke Tailors"
                        required
                        className="w-full bg-white px-3 py-2 rounded-xl border border-[#292B27]/20 font-medium text-[#10110F] focus:outline-none focus:border-[#10110F]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] font-bold text-[#5C6057] mb-1">
                        Verifier Name & Title
                      </label>
                      <input
                        type="text"
                        value={employerVerifier}
                        onChange={(e) => setEmployerVerifier(e.target.value)}
                        placeholder="e.g. Arthur Pendelton"
                        required
                        className="w-full bg-white px-3 py-2 rounded-xl border border-[#292B27]/20 font-medium text-[#10110F] focus:outline-none focus:border-[#10110F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-mono text-[11px] font-bold text-[#5C6057] mb-1">
                        Employer Verifier Role
                      </label>
                      <input
                        type="text"
                        value={employerRole}
                        onChange={(e) => setEmployerRole(e.target.value)}
                        placeholder="e.g. Master Tailor & Head Cutter"
                        className="w-full bg-white px-3 py-2 rounded-xl border border-[#292B27]/20 font-medium text-[#10110F] focus:outline-none focus:border-[#10110F]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] font-bold text-[#5C6057] mb-1">
                        Verification Decision
                      </label>
                      <select
                        value={decision}
                        onChange={(e) => setDecision(e.target.value as any)}
                        className="w-full bg-white px-3 py-2 rounded-xl border border-[#292B27]/20 font-medium text-[#10110F] focus:outline-none focus:border-[#10110F]"
                      >
                        <option value="verified">Verified & Accepted as Qualified</option>
                        <option value="accepted_for_interview">Verified & Fast-Tracked for Work Assessment</option>
                        <option value="offer_extended">Verified & Job Trial Offer Initiated</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] font-bold text-[#5C6057] mb-1">
                      Evaluator Audit Notes (Included in Candidate Email Alert)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Workmanship verified. Needle threading and thread shank wrap meet atelier standards."
                      className="w-full bg-white px-3 py-2 rounded-xl border border-[#292B27]/20 text-xs font-medium text-[#10110F] focus:outline-none focus:border-[#10110F]"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#72766D]">
                      <Bell className="w-3.5 h-3.5 text-amber-600" />
                      <span>Triggers automated email notification to candidate inbox</span>
                    </div>

                    <button
                      type="submit"
                      id="btn-certify-employer-verification"
                      disabled={isCertifying}
                      className="bg-[#10110F] hover:bg-black text-[#C8F169] font-bold text-xs font-mono px-5 py-2.5 rounded-xl border border-[#C8F169]/40 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {isCertifying ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-[#C8F169] border-t-transparent rounded-full animate-spin" />
                          <span>Dispatching Alert...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-[#C8F169]" />
                          <span>Certify Verification & Dispatch Email Alert</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Observer Endorsements & Peer Attestations */}
          <div className="mt-6 pt-6 border-t border-[#292B27]/10">
            <ObserverEndorsements proof={proof} />
          </div>

          {/* Share Proof Bar */}
          <div className="mt-6 pt-6 border-t border-[#292B27]/10">
            <ShareProofBar
              proofId={proof.proofId}
              workerName={proof.workerName}
              variant="light"
              showQrOption={false}
              onOpenLinkedIn={() => setIsLinkedInModalOpen(true)}
            />
          </div>

          {/* Mandatory Trust Text (from Section 20 & 21) */}
          <div className="mt-8 pt-6 border-t border-[#292B27]/10 bg-black/[0.02] -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 p-6 sm:p-8">
            <p className="text-xs text-[#72766D] leading-relaxed text-center">
              <strong>Trust Notice: </strong>
              SkillProof records AI-observed evidence from a submitted work demonstration.
              It does not replace professional licensing or regulatory certification.
            </p>
          </div>
        </div>

        {/* QR Code Modal */}
        {showQrModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FCFBF7] rounded-2xl p-6 max-w-sm w-full border border-[#292B27]/20 shadow-2xl space-y-4 text-center">
              <div className="flex items-center justify-between border-b border-[#292B27]/10 pb-3">
                <span className="font-mono text-xs font-bold uppercase text-[#10110F]">
                  Verification QR Code
                </span>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="text-[#72766D] hover:text-[#10110F] text-sm font-bold"
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

                  {/* Center Proof Mark */}
                  <rect x="42" y="42" width="16" height="16" rx="3" fill="#10110F" />
                  <rect x="44" y="44" width="12" height="12" rx="2" fill="#C8F169" />

                  {/* Data matrix nodes */}
                  <rect x="36" y="8" width="8" height="6" />
                  <rect x="48" y="10" width="14" height="6" />
                  <rect x="36" y="20" width="6" height="8" />
                  <rect x="50" y="24" width="10" height="6" />

                  <rect x="8" y="38" width="6" height="12" />
                  <rect x="20" y="38" width="14" height="6" />
                  <rect x="10" y="54" width="18" height="6" />

                  <rect x="72" y="38" width="10" height="14" />
                  <rect x="86" y="42" width="6" height="18" />
                  <rect x="68" y="58" width="16" height="6" />

                  <rect x="38" y="68" width="8" height="14" />
                  <rect x="52" y="72" width="14" height="8" />
                  <rect x="44" y="86" width="22" height="6" />
                  <rect x="72" y="82" width="18" height="8" />
                </svg>
              </div>

              <div className="space-y-1">
                <div className="font-mono text-xs font-bold text-[#10110F]">{proof.proofId}</div>
                <div className="text-[11px] text-[#72766D]">
                  Scan to inspect evidence timeline instantly on any device
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isDownloadingPdf}
                  className="w-full py-2.5 px-3 bg-white border border-[#292B27]/20 text-[#10110F] text-xs font-mono font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:bg-stone-50 transition-colors"
                >
                  {pdfDownloaded ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      <span>PDF Downloaded!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-[#10110F]" />
                      <span>Download PDF Summary</span>
                    </>
                  )}
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={copyUrl}
                    className="flex-1 py-2.5 px-3 bg-[#10110F] hover:bg-black text-[#C8F169] text-xs font-mono font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQrModal(false)}
                    className="py-2.5 px-4 bg-black/5 hover:bg-black/10 text-[#10110F] text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Candidate Email Notification Alert Modal */}
        <EmailNotificationModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          highlightAlertId={certifiedAlert?.id}
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
