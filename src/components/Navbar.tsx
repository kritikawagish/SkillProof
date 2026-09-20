import { ShieldCheck, Server, ArrowLeft, ExternalLink, Mail, Bell } from 'lucide-react';
import ProofMark from './ProofMark';
import { AppScreen } from '../types';

interface NavbarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onOpenAwsModal: () => void;
  onOpenVerifyModal: () => void;
  onOpenNotifications?: () => void;
  unreadAlertsCount?: number;
}

export default function Navbar({
  currentScreen,
  onNavigate,
  onOpenAwsModal,
  onOpenVerifyModal,
  onOpenNotifications,
  unreadAlertsCount = 0,
}: NavbarProps) {
  const isDarkScreen = currentScreen === 'ai_analysis';

  return (
    <header
      id="skillproof-navbar"
      className={`sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors duration-300 ${
        isDarkScreen
          ? 'bg-[#10110F]/90 border-white/10 text-white'
          : 'bg-[#F4F1E8]/90 border-[#292B27]/10 text-[#292B27]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-4">
          {currentScreen !== 'landing' && (
            <button
              id="nav-back-button"
              onClick={() => onNavigate('landing')}
              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium ${
                isDarkScreen
                  ? 'hover:bg-white/10 text-white/80 hover:text-white'
                  : 'hover:bg-black/5 text-[#72766D] hover:text-[#292B27]'
              }`}
              title="Return to home"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>
          )}

          <button
            id="nav-logo-button"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-[#10110F] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform border border-[#C8F169]/30">
              <ProofMark size={20} color="#C8F169" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className={`font-bold tracking-tight text-lg leading-none ${isDarkScreen ? 'text-white' : 'text-[#10110F]'}`}>
                  SkillProof
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-[#10110F] text-[#C8F169] border border-[#C8F169]/30 uppercase tracking-wider">
                  2026
                </span>
              </div>
              <span className={`text-[11px] font-medium hidden sm:block ${isDarkScreen ? 'text-white/50' : 'text-[#72766D]'}`}>
                Portable Evidence Layer
              </span>
            </div>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <button
            id="nav-link-how-it-works"
            onClick={() => onNavigate('landing')}
            className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors hidden md:block ${
              isDarkScreen ? 'text-white/70 hover:text-white' : 'text-[#72766D] hover:text-[#292B27]'
            }`}
          >
            How it works
          </button>

          <button
            id="nav-link-for-employers"
            onClick={onOpenVerifyModal}
            className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              isDarkScreen ? 'text-white/70 hover:text-white' : 'text-[#72766D] hover:text-[#292B27]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#72766D]" />
            <span>Verify Proof</span>
          </button>

          <button
            id="nav-link-aws-architecture"
            onClick={onOpenAwsModal}
            className={`text-sm font-mono px-2.5 py-1.5 rounded-md border transition-all flex items-center gap-1.5 ${
              isDarkScreen
                ? 'border-white/15 bg-white/5 text-white/90 hover:bg-white/10'
                : 'border-[#292B27]/15 bg-black/5 text-[#292B27] hover:bg-black/10'
            }`}
            title="View Serverless AWS Architecture & Rubric Pipeline"
          >
            <Server className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">AWS Architecture</span>
            <span className="sm:hidden">AWS</span>
          </button>

          {/* Email Notification Alerts Button */}
          {onOpenNotifications && (
            <button
              id="nav-alerts-button"
              onClick={onOpenNotifications}
              className={`p-2 rounded-lg relative transition-all border flex items-center justify-center cursor-pointer ${
                isDarkScreen
                  ? 'border-white/15 bg-white/5 text-white/90 hover:bg-white/10'
                  : 'border-[#292B27]/15 bg-black/5 text-[#292B27] hover:bg-black/10'
              }`}
              title="View Candidate Email Alerts (Mock Notification Service)"
            >
              <Mail className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white font-mono text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
            </button>
          )}

          {currentScreen !== 'select_profession' && currentScreen !== 'challenge' && (
            <button
              id="nav-cta-create-skillproof"
              onClick={() => onNavigate('select_profession')}
              className="bg-[#10110F] text-[#C8F169] hover:bg-black hover:shadow-md transition-all font-medium text-sm px-4 py-2 rounded-lg border border-[#C8F169]/30 flex items-center gap-2"
            >
              <span>Create my SkillProof</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
