import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ThumbsUp,
  Award,
  CheckCircle2,
  Users,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Plus,
  Check,
  Building,
  UserCheck,
  X,
} from 'lucide-react';
import { endorsementService, Endorsement } from '../services/endorsementService';
import { SkillProofRecord } from '../types';

interface ObserverEndorsementsProps {
  proof: SkillProofRecord;
  className?: string;
}

export default function ObserverEndorsements({ proof, className = '' }: ObserverEndorsementsProps) {
  const [endorsements, setEndorsements] = useState<Endorsement[]>([]);
  const [count, setCount] = useState<number>(0);
  const [hasEndorsed, setHasEndorsed] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [justEndorsedAnimation, setJustEndorsedAnimation] = useState<boolean>(false);

  // Form states for custom endorsement
  const [observerName, setObserverName] = useState('');
  const [observerRole, setObserverRole] = useState('Master Artisan / Quality Auditor');
  const [organization, setOrganization] = useState('');
  const [selectedAspect, setSelectedAspect] = useState(
    proof.competencies?.[0]?.name || 'Milestone Verification & Hand Dexterity'
  );
  const [comment, setComment] = useState('');

  useEffect(() => {
    // Initial load
    setEndorsements(endorsementService.getEndorsements(proof.proofId));
    setCount(endorsementService.getEndorsementCount(proof.proofId));
    setHasEndorsed(endorsementService.hasUserEndorsed(proof.proofId));

    // Subscribe to updates
    const unsub = endorsementService.subscribe((pid, newCount, list) => {
      if (pid === proof.proofId) {
        setCount(newCount);
        setEndorsements(list);
        setHasEndorsed(endorsementService.hasUserEndorsed(proof.proofId));
      }
    });

    return unsub;
  }, [proof.proofId]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#C8F169', '#10110F', '#10B981', '#F59E0B'],
      });
    } catch {
      // Fallback
    }
  };

  // Quick 1-Click Endorsement
  const handleQuickEndorse = () => {
    if (hasEndorsed) {
      // Allow undo
      endorsementService.removeUserEndorsement(proof.proofId);
      setHasEndorsed(false);
      return;
    }

    endorsementService.addEndorsement(
      proof.proofId,
      'Third-Party Observer',
      'Independent Industry Reviewer',
      'Verified Observer Network',
      proof.competencies?.[0]?.name || 'Milestone Accuracy & Hand Dexterity',
      'Audited continuous video execution. Endorses technique and standard adherence.'
    );
    setHasEndorsed(true);
    setJustEndorsedAnimation(true);
    triggerConfetti();
    setTimeout(() => setJustEndorsedAnimation(false), 1200);
  };

  // Detailed Custom Endorsement Submit
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    endorsementService.addEndorsement(
      proof.proofId,
      observerName || 'Third-Party Observer',
      observerRole || 'Quality Auditor',
      organization || 'Independent Artisan Guild',
      selectedAspect,
      comment || 'Demonstrated technical execution meets commercial craftsmanship benchmarks.'
    );
    setShowCustomModal(false);
    setHasEndorsed(true);
    setIsExpanded(true);
    setJustEndorsedAnimation(true);
    triggerConfetti();
    setTimeout(() => setJustEndorsedAnimation(false), 1200);
  };

  const topAspects = [
    { label: 'Milestone Integrity', pct: '98%' },
    { label: 'Dexterity & Fluidity', pct: '95%' },
    { label: 'Technique Standards', pct: '92%' },
  ];

  return (
    <div
      id="observer-endorsements-widget"
      className={`rounded-2xl border border-[#292B27]/15 bg-white p-5 shadow-sm text-[#10110F] ${className}`}
    >
      {/* Top Header & Endorsement Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#292B27]/10">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black transition-all ${
              hasEndorsed
                ? 'bg-[#10110F] text-[#C8F169] ring-4 ring-[#C8F169]/30'
                : 'bg-[#F4F1E8] text-[#10110F]'
            }`}
          >
            <Award className={`w-5 h-5 ${justEndorsedAnimation ? 'scale-125 transition-transform' : ''}`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                id="endorsement-count-display"
                className="text-2xl font-black font-mono tracking-tight text-[#10110F]"
              >
                {count}
              </span>
              <span className="text-sm font-bold text-[#10110F]">
                Observer Endorsements
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Peer Attestations</span>
              </span>
            </div>
            <p className="text-xs text-[#72766D] mt-0.5">
              Third-party guild masters, workshop leads, and observers who audited this demonstration
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick 1-Click Endorse Button */}
          <button
            type="button"
            id="btn-endorse-skill"
            onClick={handleQuickEndorse}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs font-mono flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
              hasEndorsed
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-500 ring-2 ring-emerald-300'
                : 'bg-[#10110F] hover:bg-black text-[#C8F169] border border-transparent'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${hasEndorsed ? 'fill-white' : ''}`} />
            <span>{hasEndorsed ? 'Skill Endorsed ✓' : 'Endorse Skill'}</span>
          </button>

          {/* Detailed Custom Endorsement Modal Trigger */}
          <button
            type="button"
            id="btn-open-custom-endorse"
            onClick={() => setShowCustomModal(true)}
            className="p-2.5 rounded-xl border border-[#292B27]/15 bg-[#F4F1E8]/70 hover:bg-[#F4F1E8] text-[#10110F] text-xs font-mono transition-colors cursor-pointer"
            title="Submit an official third-party observer evaluation"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Verified Peer Endorsement Metrics */}
      <div className="py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 overflow-hidden">
            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-[#10110F] text-[#C8F169] text-[10px] font-bold flex items-center justify-center">
              AP
            </div>
            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-[#5C6057] text-white text-[10px] font-bold flex items-center justify-center">
              ML
            </div>
            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-[#72766D] text-white text-[10px] font-bold flex items-center justify-center">
              KT
            </div>
            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-[#C8F169] text-[#10110F] text-[9px] font-bold flex items-center justify-center">
              +{count > 3 ? count - 3 : 1}
            </div>
          </div>
          <span className="text-[11px] font-mono text-[#5C6057]">
            Recent endorsements from Savile Row, Atelier de Paris, and Kansai Textile Guild
          </span>
        </div>

        {/* Aspect pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {topAspects.map((asp) => (
            <span
              key={asp.label}
              className="text-[10px] font-mono bg-[#F4F1E8] text-[#292B27] px-2 py-0.5 rounded-md border border-[#292B27]/10"
            >
              <strong>{asp.pct}</strong> {asp.label}
            </span>
          ))}
        </div>
      </div>

      {/* Expand/Collapse Endorsements list */}
      <div className="pt-2 border-t border-[#292B27]/10">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-1.5 text-xs font-mono text-[#5C6057] hover:text-[#10110F] flex items-center justify-between cursor-pointer transition-colors"
        >
          <span>
            {isExpanded ? 'Hide Observer Remarks' : `View ${endorsements.length} Observer Audits & Notes`}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isExpanded && (
          <div className="mt-3 space-y-2.5 pt-2">
            {endorsements.map((end) => (
              <div
                key={end.id}
                className={`p-3 rounded-xl border text-xs space-y-1.5 transition-colors ${
                  end.isUserSession
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-[#FCFBF7] border-[#292B27]/10 text-[#10110F]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-bold">{end.observerName}</span>
                    <span className="text-[#72766D] font-mono text-[11px]">
                      • {end.observerRole} {end.organization ? `(${end.organization})` : ''}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#72766D]">
                    {end.formattedDate}
                  </span>
                </div>

                {end.aspectEndorsed && (
                  <div className="text-[11px] font-mono text-[#5C6057]">
                    Endorsed aspect: <span className="font-semibold text-[#10110F]">{end.aspectEndorsed}</span>
                  </div>
                )}

                {end.comment && (
                  <p className="text-[11px] text-[#292B27] italic pl-2 border-l-2 border-[#292B27]/15">
                    "{end.comment}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Observer Endorsement Modal */}
      {showCustomModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          onClick={() => setShowCustomModal(false)}
        >
          <div
            className="bg-[#FCFBF7] rounded-3xl border border-[#292B27]/15 shadow-2xl max-w-lg w-full p-6 text-[#10110F] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#292B27]/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#10110F] text-[#C8F169] flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#10110F]">
                    Observer Skill Endorsement
                  </h3>
                  <p className="text-xs text-[#72766D]">
                    Attest to {proof.workerName}'s demonstrated craftsmanship
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-[#72766D] hover:text-[#10110F] p-1 rounded-lg hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] font-bold text-[#5C6057] mb-1">
                    Observer Name
                  </label>
                  <input
                    type="text"
                    value={observerName}
                    onChange={(e) => setObserverName(e.target.value)}
                    placeholder="e.g. Master Tailor James"
                    required
                    className="w-full bg-white px-3 py-2 rounded-xl border border-[#292B27]/20 font-medium text-[#10110F] focus:outline-none focus:border-[#10110F]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-bold text-[#5C6057] mb-1">
                    Observer Title / Role
                  </label>
                  <input
                    type="text"
                    value={observerRole}
                    onChange={(e) => setObserverRole(e.target.value)}
                    placeholder="e.g. Quality Auditor"
                    className="w-full bg-white px-3 py-2 rounded-xl border border-[#292B27]/20 font-medium text-[#10110F] focus:outline-none focus:border-[#10110F]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold text-[#5C6057] mb-1">
                  Guild, Workshop, or Organization
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. National Tailors Guild or Independent"
                  className="w-full bg-white px-3 py-2 rounded-xl border border-[#292B27]/20 font-medium text-[#10110F] focus:outline-none focus:border-[#10110F]"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold text-[#5C6057] mb-1">
                  Specific Competency Endorsed
                </label>
                <select
                  value={selectedAspect}
                  onChange={(e) => setSelectedAspect(e.target.value)}
                  className="w-full bg-white px-3 py-2 rounded-xl border border-[#292B27]/20 font-medium text-[#10110F] focus:outline-none focus:border-[#10110F]"
                >
                  {proof.competencies?.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                  <option value="Continuous Timeline Integrity">
                    Continuous Timeline & Video Integrity
                  </option>
                  <option value="Overall Hand Dexterity & Craftsmanship">
                    Overall Hand Dexterity & Craftsmanship
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold text-[#5C6057] mb-1">
                  Observer Attestation Note
                </label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g. Flawless stitch spacing and thread tension maintained throughout the 43-second timeline."
                  className="w-full bg-white px-3 py-2 rounded-xl border border-[#292B27]/20 font-medium text-[#10110F] focus:outline-none focus:border-[#10110F]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#292B27]/20 text-[#5C6057] hover:text-[#10110F] font-mono cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#10110F] text-[#C8F169] font-bold font-mono hover:bg-black transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Submit Observer Endorsement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
