import { ArrowRight, ShieldCheck, CheckCircle2, Video, Cpu, Share2, Sparkles, Clock, FileCheck } from 'lucide-react';
import ProofCard from './ProofCard';
import ProofMark from './ProofMark';
import { DEFAULT_PROOF } from '../data/mockData';
import { AppScreen } from '../types';

interface LandingPageProps {
  onStartWorkflow: () => void;
  onOpenVerify: () => void;
  onOpenTimeline: () => void;
  onOpenAwsModal: () => void;
}

export default function LandingPage({
  onStartWorkflow,
  onOpenVerify,
  onOpenTimeline,
  onOpenAwsModal,
}: LandingPageProps) {
  return (
    <div id="screen-01-landing" className="min-h-screen bg-[#F4F1E8] text-[#292B27]">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10110F] text-white text-xs font-mono border border-[#C8F169]/40 shadow-xs">
              <ProofMark size={14} color="#C8F169" />
              <span className="text-[#C8F169] font-semibold">SkillProof</span>
              <span className="text-white/40">|</span>
              <span className="text-white/80">Future of Work & Digital Identity</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-extrabold text-[#10110F] tracking-tight leading-[1.08]">
                Your work speaks. <br />
                <span className="text-[#10110F] relative inline-block">
                  Now it carries proof.
                  <span className="absolute -bottom-1 left-0 w-full h-2 bg-[#C8F169] -z-10 rounded-sm" />
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-[#72766D] max-w-xl font-normal leading-relaxed">
                Turn a real demonstration of what you can do into portable evidence of your skills.
                Proof of work for people whose careers don’t live on LinkedIn.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                id="hero-create-skillproof-btn"
                onClick={onStartWorkflow}
                className="bg-[#10110F] text-[#C8F169] hover:bg-black font-bold text-base px-7 py-3.5 rounded-xl border border-[#C8F169]/40 shadow-lg hover:shadow-xl hover:translate-y-[-1px] transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span>Create a SkillProof</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-verify-proof-btn"
                onClick={onOpenVerify}
                className="bg-transparent hover:bg-[#292B27]/5 text-[#292B27] font-semibold text-base px-6 py-3.5 rounded-xl border border-[#292B27]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 text-[#72766D]" />
                <span>Verify a Proof</span>
              </button>
            </div>

            {/* Micro Credibility Notes */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#292B27]/10 text-xs font-mono text-[#72766D]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10110F]" />
                <span>Camera-to-Credential</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10110F]" />
                <span>Timestamped Proof</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10110F]" />
                <span>Zero Resumé Needed</span>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Floating Premium Skill Passport Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="w-full max-w-md relative">
              {/* Decorative Accent Glow & Stamp */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#10110F]/20 to-[#C8F169]/30 rounded-3xl blur-lg -z-10" />
              
              <div className="transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <ProofCard
                  proof={DEFAULT_PROOF}
                  onInspectTimeline={onOpenTimeline}
                  onShare={onOpenVerify}
                  interactive={true}
                />
              </div>

              {/* Floating Verified Pill */}
              <div className="absolute -bottom-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#292B27]/10 shadow-lg flex items-center gap-2 text-xs font-mono text-[#10110F]">
                <span className="w-2 h-2 rounded-full bg-[#10110F]" />
                <span className="font-semibold">Live Prototype Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Memorable Tagline Banner (from PDF Section 13-14) */}
      <section className="bg-[#10110F] text-[#FCFBF7] py-8 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#C8F169]">
                NO CV. NO DEGREE REQUIRED.
              </h2>
              <p className="text-lg font-bold text-white tracking-wide mt-0.5">
                JUST SHOW YOUR WORK.
              </p>
            </div>
            
            <button
              onClick={onStartWorkflow}
              className="bg-[#C8F169] text-[#10110F] hover:bg-[#b5e64e] font-extrabold text-sm px-6 py-3 rounded-lg transition-all shadow-md flex items-center gap-2"
            >
              <span>Try with 1-click demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* The User Problem & Core Idea (Section 1 & 3 of PDF) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#72766D] bg-[#292B27]/5 px-3 py-1 rounded-md">
            The Fundamental Problem
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10110F] mt-3 tracking-tight">
            From "Trust me, I can do it" to verifiable proof.
          </h2>
          <p className="text-[#72766D] mt-3 text-base">
            Traditional recruitment systems are optimized for paper certificates and English-language CVs.
            SkillProof reverses this by evaluating the craft itself.
          </p>
        </div>

        {/* Contrast Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Current Broken Workflow */}
          <div className="bg-[#FCFBF7] p-8 rounded-2xl border border-[#292B27]/10 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#292B27]/10">
              <span className="font-mono text-xs font-semibold text-rose-600 uppercase tracking-wider">
                Current Broken Workflow
              </span>
              <span className="text-xs text-[#72766D]">Opportunity Lost</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-black/[0.02] border border-black/5">
                <span className="font-semibold text-[#10110F]">Worker: </span>
                <span className="text-[#72766D]">"I know tailoring."</span>
              </div>
              <div className="p-3 rounded-lg bg-black/[0.02] border border-black/5">
                <span className="font-semibold text-[#10110F]">Employer: </span>
                <span className="text-[#72766D]">"How do I know?"</span>
              </div>
              <div className="p-3 rounded-lg bg-black/[0.02] border border-black/5">
                <span className="font-semibold text-[#10110F]">Worker: </span>
                <span className="text-[#72766D]">"I have been doing it for 8 years."</span>
              </div>
              <div className="p-3 rounded-lg bg-black/[0.02] border border-black/5">
                <span className="font-semibold text-[#10110F]">Employer: </span>
                <span className="text-[#72766D]">"Do you have a certificate?"</span>
              </div>
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-medium">
                Worker: "No." → <span className="font-bold">Application rejected.</span>
              </div>
            </div>
          </div>

          {/* SkillProof Workflow */}
          <div className="bg-[#10110F] text-white p-8 rounded-2xl border border-[#C8F169]/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="font-mono text-xs font-semibold text-[#C8F169] uppercase tracking-wider">
                SkillProof Workflow
              </span>
              <span className="text-xs text-[#C8F169]">Claim → Evidence</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-white/[0.04] border border-white/10">
                <span className="font-semibold text-[#C8F169]">Worker: </span>
                <span className="text-white/80">"I know tailoring."</span>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.04] border border-white/10">
                <span className="font-semibold text-[#C8F169]">SkillProof: </span>
                <span className="text-white font-medium">"Show us."</span>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.04] border border-white/10">
                <span className="font-semibold text-[#C8F169]">Worker: </span>
                <span className="text-white/80">Records a 45-second demonstration.</span>
              </div>
              <div className="p-3 rounded-lg bg-[#C8F169]/10 border border-[#C8F169]/30 text-[#C8F169] font-medium">
                AI extracts verified rubric milestones → <span className="font-bold">Passport Issued.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Three WOW Features (Section 7) */}
      <section className="bg-[#FCFBF7] py-20 border-t border-[#292B27]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#72766D] bg-[#292B27]/5 px-3 py-1 rounded-md">
              Core Capabilities
            </span>
            <h2 className="text-3xl font-extrabold text-[#10110F] mt-3 tracking-tight">
              Three Breakthrough Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* WOW 1: Camera-to-Credential */}
            <div className="p-8 rounded-2xl bg-[#F4F1E8] border border-[#292B27]/10 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#10110F] text-[#C8F169] flex items-center justify-center">
                  <Video className="w-6 h-6" />
                </div>
                <div className="font-mono text-xs text-[#72766D] uppercase">Feature 1</div>
                <h3 className="text-xl font-bold text-[#10110F]">Camera-to-Credential</h3>
                <p className="text-sm text-[#72766D] leading-relaxed">
                  The worker doesn’t fill a résumé. They demonstrate their skill on their smartphone. Multimodal AI transforms raw video into structured competency evidence.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#292B27]/10 font-mono text-xs text-[#10110F] font-semibold">
                Video → Structured JSON
              </div>
            </div>

            {/* WOW 2: Evidence Timeline */}
            <div className="p-8 rounded-2xl bg-[#10110F] text-white border border-[#C8F169]/40 flex flex-col justify-between shadow-lg">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 text-[#C8F169] flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="font-mono text-xs text-[#C8F169] uppercase">Feature 2</div>
                <h3 className="text-xl font-bold text-white">Evidence Timeline</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Instead of merely displaying "87%", employers can inspect exact video seconds where needle preparation, anchoring, and finishing knots were identified.
                </p>
              </div>
              <button
                onClick={onOpenTimeline}
                className="pt-6 mt-6 border-t border-white/10 font-mono text-xs text-[#C8F169] font-semibold flex items-center justify-between hover:underline"
              >
                <span>Inspect interactive sample</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* WOW 3: Public Proof Page */}
            <div className="p-8 rounded-2xl bg-[#F4F1E8] border border-[#292B27]/10 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#10110F] text-[#C8F169] flex items-center justify-center">
                  <Share2 className="w-6 h-6" />
                </div>
                <div className="font-mono text-xs text-[#72766D] uppercase">Feature 3</div>
                <h3 className="text-xl font-bold text-[#10110F]">Public Proof Page</h3>
                <p className="text-sm text-[#72766D] leading-relaxed">
                  Every successful demonstration receives an unalterable URL and QR code (`/verify/SP-7F21D9`) that employers open with zero login friction.
                </p>
              </div>
              <button
                onClick={onOpenVerify}
                className="pt-6 mt-6 border-t border-[#292B27]/10 font-mono text-xs text-[#10110F] font-semibold flex items-center justify-between hover:underline"
              >
                <span>View public verifier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#10110F] text-white py-12 border-t border-white/10 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <ProofMark size={20} color="#C8F169" />
            <span className="font-bold text-sm tracking-tight text-[#FCFBF7]">SkillProof</span>
            <span className="text-white/40">|</span>
            <span className="text-white/60">First Commit — Bharat Builds Tour 2026</span>
          </div>

          <div className="flex items-center gap-6 text-white/70">
            <button onClick={onOpenAwsModal} className="hover:text-[#C8F169] transition-colors">
              Serverless Architecture
            </button>
            <button onClick={onOpenVerify} className="hover:text-[#C8F169] transition-colors">
              Public Proof Verifier
            </button>
            <span>v1.0.0 (MVP)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
