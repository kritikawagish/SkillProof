import React, { useState } from 'react';
import {
  FileText,
  Download,
  Check,
  FileCode,
  FileSpreadsheet,
  ExternalLink,
  ShieldCheck,
  Award,
  Users,
  Clock,
  Sparkles,
  Copy,
  Eye,
  X,
  Share2,
} from 'lucide-react';
import { SkillProofRecord } from '../types';
import {
  buildProofResumeData,
  exportProofResumeJson,
  exportProofResumePdf,
} from '../utils/resumeExport';
import { copyShareLink } from '../utils/shareUtils';
import { endorsementService } from '../services/endorsementService';

interface ProofResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  proof: SkillProofRecord;
}

export default function ProofResumeModal({
  isOpen,
  onClose,
  proof,
}: ProofResumeModalProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'json'>('preview');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [jsonSuccess, setJsonSuccess] = useState(false);

  if (!isOpen) return null;

  const resumeData = buildProofResumeData(proof);
  const jsonOutput = JSON.stringify(resumeData, null, 2);
  const endorsementCount = endorsementService.getEndorsementCount(proof.proofId);
  const verifiedCount = proof.competencies.filter((c) => c.observed).length;

  const handleDownloadPdf = () => {
    try {
      setIsExportingPdf(true);
      setTimeout(() => {
        exportProofResumePdf(proof);
        setIsExportingPdf(false);
        setPdfSuccess(true);
        setTimeout(() => setPdfSuccess(false), 3000);
      }, 200);
    } catch (e) {
      console.error(e);
      setIsExportingPdf(false);
    }
  };

  const handleDownloadJson = () => {
    try {
      exportProofResumeJson(proof);
      setJsonSuccess(true);
      setTimeout(() => setJsonSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyJson = async () => {
    const ok = await copyShareLink(jsonOutput);
    if (ok) {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2500);
    }
  };

  return (
    <div
      id="proof-resume-modal"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#FCFBF7] rounded-3xl border border-[#292B27]/15 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col text-[#10110F] overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-[#292B27]/10 bg-white flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#10110F] text-[#C8F169] flex items-center justify-center font-bold shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-[#10110F]">
                  Export Comprehensive Proof Resume
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10110F] text-[#C8F169] font-bold">
                  PDF & JSON
                </span>
              </div>
              <p className="text-xs text-[#72766D] mt-0.5">
                Consolidated cryptographic evidence passport for job applications & employer reviews
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

        {/* Tab Selection */}
        <div className="flex items-center justify-between px-6 pt-3 pb-2 border-b border-[#292B27]/10 bg-[#F4F1E8]/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-[#10110F] text-[#C8F169] shadow-xs'
                  : 'text-[#5C6057] hover:text-[#10110F]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Resume Summary</span>
            </button>

            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'json'
                  ? 'bg-[#10110F] text-[#C8F169] shadow-xs'
                  : 'text-[#5C6057] hover:text-[#10110F]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Raw JSON Data</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-[#72766D] hidden sm:block">
            Record: {proof.proofId}
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          {activeTab === 'preview' ? (
            <div className="space-y-4">
              {/* Candidate Card */}
              <div className="bg-white rounded-2xl border border-[#292B27]/15 p-4 space-y-2.5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#292B27]/10 pb-2.5">
                  <div>
                    <h4 className="text-base font-extrabold text-[#10110F]">
                      {resumeData.candidate.name}
                    </h4>
                    <p className="text-[#5C6057] font-mono text-xs">
                      {resumeData.candidate.headline} • {proof.occupation}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[11px] font-bold self-start sm:self-auto">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cryptographically Audited</span>
                  </div>
                </div>

                <p className="text-xs text-[#5C6057] leading-relaxed">
                  {resumeData.candidate.profileSummary}
                </p>

                {/* Metric Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="bg-[#F4F1E8] p-2.5 rounded-xl border border-[#292B27]/10">
                    <span className="text-[10px] font-mono text-[#72766D] block">VERIFIED SKILLS</span>
                    <span className="font-mono text-sm font-bold text-[#10110F]">
                      1 Specialization
                    </span>
                  </div>
                  <div className="bg-[#F4F1E8] p-2.5 rounded-xl border border-[#292B27]/10">
                    <span className="text-[10px] font-mono text-[#72766D] block">RUBRIC MATCH</span>
                    <span className="font-mono text-sm font-bold text-emerald-700">
                      {proof.confidence}%
                    </span>
                  </div>
                  <div className="bg-[#F4F1E8] p-2.5 rounded-xl border border-[#292B27]/10">
                    <span className="text-[10px] font-mono text-[#72766D] block">COMPETENCIES</span>
                    <span className="font-mono text-sm font-bold text-[#10110F]">
                      {verifiedCount} / {proof.competencies.length} Passed
                    </span>
                  </div>
                  <div className="bg-[#F4F1E8] p-2.5 rounded-xl border border-[#292B27]/10">
                    <span className="text-[10px] font-mono text-[#72766D] block">ENDORSEMENTS</span>
                    <span className="font-mono text-sm font-bold text-[#10110F]">
                      {endorsementCount} Observers
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified Demonstrations List */}
              <div className="bg-white rounded-2xl border border-[#292B27]/15 p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold uppercase text-[11px] text-[#72766D]">
                    Demonstrated Skill & Timeline Evidence
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {proof.videoDuration} Continuous Single Take
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#FCFBF7] border border-[#292B27]/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#10110F]">{proof.skillTitle}</span>
                    <span className="font-mono text-[11px] text-[#72766D]">{proof.proofId}</span>
                  </div>
                  <p className="text-[11px] text-[#5C6057]">{proof.taskDescription}</p>

                  {/* Competency tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proof.competencies.map((comp) => (
                      <span
                        key={comp.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-[#292B27]/10 font-mono text-[10px] text-[#292B27]"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>{comp.label}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Timeline Evidence Sequence */}
                <div>
                  <span className="font-mono text-[11px] font-bold text-[#5C6057] block mb-1.5">
                    Continuous Video Milestone Timestamps
                  </span>
                  <div className="space-y-1.5">
                    {proof.timeline.map((evt) => (
                      <div
                        key={evt.timestamp}
                        className="flex items-center justify-between p-2 rounded-lg bg-[#F4F1E8]/60 border border-[#292B27]/5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-[#10110F] text-[#C8F169] font-mono font-bold text-[10px]">
                            {evt.timestampDisplay}
                          </span>
                          <span className="font-bold text-[11px] text-[#10110F]">{evt.title}</span>
                        </div>
                        <span className="text-[11px] text-[#72766D] truncate max-w-[240px]">
                          {evt.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#72766D]">
                  Application-Ready JSON Schema (ATS & HRIS Compatible)
                </span>
                <button
                  onClick={handleCopyJson}
                  className="px-2.5 py-1 rounded-lg border border-[#292B27]/15 bg-white hover:bg-stone-100 font-mono text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-[#10110F] text-[#C8F169] p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-[360px] border border-[#292B27]/20 selection:bg-white selection:text-[#10110F]">
                <pre>{jsonOutput}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Primary Download Actions */}
        <div className="p-4 sm:p-5 border-t border-[#292B27]/10 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-[#72766D] text-center sm:text-left">
            <span>Official proof record with verified audit trails & SHA-256 hash</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Download JSON Button */}
            <button
              id="btn-download-resume-json"
              onClick={handleDownloadJson}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-[#292B27]/20 bg-[#FCFBF7] hover:bg-white text-[#10110F] font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              {jsonSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  <span>JSON Downloaded</span>
                </>
              ) : (
                <>
                  <FileCode className="w-3.5 h-3.5 text-[#10110F]" />
                  <span>Download JSON</span>
                </>
              )}
            </button>

            {/* Download PDF Button */}
            <button
              id="btn-download-resume-pdf"
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#10110F] hover:bg-black text-[#C8F169] font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              {isExportingPdf ? (
                <span>Generating PDF...</span>
              ) : pdfSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>PDF Downloaded ✓</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Proof Resume (PDF)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
