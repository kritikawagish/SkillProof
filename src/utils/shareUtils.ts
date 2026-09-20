/**
 * Utilities for generating and copying unique SkillProof share links.
 */

export function getProofShareUrl(proofId: string): string {
  if (typeof window === 'undefined') {
    return `https://skillproof.app/?verify=${proofId}`;
  }
  const url = new URL(window.location.href);
  url.searchParams.set('verify', proofId);
  return url.toString();
}

export interface LinkedInPostTemplateOptions {
  workerName: string;
  skillTitle: string;
  occupation: string;
  proofId: string;
  confidence: number;
  hash: string;
}

/**
 * Creates formatted post text highlighting the verified demonstration, rubric confidence, and tamper-evident proof URL.
 */
export function generateLinkedInPostText(options: LinkedInPostTemplateOptions): string {
  const shareUrl = getProofShareUrl(options.proofId);
  return `🎯 Proud to share my verified skill demonstration on SkillProof!\n\nI just earned my verified evidence record for "${options.skillTitle}" (${options.occupation}) with a ${options.confidence}% rubric confidence match.\n\nUnlike traditional self-reported claims, SkillProof uses continuous timed video verification, AI rubric matching, and tamper-evident SHA-256 evidence hashing to validate real-world technical ability.\n\n🔍 View the continuous single-take milestone video, rubric breakdown, and cryptographic proof here:\n${shareUrl}\n\n#SkillProof #ProofOfSkill #TechnicalCraft #${options.occupation.replace(/\s+/g, '')} #VerifiedSkills #Hiring #FutureOfWork`;
}

/**
 * Generates the official LinkedIn share URL opening LinkedIn's post composer with the proof link.
 */
export function getLinkedInShareUrl(proofId: string): string {
  const shareUrl = getProofShareUrl(proofId);
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
}

/**
 * Generates LinkedIn "Add to Profile" certification link
 * Uses LinkedIn's standard profile certification schema.
 */
export function getLinkedInAddCertificationUrl(options: {
  name: string; // Skill name
  organizationName: string;
  issueDate: string; // e.g. "2026-09"
  proofId: string;
}): string {
  const certUrl = getProofShareUrl(options.proofId);
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: `SkillProof: ${options.name}`,
    organizationName: options.organizationName || 'SkillProof Evidence Registry',
    issueYear: '2026',
    issueMonth: '9',
    certUrl: certUrl,
    certId: options.proofId,
  });

  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

export async function copyShareLink(textToCopy: string): Promise<boolean> {
  // If a proof ID like "SP-7F21D9" is passed instead of a full URL, convert it
  const url = textToCopy.startsWith('http') ? textToCopy : getProofShareUrl(textToCopy);

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch (err) {
    // Fall back to execCommand below
  }

  // Fallback for sandboxed iframe environments or unsecure contexts
  try {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}
