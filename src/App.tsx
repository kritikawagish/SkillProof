import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ProfessionSelection from './components/ProfessionSelection';
import SkillChallenge from './components/SkillChallenge';
import VideoReview from './components/VideoReview';
import AiAnalysisScreen from './components/AiAnalysisScreen';
import TheRevealScreen from './components/TheRevealScreen';
import EvidenceTimelineScreen from './components/EvidenceTimelineScreen';
import EmployerVerificationScreen from './components/EmployerVerificationScreen';
import AwsArchitectureModal from './components/AwsArchitectureModal';
import VerifyModal from './components/VerifyModal';
import JudgePitchBar from './components/JudgePitchBar';
import EmailNotificationModal from './components/EmailNotificationModal';
import WorkflowProgressIndicator from './components/WorkflowProgressIndicator';

import { DEFAULT_PROOF, SAMPLE_VIDEO_URL } from './data/mockData';
import { AppScreen, SkillProofRecord, Profession } from './types';
import { notificationService } from './services/notificationService';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('landing');
  const [currentProof, setCurrentProof] = useState<SkillProofRecord>(DEFAULT_PROOF);
  const [capturedVideoUrl, setCapturedVideoUrl] = useState<string>(SAMPLE_VIDEO_URL);
  const [capturedDuration, setCapturedDuration] = useState<number>(43);
  const [testMode, setTestMode] = useState<'normal' | 'unclear' | 'wrong_task'>('normal');

  // Modals
  const [isAwsModalOpen, setIsAwsModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0);

  // Subscribe to notification updates
  useEffect(() => {
    const unsub = notificationService.subscribe((items) => {
      setUnreadAlertsCount(items.filter((i) => !i.read).length);
    });
    return unsub;
  }, []);

  // Check URL params for direct ?verify=SP-7F21D9 links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verifyId = params.get('verify') || params.get('proof');
    if (verifyId) {
      const cleanId = verifyId.trim().toUpperCase();
      setCurrentProof((prev) => ({
        ...prev,
        proofId: cleanId,
      }));
      setCurrentScreen('verify');
    }
  }, []);

  // Handlers for state transitions
  const handleSelectProfession = (profession: Profession) => {
    setCurrentScreen('challenge');
  };

  const handleVideoCaptured = (videoUrl: string, duration: number, workerName: string) => {
    setCapturedVideoUrl(videoUrl);
    setCapturedDuration(duration);
    setCurrentProof((prev) => ({
      ...prev,
      videoUrl: videoUrl,
      workerName: workerName || 'Kritika W.',
      videoDuration: duration >= 60 ? '01:00' : `00:${duration < 10 ? '0' : ''}${duration}`,
    }));
    setCurrentScreen('video_review');
  };

  const handleConfirmEvidence = (selectedScenario: 'normal' | 'unclear' | 'wrong_task') => {
    setTestMode(selectedScenario);
    setCurrentScreen('ai_analysis');
  };

  const handleAnalysisComplete = () => {
    setCurrentScreen('reveal');
  };

  const handleVerifyProofId = (proofId: string) => {
    if (proofId) {
      const cleanId = proofId.trim().toUpperCase();
      setCurrentProof((prev) => ({
        ...prev,
        proofId: cleanId,
      }));
    }
    setCurrentScreen('verify');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F4F1E8] text-[#292B27]">
      {/* Top Navbar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onOpenAwsModal={() => setIsAwsModalOpen(true)}
        onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
        onOpenNotifications={() => setIsEmailModalOpen(true)}
        unreadAlertsCount={unreadAlertsCount}
      />

      {/* Visual Workflow Progress Indicator (From Profession Selection to AI Analysis) */}
      <WorkflowProgressIndicator
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
      />

      {/* Main Screen Router */}
      <main className="flex-1 pb-16">
        {currentScreen === 'landing' && (
          <LandingPage
            onStartWorkflow={() => setCurrentScreen('select_profession')}
            onOpenVerify={() => setCurrentScreen('verify')}
            onOpenTimeline={() => setCurrentScreen('timeline')}
            onOpenAwsModal={() => setIsAwsModalOpen(true)}
          />
        )}

        {currentScreen === 'select_profession' && (
          <ProfessionSelection
            onSelectProfession={handleSelectProfession}
            onBack={() => setCurrentScreen('landing')}
          />
        )}

        {currentScreen === 'challenge' && (
          <SkillChallenge
            onVideoCaptured={handleVideoCaptured}
            onBack={() => setCurrentScreen('select_profession')}
          />
        )}

        {currentScreen === 'video_review' && (
          <VideoReview
            videoUrl={capturedVideoUrl}
            durationSeconds={capturedDuration}
            workerName={currentProof.workerName}
            onConfirmEvidence={handleConfirmEvidence}
            onRecordAgain={() => setCurrentScreen('challenge')}
          />
        )}

        {currentScreen === 'ai_analysis' && (
          <AiAnalysisScreen
            workerName={currentProof.workerName}
            testMode={testMode}
            onComplete={handleAnalysisComplete}
          />
        )}

        {currentScreen === 'reveal' && (
          <TheRevealScreen
            proof={currentProof}
            testMode={testMode}
            onViewEvidenceTimeline={() => setCurrentScreen('timeline')}
            onOpenPublicVerification={() => setCurrentScreen('verify')}
            onRecordAgain={() => setCurrentScreen('challenge')}
          />
        )}

        {currentScreen === 'timeline' && (
          <EvidenceTimelineScreen
            proof={currentProof}
            onBack={() => setCurrentScreen('reveal')}
            onOpenPublicVerification={() => setCurrentScreen('verify')}
          />
        )}

        {currentScreen === 'verify' && (
          <EmployerVerificationScreen
            proof={currentProof}
            onInspectEvidence={() => setCurrentScreen('timeline')}
            onBackToApp={() => setCurrentScreen('landing')}
          />
        )}
      </main>

      {/* Persistent Bottom Presentation Dock for Hackathon Judges */}
      <JudgePitchBar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onOpenAwsModal={() => setIsAwsModalOpen(true)}
      />

      {/* Modals */}
      <AwsArchitectureModal
        isOpen={isAwsModalOpen}
        onClose={() => setIsAwsModalOpen(false)}
      />

      <VerifyModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onVerifyProofId={handleVerifyProofId}
      />

      {/* Global Email Alerts Modal */}
      <EmailNotificationModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onOpenVerification={(proofId) => handleVerifyProofId(proofId)}
      />
    </div>
  );
}
