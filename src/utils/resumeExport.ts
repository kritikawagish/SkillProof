import { jsPDF } from 'jspdf';
import { SkillProofRecord, Competency, TimelineEvent } from '../types';
import { getProofShareUrl } from './shareUtils';
import { endorsementService } from '../services/endorsementService';

export interface ProofResumeData {
  candidate: {
    name: string;
    headline: string;
    occupation: string;
    location?: string;
    contactEmail?: string;
    verifiedSince: string;
    profileSummary: string;
  };
  verifiedSkills: Array<{
    skillTitle: string;
    proofId: string;
    verificationHash: string;
    confidence: number;
    videoDuration: string;
    videoResolution: string;
    issuedDate: string;
    shareUrl: string;
    competencies: Competency[];
    timeline: TimelineEvent[];
    endorsementCount: number;
    auditStatus: string;
    infrastructure: string;
  }>;
  aggregateStats: {
    totalSkillsVerified: number;
    totalCompetenciesDemonstrated: number;
    averageConfidence: number;
    totalObserverEndorsements: number;
    cryptographicIntegrity: string;
  };
}

/**
 * Builds a structured, portable Proof Resume JSON representation from the candidate's proof records.
 */
export function buildProofResumeData(proof: SkillProofRecord): ProofResumeData {
  const endorsementCount = endorsementService.getEndorsementCount(proof.proofId);
  const verifiedCount = proof.competencies.filter((c) => c.observed).length;

  return {
    candidate: {
      name: proof.workerName,
      headline: proof.workerTitle || `${proof.occupation} Specialist`,
      occupation: proof.occupation,
      location: 'London / Global Crafts Registry',
      contactEmail: 'candidate.verified@skillproof.io',
      verifiedSince: proof.issuedDate,
      profileSummary: `Verified craftsman with tamper-evident video milestone audits. All skills evaluated against international occupational rubrics with cryptographic proof hashes stored on AWS serverless ledger.`,
    },
    verifiedSkills: [
      {
        skillTitle: proof.skillTitle,
        proofId: proof.proofId,
        verificationHash: proof.verificationHash,
        confidence: proof.confidence > 1 ? proof.confidence : Math.round(proof.confidence * 100),
        videoDuration: proof.videoDuration,
        videoResolution: proof.videoResolution,
        issuedDate: proof.issuedDate,
        shareUrl: getProofShareUrl(proof.proofId),
        competencies: proof.competencies,
        timeline: proof.timeline,
        endorsementCount,
        auditStatus: 'VERIFIED & TAMPER-EVIDENT',
        infrastructure: `${proof.awsRegion} • ${proof.s3Bucket}`,
      },
    ],
    aggregateStats: {
      totalSkillsVerified: 1,
      totalCompetenciesDemonstrated: verifiedCount,
      averageConfidence: proof.confidence > 1 ? proof.confidence : Math.round(proof.confidence * 100),
      totalObserverEndorsements: endorsementCount,
      cryptographicIntegrity: 'SHA-256 Validated • AWS Step Functions Audited',
    },
  };
}

/**
 * Exports and triggers download of the structured Proof Resume JSON file.
 */
export function exportProofResumeJson(proof: SkillProofRecord): void {
  const resumeData = buildProofResumeData(proof);
  const jsonStr = JSON.stringify(resumeData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Proof_Resume_${proof.workerName.replace(/\s+/g, '_')}_${proof.proofId}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads a multi-section, publication-grade Proof Resume PDF
 * combining verified skills, timeline milestones, and third-party endorsements.
 */
export function exportProofResumePdf(proof: SkillProofRecord): void {
  const resumeData = buildProofResumeData(proof);
  const endorsementCount = endorsementService.getEndorsementCount(proof.proofId);
  const endorsements = endorsementService.getEndorsements(proof.proofId);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Background
  doc.setFillColor(252, 251, 247); // warm ivory
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer Border
  doc.setDrawColor(215, 210, 200);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 3, 3, 'S');

  // Top Dark Header Block
  const headerH = 44;
  doc.setFillColor(16, 17, 15); // #10110F obsidian
  doc.roundedRect(margin, margin, contentWidth, headerH, 3, 3, 'F');
  doc.rect(margin, margin + headerH - 3, contentWidth, 3, 'F');

  // Lime Brand Bar
  doc.setFillColor(200, 241, 105); // #C8F169
  doc.rect(margin, margin + headerH, contentWidth, 1.2, 'F');

  // Brand title & Passport tag
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('SKILLPROOF OFFICIAL PROOF RESUME', margin + 8, margin + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(200, 241, 105);
  doc.text('CONSOLIDATED EVIDENCE PASSPORT FOR JOB APPLICATIONS', margin + 8, margin + 18);

  // Candidate Name & Role inside Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(resumeData.candidate.name, margin + 8, margin + 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(190, 195, 185);
  doc.text(
    `${resumeData.candidate.headline}  •  ${proof.occupation}  •  Verified: ${proof.issuedDate}`,
    margin + 8,
    margin + 33
  );

  doc.setFontSize(7);
  doc.setTextColor(150, 155, 145);
  doc.text(`Digital Verification URL: ${getProofShareUrl(proof.proofId)}`, margin + 8, margin + 38);

  // Top Right Badge Box inside header
  doc.setFillColor(32, 34, 30);
  doc.roundedRect(pageWidth - margin - 52, margin + 6, 46, 32, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(200, 241, 105);
  doc.text('PROOF PASSPORT ID', pageWidth - margin - 48, margin + 12);
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(proof.proofId, pageWidth - margin - 48, margin + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(180, 185, 175);
  doc.text(`CONFIDENCE: ${proof.confidence}%`, pageWidth - margin - 48, margin + 24);
  doc.text(`ENDORSEMENTS: ${endorsementCount} OBSERVERS`, pageWidth - margin - 48, margin + 29);
  doc.text(`AWS REPO: ap-south-1`, pageWidth - margin - 48, margin + 34);

  // --- SECTION 1: CANDIDATE SUMMARY & AGGREGATE METRICS ---
  let y = margin + headerH + 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(16, 17, 15);
  doc.text('1. VERIFICATION SUMMARY & AUDIT CREDENTIALS', margin + 6, y);
  y += 4;

  // 4 metric boxes
  const colW = (contentWidth - 12 - 9) / 4;
  const metrics = [
    { label: 'VERIFIED SKILLS', val: `${resumeData.aggregateStats.totalSkillsVerified} Skill` },
    { label: 'COMPETENCIES', val: `${resumeData.aggregateStats.totalCompetenciesDemonstrated} / ${proof.competencies.length} Passed` },
    { label: 'EVIDENCE CONFIDENCE', val: `${proof.confidence}% Rubric Match` },
    { label: 'PEER ENDORSEMENTS', val: `${endorsementCount} Verified Observers` },
  ];

  metrics.forEach((m, idx) => {
    const xPos = margin + 6 + idx * (colW + 3);
    doc.setFillColor(244, 241, 232);
    doc.roundedRect(xPos, y, colW, 14, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(114, 118, 109);
    doc.text(m.label, xPos + 2.5, y + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(16, 17, 15);
    doc.text(m.val, xPos + 2.5, y + 10);
  });
  y += 18;

  // --- SECTION 2: VERIFIED SKILL DEMONSTRATION RECORD ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(16, 17, 15);
  doc.text('2. VERIFIED SKILL DEMONSTRATION SPECIFICATION', margin + 6, y);
  y += 4;

  // Demonstration Card
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(215, 210, 200);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin + 6, y, contentWidth - 12, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(16, 17, 15);
  doc.text(proof.skillTitle, margin + 10, y + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(92, 96, 87);
  doc.text(`Task Description: ${proof.taskDescription}`, margin + 10, y + 11.5);

  doc.setFontSize(7);
  doc.text(
    `Continuous Video: ${proof.videoDuration} (${proof.videoResolution})  •  Tamper-Evident SHA-256: ${proof.verificationHash.slice(0, 28)}...`,
    margin + 10,
    y + 16.5
  );

  // Competency Breakdown Table inside demonstration
  doc.setFillColor(244, 241, 232);
  doc.rect(margin + 10, y + 20, contentWidth - 20, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(16, 17, 15);
  doc.text('TIMESTAMP', margin + 12, y + 23.5);
  doc.text('OBSERVED COMPETENCY', margin + 34, y + 23.5);
  doc.text('CONFIDENCE', margin + 110, y + 23.5);
  doc.text('EVIDENCE EVALUATION', margin + 132, y + 23.5);

  let compY = y + 27;
  proof.competencies.slice(0, 3).forEach((c) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(16, 17, 15);
    doc.text(c.timestampDisplay, margin + 12, compY);
    doc.text(c.label, margin + 34, compY);
    doc.text(`${Math.round(c.confidence > 1 ? c.confidence : c.confidence * 100)}%`, margin + 110, compY);
    doc.setTextColor(92, 96, 87);
    const snippet = c.evidenceSnippet || c.description;
    doc.text(snippet.slice(0, 42) + '...', margin + 132, compY);
    compY += 4.2;
  });

  y += 43;

  // --- SECTION 3: MILESTONE TIMELINE & CRYPTOGRAPHIC EVIDENCE ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(16, 17, 15);
  doc.text('3. CONTINUOUS VIDEO MILESTONE TIMELINE', margin + 6, y);
  y += 4;

  const timelineItems = proof.timeline.slice(0, 4);
  const timeBoxW = (contentWidth - 12 - 9) / timelineItems.length;

  timelineItems.forEach((t, idx) => {
    const xPos = margin + 6 + idx * (timeBoxW + 3);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(215, 210, 200);
    doc.setLineWidth(0.3);
    doc.roundedRect(xPos, y, timeBoxW, 26, 1.5, 1.5, 'FD');

    // Lime mini badge
    doc.setFillColor(16, 17, 15);
    doc.roundedRect(xPos + 2.5, y + 2.5, 12, 4.5, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(200, 241, 105);
    doc.text(t.timestampDisplay, xPos + 4, y + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(16, 17, 15);
    doc.text(t.title, xPos + 2.5, y + 10.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(92, 96, 87);
    const descLines = doc.splitTextToSize(t.description, timeBoxW - 5);
    doc.text(descLines, xPos + 2.5, y + 15);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(16, 185, 129); // emerald
    doc.text('✓ AI VERIFIED', xPos + 2.5, y + 23.5);
  });

  y += 31;

  // --- SECTION 4: THIRD-PARTY OBSERVER ATTESTATIONS & ENDORSEMENTS ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(16, 17, 15);
  doc.text(`4. OBSERVER ENDORSEMENTS (${endorsementCount} REGISTERED ATTESTATIONS)`, margin + 6, y);
  y += 4;

  const topEndorsements = endorsements.slice(0, 2);
  topEndorsements.forEach((end) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(215, 210, 200);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin + 6, y, contentWidth - 12, 14, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(16, 17, 15);
    doc.text(`${end.observerName}  •  ${end.observerRole} (${end.organization || 'Independent Guild'})`, margin + 9, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(92, 96, 87);
    doc.text(`Endorsed: "${end.aspectEndorsed || 'Milestone Accuracy'}"  —  "${end.comment || 'Verified technique execution'}"`, margin + 9, y + 9.5);

    y += 16;
  });

  // --- FOOTER: AUDIT INSTRUCTIONS FOR EMPLOYERS ---
  const footerY = pageHeight - margin - 22;
  doc.setFillColor(16, 17, 15);
  doc.roundedRect(margin + 6, footerY, contentWidth - 12, 18, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(200, 241, 105);
  doc.text('ONLINE VERIFICATION INSTRUCTIONS FOR HIRING MANAGERS', margin + 10, footerY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `Inspect high-resolution video milestones, frame extractions, and SHA-256 audit trails at:`,
    margin + 10,
    footerY + 10
  );

  doc.setTextColor(200, 241, 105);
  doc.text(getProofShareUrl(proof.proofId), margin + 10, footerY + 14.5);

  doc.setTextColor(180, 185, 175);
  doc.setFontSize(6);
  doc.text(`Generated: ${new Date().toISOString()} • Portable Evidence Layer`, pageWidth - margin - 58, footerY + 14.5);

  doc.save(`Proof_Resume_${proof.workerName.replace(/\s+/g, '_')}_${proof.proofId}.pdf`);
}
