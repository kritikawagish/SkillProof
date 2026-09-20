import React from 'react';
import { Layers, Server, Play, ShieldCheck, Sparkles, Video, Clock } from 'lucide-react';
import { AppScreen } from '../types';

interface JudgePitchBarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onOpenAwsModal: () => void;
}

export default function JudgePitchBar({
  currentScreen,
  onNavigate,
  onOpenAwsModal,
}: JudgePitchBarProps) {
  const screens: { id: AppScreen; label: string; number: string }[] = [
    { id: 'landing', label: 'Home', number: '01' },
    { id: 'select_profession', label: 'Trades', number: '02' },
    { id: 'challenge', label: 'Prompt', number: '03' },
    { id: 'video_review', label: 'Review', number: '04' },
    { id: 'ai_analysis', label: 'AI Read', number: '05' },
    { id: 'reveal', label: 'Reveal', number: '06' },
    { id: 'timeline', label: 'Timeline', number: '07' },
    { id: 'verify', label: 'Employer', number: '08' },
  ];

  return (
    <aside
      id="judge-presentation-dock"
      aria-label="Hackathon Judge & Presentation Navigation"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-full px-2"
    >
      <div className="bg-[#10110F]/95 text-white backdrop-blur-md px-3 py-2 rounded-2xl border border-white/15 shadow-2xl flex items-center gap-1 sm:gap-2">
        <div className="hidden md:flex items-center gap-1.5 px-2 border-r border-white/15 font-mono text-[10px] text-[#C8F169]">
          <Sparkles className="w-3 h-3" />
          <span className="font-bold">PROTOTYPE NAV</span>
        </div>

        {/* Screen Jump Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {screens.map((s) => {
            const isCurrent = currentScreen === s.id;
            return (
              <button
                key={s.id}
                id={`dock-screen-btn-${s.id}`}
                onClick={() => onNavigate(s.id)}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#C8F169] text-[#10110F] font-bold shadow-xs'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                title={`Jump to ${s.label}`}
              >
                <span className="opacity-50 text-[9px] hidden sm:inline">{s.number}</span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* AWS Architecture Shortcut */}
        <div className="pl-1 border-l border-white/15">
          <button
            id="dock-aws-shortcut"
            onClick={onOpenAwsModal}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
            title="Inspect Serverless Architecture"
          >
            <Server className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">AWS</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
