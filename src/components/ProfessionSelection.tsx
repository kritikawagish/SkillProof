import { Scissors, UtensilsCrossed, Hammer, Zap, Wrench, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { PROFESSIONS } from '../data/mockData';
import { Profession } from '../types';

interface ProfessionSelectionProps {
  onSelectProfession: (profession: Profession) => void;
  onBack: () => void;
}

export default function ProfessionSelection({
  onSelectProfession,
  onBack,
}: ProfessionSelectionProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scissors':
        return <Scissors className="w-6 h-6" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-6 h-6" />;
      case 'Hammer':
        return <Hammer className="w-6 h-6" />;
      case 'Zap':
        return <Zap className="w-6 h-6" />;
      case 'Wrench':
        return <Wrench className="w-6 h-6" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      default:
        return <Scissors className="w-6 h-6" />;
    }
  };

  return (
    <div id="screen-02-profession" className="min-h-screen bg-[#F4F1E8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Step Pill */}
        <div className="flex items-center justify-between mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10110F] text-[#C8F169] text-xs font-mono">
            <span>STEP 01 OF 04</span>
            <span>•</span>
            <span>OCCUPATION</span>
          </div>

          <button
            onClick={onBack}
            className="text-xs font-mono text-[#72766D] hover:text-[#10110F] underline cursor-pointer"
          >
            ← Back to overview
          </button>
        </div>

        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#10110F] tracking-tight">
            What can you show us?
          </h1>
          <p className="text-base sm:text-lg text-[#72766D] mt-3 max-w-xl">
            Choose your trade. You will be asked to demonstrate a single, observable, real-world task in under 60 seconds.
          </p>
        </div>

        {/* Profession Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROFESSIONS.map((prof) => {
            if (prof.enabled) {
              return (
                <button
                  key={prof.id}
                  id={`profession-card-${prof.id}`}
                  onClick={() => onSelectProfession(prof)}
                  className="group relative p-6 rounded-2xl bg-[#10110F] text-white border-2 border-[#C8F169] shadow-xl hover:shadow-2xl transition-all duration-200 text-left flex flex-col justify-between cursor-pointer hover:translate-y-[-2px]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-[#C8F169] text-[#10110F] flex items-center justify-center font-bold">
                        {getIcon(prof.iconName)}
                      </div>
                      <span className="text-[11px] font-mono uppercase bg-[#C8F169]/20 text-[#C8F169] px-2 py-0.5 rounded-sm border border-[#C8F169]/40 font-semibold">
                        Ready to Test
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-[#C8F169] transition-colors">
                        {prof.name}
                      </h3>
                      <p className="text-xs text-white/70 mt-1.5 leading-relaxed">
                        {prof.description}
                      </p>
                    </div>

                    {prof.activeChallengeTitle && (
                      <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 space-y-1">
                        <div className="text-[10px] font-mono text-[#C8F169] uppercase">Active Challenge</div>
                        <div className="text-xs font-semibold text-white">
                          {prof.activeChallengeTitle}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#C8F169]">
                    <span>Start 45s challenge</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            }

            return (
              <div
                key={prof.id}
                id={`profession-card-${prof.id}-disabled`}
                className="p-6 rounded-2xl bg-[#FCFBF7] border border-[#292B27]/10 opacity-75 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-black/5 text-[#72766D] flex items-center justify-center">
                      {getIcon(prof.iconName)}
                    </div>
                    <span className="text-[11px] font-mono uppercase text-[#72766D] bg-black/5 px-2 py-0.5 rounded-sm flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Coming next</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#10110F]">{prof.name}</h3>
                    <p className="text-xs text-[#72766D] mt-1.5 leading-relaxed">
                      {prof.description}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-[#292B27]/10 text-[11px] font-mono text-[#72766D]">
                  Skill pack expanding in Bharat Tour Q4
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
