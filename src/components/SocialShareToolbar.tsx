import React, { useState } from 'react';
import { Twitter, Slack, Check, Copy, ExternalLink, Hash, MessageSquare, Send, Sparkles, Share2, Award } from 'lucide-react';
import { SkillProofRecord } from '../types';
import {
  getProofShareUrl,
  copyShareLink,
  getLinkedInShareUrl,
  generateLinkedInPostText,
} from '../utils/shareUtils';

interface SocialShareToolbarProps {
  proof: SkillProofRecord;
  className?: string;
  onOpenLinkedIn?: () => void;
}

export default function SocialShareToolbar({ proof, className = '', onOpenLinkedIn }: SocialShareToolbarProps) {
  const [copiedSlack, setCopiedSlack] = useState(false);
  const [copiedTwitter, setCopiedTwitter] = useState(false);
  const [copiedLinkedIn, setCopiedLinkedIn] = useState(false);
  const [activePreview, setActivePreview] = useState<'none' | 'linkedin' | 'twitter' | 'slack'>('none');
  const [copiedHashtag, setCopiedHashtag] = useState<string | null>(null);

  const shareUrl = getProofShareUrl(proof.proofId);
  const hashtagsArray = ['SkillProof', 'ProofOfSkill', 'FutureOfWork', 'VerifiedSkills', 'Craftsmanship'];
  const hashtagsString = hashtagsArray.join(',');

  // Pre-formatted message for LinkedIn
  const linkedInPostText = generateLinkedInPostText({
    workerName: proof.workerName,
    skillTitle: proof.skillTitle,
    occupation: proof.occupation,
    proofId: proof.proofId,
    confidence: proof.confidence > 1 ? proof.confidence : Math.round(proof.confidence * 100),
    hash: proof.verificationHash,
  });

  const linkedInShareUrl = getLinkedInShareUrl(proof.proofId);

  // Pre-formatted message for Twitter / X
  const twitterMessage = `⚡ Official @SkillProof verified: ${proof.workerName} demonstrated "${proof.skillTitle}" [Record: ${proof.proofId}]. Cryptographic video audit & employer verified evidence.`;

  // Pre-formatted message for Slack (using Slack mrkdwn syntax)
  const slackMessage = `*⚡ SkillProof Verification Record: ${proof.proofId}*\n*Candidate:* ${proof.workerName} (${proof.workerTitle || proof.occupation})\n*Skill Demonstrated:* ${proof.skillTitle}\n*Verification Hash:* \`${proof.verificationHash.slice(0, 16)}...\`\n*Status:* Verified & Tamper-Evident Evidence\n\nInspect full video milestone timeline & employer audit: <${shareUrl}>\n\n_#SkillProof #ProofOfSkill #FutureOfWork #VerifiedSkills_`;

  // Twitter Web Intent URL
  const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    twitterMessage
  )}&url=${encodeURIComponent(shareUrl)}&hashtags=${encodeURIComponent(hashtagsString)}`;

  // Handle LinkedIn Post Launcher
  const handleShareLinkedIn = () => {
    if (onOpenLinkedIn) {
      onOpenLinkedIn();
    } else {
      window.open(linkedInShareUrl, '_blank', 'noopener,noreferrer,width=650,height=600');
    }
  };

  // Handle Copy LinkedIn Post Text
  const handleCopyLinkedInText = async () => {
    const success = await copyShareLink(linkedInPostText);
    if (success) {
      setCopiedLinkedIn(true);
      setTimeout(() => setCopiedLinkedIn(false), 2500);
    }
  };

  // Handle Twitter Quick-Action
  const handleShareTwitter = () => {
    window.open(twitterIntentUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  // Handle Copy Tweet Text
  const handleCopyTwitterText = async () => {
    const fullTweet = `${twitterMessage}\n\n${shareUrl}\n\n${hashtagsArray.map((h) => `#${h}`).join(' ')}`;
    const success = await copyShareLink(fullTweet);
    if (success) {
      setCopiedTwitter(true);
      setTimeout(() => setCopiedTwitter(false), 2500);
    }
  };

  // Handle Slack Quick-Action: copy pre-formatted Slack message and offer open
  const handleShareSlack = async () => {
    const success = await copyShareLink(slackMessage);
    if (success) {
      setCopiedSlack(true);
      setActivePreview('slack');
      setTimeout(() => setCopiedSlack(false), 3000);
    }
  };

  // Handle copy single hashtag
  const handleCopyHashtag = async (tag: string) => {
    const success = await copyShareLink(`#${tag}`);
    if (success) {
      setCopiedHashtag(tag);
      setTimeout(() => setCopiedHashtag(null), 2000);
    }
  };

  return (
    <div
      id="social-share-toolbar"
      className={`rounded-2xl border border-[#292B27]/15 bg-[#FCFBF7] p-4 sm:p-5 shadow-sm text-[#10110F] ${className}`}
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#10110F] text-[#C8F169] flex items-center justify-center font-bold">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#10110F]">
                Social & Professional Proof Sharing
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0A66C2] text-white font-bold">
                LINKEDIN READY
              </span>
            </div>
            <p className="text-[11px] text-[#72766D]">
              Broadcast verified proof record to professional networks with pre-formatted posts and certificates
            </p>
          </div>
        </div>

        {/* Preview toggles */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setActivePreview(activePreview === 'linkedin' ? 'none' : 'linkedin')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-colors cursor-pointer border ${
              activePreview === 'linkedin'
                ? 'bg-[#0A66C2] text-white border-[#0A66C2]'
                : 'bg-white text-[#5C6057] border-[#292B27]/15 hover:text-[#10110F]'
            }`}
          >
            LinkedIn Preview
          </button>
          <button
            type="button"
            onClick={() => setActivePreview(activePreview === 'twitter' ? 'none' : 'twitter')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-colors cursor-pointer border ${
              activePreview === 'twitter'
                ? 'bg-[#10110F] text-[#C8F169] border-[#10110F]'
                : 'bg-white text-[#5C6057] border-[#292B27]/15 hover:text-[#10110F]'
            }`}
          >
            Twitter
          </button>
          <button
            type="button"
            onClick={() => setActivePreview(activePreview === 'slack' ? 'none' : 'slack')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-colors cursor-pointer border ${
              activePreview === 'slack'
                ? 'bg-[#10110F] text-[#C8F169] border-[#10110F]'
                : 'bg-white text-[#5C6057] border-[#292B27]/15 hover:text-[#10110F]'
            }`}
          >
            Slack
          </button>
        </div>
      </div>

      {/* Quick Action Buttons Grid - 3 Columns (LinkedIn Featured, Twitter, Slack) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* LinkedIn Quick-Action Button (Featured) */}
        <div className="rounded-xl border-2 border-[#0A66C2]/30 bg-white p-3.5 flex flex-col justify-between gap-3 shadow-xs hover:border-[#0A66C2] transition-colors relative">
          <div className="absolute -top-2.5 right-3 bg-[#0A66C2] text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Most Viewed
          </div>

          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0A66C2] text-white flex items-center justify-center font-bold">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-xs text-[#10110F]">LinkedIn Profile & Feed</div>
                <div className="text-[11px] text-[#72766D] font-mono">
                  Post to network & add cert
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyLinkedInText}
              className="p-1.5 text-[#72766D] hover:text-[#10110F] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title="Copy pre-formatted LinkedIn post text"
            >
              {copiedLinkedIn ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <div className="text-[11px] text-[#5C6057] line-clamp-2 bg-[#F4F1E8]/50 p-2 rounded-lg border border-[#292B27]/5 font-mono">
            🎯 Verified skill demonstration on SkillProof: {proof.skillTitle} ({proof.confidence}% match)
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-share-linkedin"
              onClick={handleShareLinkedIn}
              className="flex-1 bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-mono font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>Post to LinkedIn</span>
              <ExternalLink className="w-3 h-3 text-white/80 ml-auto" />
            </button>
          </div>
        </div>

        {/* Twitter Quick-Action Button */}
        <div className="rounded-xl border border-[#292B27]/15 bg-white p-3.5 flex flex-col justify-between gap-3 shadow-xs hover:border-[#10110F]/40 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center justify-center font-bold">
                <Twitter className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#10110F]">Twitter / X</div>
                <div className="text-[11px] text-[#72766D] font-mono">
                  Web intent + 5 hashtags
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyTwitterText}
              className="p-1.5 text-[#72766D] hover:text-[#10110F] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title="Copy pre-formatted tweet text"
            >
              {copiedTwitter ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <div className="text-[11px] text-[#5C6057] line-clamp-2 bg-[#F4F1E8]/50 p-2 rounded-lg border border-[#292B27]/5 font-mono">
            {twitterMessage}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-share-twitter"
              onClick={handleShareTwitter}
              className="flex-1 bg-[#10110F] hover:bg-black text-white text-xs font-mono font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Twitter className="w-3.5 h-3.5 text-[#1DA1F2] fill-[#1DA1F2]" />
              <span>Share to Twitter</span>
              <ExternalLink className="w-3 h-3 text-white/60 ml-auto" />
            </button>
          </div>
        </div>

        {/* Slack Quick-Action Button */}
        <div className="rounded-xl border border-[#292B27]/15 bg-white p-3.5 flex flex-col justify-between gap-3 shadow-xs hover:border-[#10110F]/40 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#4A154B]/10 text-[#4A154B] flex items-center justify-center font-bold">
                <Slack className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-[#10110F]">Slack Workspace</div>
                <div className="text-[11px] text-[#72766D] font-mono">
                  mrkdwn audit card
                </div>
              </div>
            </div>

            {copiedSlack && (
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 animate-fadeIn">
                Copied!
              </span>
            )}
          </div>

          <div className="text-[11px] text-[#5C6057] line-clamp-2 bg-[#F4F1E8]/50 p-2 rounded-lg border border-[#292B27]/5 font-mono">
            *⚡ SkillProof Verification: {proof.proofId}* - {proof.workerName} ({proof.skillTitle})
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-share-slack"
              onClick={handleShareSlack}
              className={`flex-1 text-xs font-mono font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                copiedSlack
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-[#4A154B] hover:bg-[#3d113e] text-white'
              }`}
            >
              {copiedSlack ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Message Copied!</span>
                </>
              ) : (
                <>
                  <Slack className="w-3.5 h-3.5 text-[#E01E5A]" />
                  <span>Copy Slack Card</span>
                  <Copy className="w-3 h-3 text-white/60 ml-auto" />
                </>
              )}
            </button>

            <a
              href="https://app.slack.com/client"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-[#292B27]/15 hover:bg-stone-100 text-[#72766D] hover:text-[#10110F] transition-colors cursor-pointer flex items-center justify-center"
              title="Open Slack Client"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Pre-formatted Hashtags Row */}
      <div className="mt-3.5 pt-3.5 border-t border-[#292B27]/10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#72766D]">
          <Hash className="w-3.5 h-3.5 text-[#10110F]" />
          <span>Pre-formatted Hashtags:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {hashtagsArray.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleCopyHashtag(tag)}
              className="text-[10px] font-mono bg-white hover:bg-[#10110F] text-[#5C6057] hover:text-[#C8F169] px-2 py-0.5 rounded-md border border-[#292B27]/15 transition-colors cursor-pointer flex items-center gap-1"
              title={`Click to copy #${tag}`}
            >
              <span>#{tag}</span>
              {copiedHashtag === tag && <Check className="w-2.5 h-2.5 text-emerald-500" />}
            </button>
          ))}
        </div>
      </div>

      {/* Collapsible Preview Box for LinkedIn, Twitter, or Slack */}
      {activePreview !== 'none' && (
        <div className="mt-3.5 pt-3.5 border-t border-[#292B27]/10 animate-fadeIn">
          {activePreview === 'linkedin' ? (
            <div className="rounded-xl bg-white border border-[#292B27]/15 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#0A66C2] rounded-xs flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white leading-none">in</span>
                  </div>
                  <span className="text-xs font-bold text-[#10110F]">
                    LinkedIn Feed Post Preview
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyLinkedInText}
                  className="text-[11px] font-mono text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedLinkedIn ? (
                    <>
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Full Post</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-xs text-[#10110F] bg-[#FCFBF7] p-3 rounded-lg border border-[#292B27]/10 font-sans space-y-2 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                {linkedInPostText}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleShareLinkedIn}
                  className="px-4 py-2 bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-mono font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span>Open LinkedIn Post Composer</span>
                  <ExternalLink className="w-3 h-3 text-white/80" />
                </button>
              </div>
            </div>
          ) : activePreview === 'twitter' ? (
            <div className="rounded-xl bg-white border border-[#292B27]/15 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                  <span className="text-xs font-bold text-[#10110F]">
                    Twitter / X Message Preview
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyTwitterText}
                  className="text-[11px] font-mono text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedTwitter ? (
                    <>
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Full Tweet</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-xs text-[#10110F] bg-[#F4F1E8]/60 p-3 rounded-lg border border-[#292B27]/10 font-sans space-y-2 whitespace-pre-line">
                <p>{twitterMessage}</p>
                <p className="text-blue-600 font-mono text-[11px] break-all">{shareUrl}</p>
                <p className="text-blue-600 font-mono text-[11px]">
                  {hashtagsArray.map((h) => `#${h}`).join(' ')}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleShareTwitter}
                  className="px-4 py-2 bg-[#1DA1F2] hover:bg-[#1a94df] text-white text-xs font-mono font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Twitter className="w-3.5 h-3.5 fill-white" />
                  <span>Launch Twitter Intent</span>
                  <ExternalLink className="w-3 h-3 text-white/80" />
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-white border border-[#292B27]/15 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Slack className="w-4 h-4 text-[#4A154B]" />
                  <span className="text-xs font-bold text-[#10110F]">
                    Slack mrkdwn Message Preview
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleShareSlack}
                  className="text-[11px] font-mono text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedSlack ? (
                    <>
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy mrkdwn</span>
                    </>
                  )}
                </button>
              </div>

              {/* Slack formatted bubble */}
              <div className="border-l-4 border-[#4A154B] bg-[#F4F1E8]/50 pl-3.5 pr-3 py-2.5 rounded-r-lg font-sans text-xs space-y-1.5">
                <div className="font-bold text-[#10110F]">
                  ⚡ SkillProof Verification Record: {proof.proofId}
                </div>
                <div className="text-[#292B27]">
                  <span className="font-semibold">Candidate:</span> {proof.workerName} ({proof.workerTitle || proof.occupation})
                </div>
                <div className="text-[#292B27]">
                  <span className="font-semibold">Skill Demonstrated:</span> {proof.skillTitle}
                </div>
                <div className="text-[#292B27]">
                  <span className="font-semibold">Verification Hash:</span>{' '}
                  <span className="font-mono bg-white px-1 py-0.5 rounded border border-[#292B27]/10 text-[11px]">
                    {proof.verificationHash.slice(0, 16)}...
                  </span>
                </div>
                <div className="text-[#292B27]">
                  <span className="font-semibold">Status:</span> Verified & Tamper-Evident Evidence
                </div>
                <div className="pt-1 text-blue-700 underline text-[11px] font-mono break-all">
                  Inspect full video milestone timeline & employer audit: {shareUrl}
                </div>
                <div className="text-[10px] text-[#72766D] font-mono pt-1">
                  #SkillProof #ProofOfSkill #FutureOfWork #VerifiedSkills
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#72766D] font-mono">
                  Paste directly into any Slack channel or DM
                </span>
                <a
                  href="https://app.slack.com/client"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#4A154B] hover:bg-[#3d113e] text-white text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open Slack</span>
                  <ExternalLink className="w-3 h-3 text-white/80" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
