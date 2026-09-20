import React from 'react';
import { Check, Sparkles, User, Camera, FileCheck, BrainCircuit, ShieldCheck, ChevronRight } from 'lucide-react';
import { AppScreen } from '../types';

export interface WorkflowStep {
  id: AppScreen;
  stepNumber: number;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'select_profession',
    stepNumber: 1,
    label: 'Select Trade',
    shortLabel: 'Trade',
    description: 'Select trade & competency rubric',
    icon: User,
  },
  {
    id: 'challenge',
    stepNumber: 2,
    label: 'Skill Challenge',
    shortLabel: 'Demonstrate',
    description: 'Perform real-world timed demonstration',
    icon: Camera,
  },
  {
    id: 'video_review',
    stepNumber: 3,
    label: 'Video Review',
    shortLabel: 'Review',
    description: 'Inspect clarity of hands & action evidence',
    icon: FileCheck,
  },
  {
    id: 'ai_analysis',
    stepNumber: 4,
    label: 'AI Audit Pipeline',
    shortLabel: 'AI Audit',
    description: 'Multimodal AWS rubric evaluation & hashing',
    icon: BrainCircuit,
  },
];

interface WorkflowProgressIndicatorProps {
  currentScreen: AppScreen;
  onNavigate?: (screen: AppScreen) => void;
  className?: string;
  compact?: boolean;
}

export default function WorkflowProgressIndicator({
  currentScreen,
  onNavigate,
  className = '',
  compact = false,
}: WorkflowProgressIndicatorProps) {
  // Only active during workflow screens
  const isWorkflowScreen =
    currentScreen === 'select_profession' ||
    currentScreen === 'challenge' ||
    currentScreen === 'video_review' ||
    currentScreen === 'ai_analysis';

  if (!isWorkflowScreen) {
    return null;
  }

  // Determine current active step index (0-based)
  const currentStepIndex = WORKFLOW_STEPS.findIndex((s) => s.id === currentScreen);
  const activeStepNum = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;
  const totalSteps = WORKFLOW_STEPS.length;
  const progressPercent = Math.round((activeStepNum / totalSteps) * 100);

  const isDarkTheme = currentScreen === 'ai_analysis';

  return (
    <div
      id="workflow-progress-indicator"
      aria-label="SkillProof Creation Progress"
      className={`w-full transition-colors duration-300 ${
        isDarkTheme
          ? 'bg-[#10110F] border-b border-white/10 text-white'
          : 'bg-[#FCFBF7] border-b border-[#292B27]/10 text-[#10110F]'
      } ${className}`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        {/* Top Summary Row */}
        <div className="flex items-center justify-between gap-3 mb-2.5 sm:mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isDarkTheme
                  ? 'bg-white/10 text-[#C8F169] border border-[#C8F169]/30'
                  : 'bg-[#10110F] text-[#C8F169]'
              }`}
            >
              Step 0{activeStepNum} of 0{totalSteps}
            </span>

            <span className={`text-xs font-semibold hidden sm:inline ${isDarkTheme ? 'text-white/80' : 'text-[#292B27]'}`}>
              {WORKFLOW_STEPS[currentStepIndex]?.label}: {WORKFLOW_STEPS[currentStepIndex]?.description}
            </span>
          </div>

          <div className="flex items-center gap-2 text-right">
            <span
              className={`text-xs font-mono font-bold ${
                isDarkTheme ? 'text-[#C8F169]' : 'text-[#10110F]'
              }`}
            >
              {progressPercent}% completed
            </span>
            <span
              className={`text-[11px] font-mono hidden md:inline ${
                isDarkTheme ? 'text-white/40' : 'text-[#72766D]'
              }`}
            >
              • {totalSteps - activeStepNum} {totalSteps - activeStepNum === 1 ? 'step' : 'steps'} remaining to proof
            </span>
          </div>
        </div>

        {/* Continuous Progress Bar with Gradient/Indicator */}
        <div
          className={`w-full h-1.5 rounded-full overflow-hidden mb-3.5 ${
            isDarkTheme ? 'bg-white/10' : 'bg-[#E5E0D5]'
          }`}
        >
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isDarkTheme
                ? 'bg-gradient-to-r from-[#C8F169] via-emerald-400 to-[#C8F169]'
                : 'bg-gradient-to-r from-[#10110F] via-emerald-800 to-[#10110F]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Interactive Step Track */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {WORKFLOW_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isPending = idx > currentStepIndex;
            const Icon = step.icon;

            // Allow clicking to go back to already visited steps
            const isClickable = Boolean(onNavigate && isCompleted && currentScreen !== 'ai_analysis');

            return (
              <div
                key={step.id}
                onClick={() => {
                  if (isClickable && onNavigate) {
                    onNavigate(step.id);
                  }
                }}
                className={`relative flex items-center gap-2 p-2 sm:p-2.5 rounded-xl transition-all border ${
                  isCurrent
                    ? isDarkTheme
                      ? 'bg-white/[0.08] border-[#C8F169] ring-2 ring-[#C8F169]/20 shadow-sm'
                      : 'bg-white border-[#10110F] ring-2 ring-[#10110F]/10 shadow-sm'
                    : isCompleted
                    ? isDarkTheme
                      ? 'bg-white/[0.04] border-emerald-500/30 text-white/90 hover:bg-white/[0.07] cursor-pointer'
                      : 'bg-[#F4F1E8]/70 border-[#292B27]/15 text-[#10110F] hover:bg-white cursor-pointer'
                    : isDarkTheme
                    ? 'bg-white/[0.02] border-white/5 text-white/30'
                    : 'bg-transparent border-[#292B27]/10 text-[#72766D]/60'
                }`}
                title={isClickable ? `Return to ${step.label}` : step.label}
              >
                {/* Step badge / status indicator */}
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg shrink-0 flex items-center justify-center font-mono font-bold text-xs transition-colors ${
                    isCurrent
                      ? isDarkTheme
                        ? 'bg-[#C8F169] text-[#10110F]'
                        : 'bg-[#10110F] text-[#C8F169]'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isDarkTheme
                      ? 'bg-white/5 text-white/30'
                      : 'bg-[#E5E0D5] text-[#72766D]'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <span>0{step.stepNumber}</span>
                  )}
                </div>

                {/* Step Text Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold truncate ${
                        isCurrent
                          ? isDarkTheme
                            ? 'text-white'
                            : 'text-[#10110F]'
                          : isCompleted
                          ? isDarkTheme
                            ? 'text-white/90'
                            : 'text-[#292B27]'
                          : isDarkTheme
                          ? 'text-white/40'
                          : 'text-[#72766D]'
                      }`}
                    >
                      <span className="hidden sm:inline">{step.label}</span>
                      <span className="sm:hidden">{step.shortLabel}</span>
                    </span>

                    {isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping hidden md:inline-block" />
                    )}
                  </div>

                  <div
                    className={`text-[10px] font-mono truncate hidden md:block ${
                      isCurrent
                        ? isDarkTheme
                          ? 'text-[#C8F169]'
                          : 'text-[#10110F] font-semibold'
                        : isCompleted
                        ? 'text-emerald-600 font-semibold'
                        : isDarkTheme
                        ? 'text-white/30'
                        : 'text-[#72766D]/70'
                    }`}
                  >
                    {isCurrent ? 'Current Step' : isCompleted ? 'Completed' : 'Upcoming'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
