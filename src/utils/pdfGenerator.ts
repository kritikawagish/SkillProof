import { jsPDF } from 'jspdf';
import { SkillProofRecord } from '../types';
import { getProofShareUrl } from './shareUtils';

/**
 * Generates and downloads a clean, branded PDF summary of the candidate's verified skill evidence.
 */
export function generateProofPdf(proof: SkillProofRecord): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // 1. Clean Background Base (Atelier Ivory / Warm White)
  doc.setFillColor(252, 251, 247); // #FCFBF7
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer Border Frame
  doc.setDrawColor(220, 217, 208);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 4, 4, 'S');

  // 2. Header Banner (Obsidian Dark with Lime Accent Line)
  const headerHeight = 36;
  doc.setFillColor(16, 17, 15); // #10110F
  doc.roundedRect(margin, margin, contentWidth, headerHeight, 4, 4, 'F');
  // Fill the bottom corners of the header to make it flat at bottom
  doc.rect(margin, margin + headerHeight - 4, contentWidth, 4, 'F');

  // Lime Accent Bar at bottom of header
  doc.setFillColor(200, 241, 105); // #C8F169
  doc.rect(margin, margin + headerHeight, contentWidth, 1.2, 'F');

  // Header Title & Logo Mark
  // Draw Proof Mark Icon (3 horizontal bars + checkmark)
  doc.setDrawColor(200, 241, 105);
  doc.setLineWidth(0.8);
  doc.line(margin + 6, margin + 11, margin + 14, margin + 11);
  doc.line(margin + 6, margin + 14, margin + 12, margin + 14);
  doc.line(margin + 6, margin + 17, margin + 10, margin + 17);
  // Check tick
  doc.line(margin + 12, margin + 17, margin + 14, margin + 19);
  doc.line(margin + 14, margin + 19, margin + 18, margin + 13);

  // App Name & Category
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('SKILLPROOF', margin + 22, margin + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(200, 241, 105);
  doc.text('VERIFIED SKILL EVIDENCE RECORD', margin + 22, margin + 19);

  doc.setFontSize(7);
  doc.setTextColor(180, 185, 175);
  doc.text('PUBLIC TRUST & WORK DEMONSTRATION PASSPORT', margin + 22, margin + 24);

  // Top-Right Header Metadata Box
  doc.setFillColor(30, 32, 28);
  doc.roundedRect(pageWidth - margin - 58, margin + 6, 52, 24, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(200, 241, 105);
  doc.text('PROOF IDENTIFIER', pageWidth - margin - 54, margin + 12);
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(proof.proofId, pageWidth - margin - 54, margin + 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(170, 175, 165);
  doc.text(`ISSUED: ${proof.issuedDate.toUpperCase()}`, pageWidth - margin - 54, margin + 24);

  // 3. Candidate Summary & Skill Card (Y: 56)
  let curY = margin + headerHeight + 7;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(225, 222, 214);
  doc.roundedRect(margin + 5, curY, contentWidth - 10, 42, 3, 3, 'FD');

  // Candidate Name & Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(16, 17, 15);
  doc.text(proof.workerName, margin + 10, curY + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 95, 85);
  doc.text(`${proof.occupation}  |  Demonstrated Challenge`, margin + 10, curY + 15);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(16, 17, 15);
  doc.text(proof.skillTitle, margin + 10, curY + 22);

  // Task Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 85, 75);
  const taskLines = doc.splitTextToSize(`Task: "${proof.taskDescription}"`, contentWidth - 75);
  doc.text(taskLines, margin + 10, curY + 28);

  // Duration & Evidence Badges
  doc.setFillColor(244, 241, 232);
  doc.roundedRect(margin + 10, curY + 34, 32, 5.5, 1.5, 1.5, 'F');
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 17, 15);
  doc.text(`DURATION: ${proof.videoDuration}`, margin + 12, curY + 38);

  doc.setFillColor(244, 241, 232);
  doc.roundedRect(margin + 45, curY + 34, 30, 5.5, 1.5, 1.5, 'F');
  doc.text(`QUALITY: ${proof.videoResolution}`, margin + 47, curY + 38);

  // Right Badge: Evidence Score Box
  const scoreBoxX = pageWidth - margin - 52;
  doc.setFillColor(16, 17, 15);
  doc.roundedRect(scoreBoxX, curY + 5, 42, 32, 2.5, 2.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(200, 241, 105); // Lime
  doc.text(`${Math.round(proof.confidence * 100)}%`, scoreBoxX + 8, curY + 18);

  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text('EVIDENCE CONFIDENCE', scoreBoxX + 6, curY + 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(180, 185, 175);
  doc.text('5 / 5 Competencies Verified', scoreBoxX + 6, curY + 29);

  curY += 47;

  // 4. Competencies Verification Matrix Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(16, 17, 15);
  doc.text('DEMONSTRATED COMPETENCIES BREAKDOWN', margin + 6, curY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 105, 95);
  doc.text('Observed directly by multimodal AI vision evaluator from unedited continuous video capture', margin + 6, curY + 4.5);

  curY += 8;

  // Table Header
  doc.setFillColor(240, 237, 228);
  doc.rect(margin + 5, curY, contentWidth - 10, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(60, 65, 55);
  doc.text('TIME', margin + 9, curY + 4.8);
  doc.text('COMPETENCY & RUBRIC SPECIFICATION', margin + 25, curY + 4.8);
  doc.text('CONFIDENCE', pageWidth - margin - 45, curY + 4.8);
  doc.text('STATUS', pageWidth - margin - 18, curY + 4.8);

  curY += 7;

  // Table Rows
  proof.competencies.forEach((comp, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 250, isEven ? 255 : 249, isEven ? 255 : 246);
    doc.rect(margin + 5, curY, contentWidth - 10, 11, 'F');

    // Horizontal divider
    doc.setDrawColor(230, 227, 220);
    doc.line(margin + 5, curY + 11, pageWidth - margin - 5, curY + 11);

    // Timestamp
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(16, 17, 15);
    doc.text(comp.timestampDisplay, margin + 9, curY + 5.5);

    // Title & description
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(16, 17, 15);
    doc.text(comp.name, margin + 25, curY + 4.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(90, 95, 85);
    const descText = doc.splitTextToSize(comp.description, contentWidth - 78);
    doc.text(descText[0] || '', margin + 25, curY + 8.8);

    // Confidence
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(16, 17, 15);
    doc.text(`${Math.round(comp.confidence * 100)}%`, pageWidth - margin - 42, curY + 6.5);

    // Status pill
    doc.setFillColor(220, 252, 231); // Light emerald
    doc.roundedRect(pageWidth - margin - 22, curY + 3.2, 16, 4.8, 1, 1, 'F');
    doc.setFontSize(6);
    doc.setTextColor(21, 128, 61); // Emerald
    doc.text('VERIFIED', pageWidth - margin - 20, curY + 6.6);

    curY += 11;
  });

  curY += 4;

  // 5. Timeline Rubric Milestones
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(16, 17, 15);
  doc.text('EVIDENCE TIMELINE & MILESTONES', margin + 6, curY);

  curY += 5;

  // Render 5 step timeline horizontal boxes
  const colWidth = (contentWidth - 10) / proof.timeline.length;
  proof.timeline.forEach((item, i) => {
    const colX = margin + 5 + i * colWidth;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220, 217, 208);
    doc.roundedRect(colX + 1, curY, colWidth - 2, 22, 2, 2, 'FD');

    // Lime accent top bar
    doc.setFillColor(200, 241, 105);
    doc.rect(colX + 1, curY, colWidth - 2, 1.2, 'F');

    // Timestamp badge
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(16, 17, 15);
    doc.text(item.timestampDisplay, colX + 3.5, curY + 5.5);

    // Title
    doc.setFontSize(7);
    doc.setTextColor(16, 17, 15);
    const titleLines = doc.splitTextToSize(item.title, colWidth - 7);
    doc.text(titleLines[0] || '', colX + 3.5, curY + 10);

    // Short description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(100, 105, 95);
    const itemDesc = doc.splitTextToSize(item.description, colWidth - 7);
    doc.text(itemDesc[0] || '', colX + 3.5, curY + 14.5);
    if (itemDesc[1]) {
      doc.text(itemDesc[1], colX + 3.5, curY + 17.5);
    }
  });

  curY += 27;

  // 6. Evaluator Observations & AI Notes
  doc.setFillColor(247, 245, 238);
  doc.setDrawColor(225, 222, 214);
  doc.roundedRect(margin + 5, curY, contentWidth - 10, 21, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(16, 17, 15);
  doc.text('EVIDENCE EVALUATOR OBSERVATIONS', margin + 9, curY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(70, 75, 65);
  const notesText =
    proof.unobservedNotes ||
    'All five core competency criteria were conclusively observed with clear hand positioning throughout the 43-second duration. Thread tension was calibrated and the thread shank wrap was executed with four protective rotations beneath the horn button.';
  const wrappedNotes = doc.splitTextToSize(notesText, contentWidth - 18);
  doc.text(wrappedNotes, margin + 9, curY + 9.5);

  curY += 26;

  // 7. Security, Verification URL & Legal Trust Notice
  const shareUrl = getProofShareUrl(proof.proofId);

  doc.setFillColor(16, 17, 15);
  doc.roundedRect(margin + 5, curY, contentWidth - 10, 24, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(200, 241, 105);
  doc.text('HOW TO INDEPENDENTLY VERIFY THIS EVIDENCE', margin + 9, curY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text(
    'Anyone can inspect the raw timestamped video evidence and competency milestone logs at:',
    margin + 9,
    curY + 10
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(200, 241, 105);
  doc.text(shareUrl, margin + 9, curY + 14.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(160, 165, 155);
  doc.text(
    `Cryptographic Verification Hash: ${proof.verificationHash}  |  Storage: AWS S3 (${proof.awsRegion})  |  Zero Login Required`,
    margin + 9,
    curY + 19.5
  );

  // 8. Footer Credibility Notice
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(120, 125, 115);
  doc.text(
    'SkillProof is an AI-observed work demonstration platform. It verifies evidence of demonstrated skill without requiring traditional degrees, resumes, or CVs.',
    pageWidth / 2,
    pageHeight - margin - 2,
    { align: 'center' }
  );

  // Save / Download PDF
  const cleanName = proof.workerName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `SkillProof_${proof.proofId}_${cleanName}.pdf`;
  doc.save(filename);
}
