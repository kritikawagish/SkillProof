export interface Endorsement {
  id: string;
  proofId: string;
  observerName: string;
  observerRole: string;
  organization?: string;
  timestamp: string;
  formattedDate: string;
  aspectEndorsed?: string;
  comment?: string;
  isUserSession?: boolean;
}

const STORAGE_KEY = 'skillproof_endorsements_v1';

// Pre-seeded authentic third-party observer endorsements for the demonstration
const INITIAL_ENDORSEMENTS: Record<string, Endorsement[]> = {
  'SP-7F21D9': [
    {
      id: 'end-001',
      proofId: 'SP-7F21D9',
      observerName: 'Arthur Pendelton',
      observerRole: 'Head Cutter & Master Tailor',
      organization: 'Savile Row Bespoke Guild',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      formattedDate: '2 days ago',
      aspectEndorsed: 'Thread Shank Clearance & 4-rotation wrap',
      comment: 'Demonstrates flawless shank height clearance suitable for 420gsm wool coating fabrics.',
    },
    {
      id: 'end-002',
      proofId: 'SP-7F21D9',
      observerName: 'Mireille Laurent',
      observerRole: 'Haute Couture Workshop Lead',
      organization: 'Atelier de Paris',
      timestamp: new Date(Date.now() - 86400000 * 1.2).toISOString(),
      formattedDate: 'Yesterday',
      aspectEndorsed: 'Double Needle Locking Knot Security',
      comment: 'Tension management across all 6 passes remains uniform with zero fabric puckering.',
    },
    {
      id: 'end-003',
      proofId: 'SP-7F21D9',
      observerName: 'Kenji Takahashi',
      observerRole: 'Quality & Craft Auditor',
      organization: 'Kansai Textile Guild',
      timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
      formattedDate: '6 hours ago',
      aspectEndorsed: 'Hand Dexterity & Fluidity',
      comment: 'Continuous non-stop execution. No hesitation or needle fumbling observed.',
    },
  ],
};

const BASE_OBSERVER_COUNT = 24; // Baseline community observer count to add social proof volume

class EndorsementService {
  private listeners: Array<(proofId: string, count: number, endorsements: Endorsement[]) => void> = [];

  public getEndorsements(proofId: string): Endorsement[] {
    if (typeof window === 'undefined') return INITIAL_ENDORSEMENTS[proofId] || [];
    try {
      const data = localStorage.getItem(`${STORAGE_KEY}_${proofId}`);
      if (data) {
        return JSON.parse(data);
      }
      // Return default seed if available
      const initial = INITIAL_ENDORSEMENTS[proofId] || [];
      this.saveEndorsements(proofId, initial);
      return initial;
    } catch {
      return INITIAL_ENDORSEMENTS[proofId] || [];
    }
  }

  public getEndorsementCount(proofId: string): number {
    const list = this.getEndorsements(proofId);
    // Baseline peer volume + explicitly logged observer cards
    const userSessionCount = list.filter((e) => e.isUserSession).length;
    const baseCount = proofId === 'SP-7F21D9' ? BASE_OBSERVER_COUNT : 4;
    return baseCount + userSessionCount;
  }

  public hasUserEndorsed(proofId: string): boolean {
    const list = this.getEndorsements(proofId);
    return list.some((e) => e.isUserSession);
  }

  public addEndorsement(
    proofId: string,
    observerName: string = 'Verified Third-Party Observer',
    observerRole: string = 'Craftsmanship Auditor',
    organization?: string,
    aspectEndorsed: string = 'Milestone Verification & Hand Dexterity',
    comment?: string
  ): Endorsement {
    const current = this.getEndorsements(proofId);

    // Check if already endorsed in this session
    const existing = current.find((e) => e.isUserSession);
    if (existing) {
      return existing;
    }

    const now = new Date();
    const newEndorsement: Endorsement = {
      id: `end-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      proofId,
      observerName: observerName.trim() || 'Third-Party Industry Observer',
      observerRole: observerRole.trim() || 'Craftsmanship Reviewer',
      organization: organization?.trim() || 'Independent Industry Observer',
      timestamp: now.toISOString(),
      formattedDate: 'Just now',
      aspectEndorsed,
      comment: comment?.trim() || 'Certified high-standard performance across continuous milestone execution.',
      isUserSession: true,
    };

    const updated = [newEndorsement, ...current];
    this.saveEndorsements(proofId, updated);
    return newEndorsement;
  }

  public removeUserEndorsement(proofId: string): void {
    const current = this.getEndorsements(proofId);
    const updated = current.filter((e) => !e.isUserSession);
    this.saveEndorsements(proofId, updated);
  }

  private saveEndorsements(proofId: string, items: Endorsement[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${STORAGE_KEY}_${proofId}`, JSON.stringify(items));
      const count = this.getEndorsementCount(proofId);
      this.notifyListeners(proofId, count, items);
      window.dispatchEvent(
        new CustomEvent('skillproof:endorsements_updated', {
          detail: { proofId, count, endorsements: items },
        })
      );
    } catch (err) {
      console.error('Failed to save endorsements', err);
    }
  }

  public subscribe(
    callback: (proofId: string, count: number, endorsements: Endorsement[]) => void
  ): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notifyListeners(proofId: string, count: number, items: Endorsement[]): void {
    this.listeners.forEach((cb) => {
      try {
        cb(proofId, count, items);
      } catch (e) {
        console.error('Endorsement listener error:', e);
      }
    });
  }
}

export const endorsementService = new EndorsementService();
