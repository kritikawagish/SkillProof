export interface Competency {
  id: string;
  name: string;
  label: string;
  description: string;
  observed: boolean;
  confidence: number;
  timestamp: number; // in seconds
  timestampDisplay: string; // e.g. "00:19"
  evidenceSnippet?: string;
}

export interface TimelineEvent {
  timestamp: number;
  timestampDisplay: string;
  title: string;
  description: string;
  competencyId: string;
  frameUrl?: string;
  status: 'verified' | 'needs_evidence';
}

export interface SkillProofRecord {
  proofId: string;
  workerName: string;
  workerTitle?: string;
  occupation: string;
  skill: string;
  skillTitle: string;
  taskDescription: string;
  confidence: number; // 0-100 or 0-1
  videoDuration: string; // e.g. "00:43"
  videoResolution: string; // e.g. "1080p"
  videoUrl: string;
  issuedDate: string; // e.g. "September 2026"
  createdAt: string;
  status: 'active' | 'insufficient_evidence' | 'invalid_task';
  failureReason?: string;
  competencies: Competency[];
  unobservedNotes?: string;
  timeline: TimelineEvent[];
  verificationHash: string;
  awsRegion: string;
  s3Bucket: string;
}

export interface Profession {
  id: string;
  name: string;
  description: string;
  iconName: string;
  enabled: boolean;
  activeChallengeTitle?: string;
  activeChallengeDuration?: string;
  totalCompetencies?: number;
}

export type AppScreen =
  | 'landing'
  | 'select_profession'
  | 'challenge'
  | 'video_review'
  | 'ai_analysis'
  | 'reveal'
  | 'timeline'
  | 'verify';
