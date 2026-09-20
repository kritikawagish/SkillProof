import { getProofShareUrl } from '../utils/shareUtils';

export interface EmployerVerificationEvent {
  proofId: string;
  workerName: string;
  workerEmail?: string;
  employerName: string;
  employerCompany: string;
  employerTitle?: string;
  decision?: 'verified' | 'accepted_for_interview' | 'offer_extended';
  notes?: string;
}

export interface EmailAlert {
  id: string;
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  headline: string;
  proofId: string;
  workerName: string;
  employerCompany: string;
  employerVerifier: string;
  employerTitle: string;
  decision: string;
  decisionLabel: string;
  notes: string;
  verificationUrl: string;
  timestamp: string;
  formattedDate: string;
  read: boolean;
}

const STORAGE_KEY = 'skillproof_email_notifications_v1';
export const DEFAULT_USER_EMAIL = '2024ugmm011@nitjsr.ac.in';

class MockNotificationService {
  private listeners: Array<(notifications: EmailAlert[]) => void> = [];

  constructor() {
    // If empty, initialize with an initial welcome notification to show the alert channel is active
    if (typeof window !== 'undefined') {
      const existing = this.getNotifications();
      if (existing.length === 0) {
        const welcomeNotification: EmailAlert = {
          id: 'alert-welcome-001',
          to: DEFAULT_USER_EMAIL,
          from: 'SkillProof Trust System <alerts@skillproof.org>',
          replyTo: 'support@skillproof.org',
          subject: '⚡ SkillProof Alert Channel Active (SP-7F21D9)',
          headline: 'Your SkillProof Alert Service is Configured',
          proofId: 'SP-7F21D9',
          workerName: 'Elena Rostova',
          employerCompany: 'SkillProof Verification Network',
          employerVerifier: 'Automated Event Dispatcher',
          employerTitle: 'System Service',
          decision: 'service_ready',
          decisionLabel: 'Alert Service Active',
          notes: 'Whenever an employer, auditor, or hiring atelier verifies your skill demonstration, you will instantly receive an email alert with their verification signature and decision notes.',
          verificationUrl: getProofShareUrl('SP-7F21D9'),
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          formattedDate: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: true,
        };
        this.saveNotifications([welcomeNotification]);
      }
    }
  }

  public getNotifications(): EmailAlert[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveNotifications(items: EmailAlert[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      this.notifyListeners(items);
      // Dispatch browser custom event for cross-component responsiveness
      window.dispatchEvent(new CustomEvent('skillproof:notification_update', { detail: items }));
    } catch (e) {
      console.error('Failed to persist notifications', e);
    }
  }

  public subscribe(callback: (notifications: EmailAlert[]) => void): () => void {
    this.listeners.push(callback);
    callback(this.getNotifications());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notifyListeners(notifications: EmailAlert[]): void {
    this.listeners.forEach((callback) => {
      try {
        callback(notifications);
      } catch (err) {
        console.error('Notification listener error:', err);
      }
    });
  }

  /**
   * Triggers an email alert to the candidate/user when an employer verifies their proof record.
   */
  public async triggerEmployerVerificationNotification(
    event: EmployerVerificationEvent
  ): Promise<EmailAlert> {
    // Simulate real network dispatch latency (350ms)
    await new Promise((resolve) => setTimeout(resolve, 350));

    const recipient = event.workerEmail || DEFAULT_USER_EMAIL;
    const now = new Date();
    const id = `alert-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    let decisionLabel = 'Evidence Formally Verified & Approved';
    if (event.decision === 'accepted_for_interview') {
      decisionLabel = 'Verified & Fast-Tracked for Work Assessment';
    } else if (event.decision === 'offer_extended') {
      decisionLabel = 'Verified & Job Trial Offer Initiated';
    }

    const newAlert: EmailAlert = {
      id,
      to: recipient,
      from: 'SkillProof Verification Alerts <verify-alerts@skillproof.org>',
      replyTo: `verifications@${event.employerCompany.toLowerCase().replace(/[^a-z0-9]/g, '') || 'atelier'}.com`,
      subject: `🎉 Skill Verified: ${event.employerCompany} confirmed your SkillProof [${event.proofId}]`,
      headline: `${event.employerCompany} has verified your evidence record`,
      proofId: event.proofId,
      workerName: event.workerName,
      employerCompany: event.employerCompany,
      employerVerifier: event.employerName,
      employerTitle: event.employerTitle || 'Master Artisan & Hiring Lead',
      decision: event.decision || 'verified',
      decisionLabel,
      notes:
        event.notes ||
        'Inspected all 5 continuous timeline milestones. Hand dexterity, knot tension, and thread shank clearance verified to commercial tailoring standards.',
      verificationUrl: getProofShareUrl(event.proofId),
      timestamp: now.toISOString(),
      formattedDate: `${now.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      read: false,
    };

    const current = this.getNotifications();
    const updated = [newAlert, ...current];
    this.saveNotifications(updated);

    return newAlert;
  }

  public markAsRead(id: string): void {
    const current = this.getNotifications();
    const updated = current.map((item) => (item.id === id ? { ...item, read: true } : item));
    this.saveNotifications(updated);
  }

  public markAllAsRead(): void {
    const current = this.getNotifications();
    const updated = current.map((item) => ({ ...item, read: true }));
    this.saveNotifications(updated);
  }

  public getUnreadCount(): number {
    return this.getNotifications().filter((n) => !n.read).length;
  }
}

export const notificationService = new MockNotificationService();
