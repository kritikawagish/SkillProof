import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Link2, Share2, QrCode } from 'lucide-react';
import { getProofShareUrl, copyShareLink } from '../utils/shareUtils';

interface ShareProofBarProps {
  proofId: string;
  workerName?: string;
  variant?: 'light' | 'dark' | 'card';
  showQrOption?: boolean;
  onOpenQr?: () => void;
  onOpenLinkedIn?: () => void;
  className?: string;
}

export default function ShareProofBar({
  proofId,
  workerName,
  variant = 'light',
  showQrOption = true,
  onOpenQr,
  onOpenLinkedIn,
  className = '',
}: ShareProofBarProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = getProofShareUrl(proofId);

  const handleCopy = async () => {
    const success = await copyShareLink(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const isDark = variant === 'dark';

  return (
    <div
      id={`share-proof-bar-${proofId}`}
      className={`rounded-2xl border transition-all ${
        isDark
          ? 'bg-[#181916] border-white/15 text-white shadow-xl'
          : 'bg-[#FCFBF7] border-[#292B27]/15 text-[#10110F] shadow-sm'
      } p-4 sm:p-5 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-[#C8F169] text-[#10110F]' : 'bg-[#10110F] text-[#C8F169]'
            }`}
          >
            <Link2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider opacity-60 font-bold">
              VERIFIED EVIDENCE SHARE LINK
            </div>
            <div className="text-xs font-bold">
              Unique URL for Proof <span className="font-mono text-[#C8F169] bg-black/40 px-1.5 py-0.5 rounded">{proofId}</span>
            </div>
          </div>
        </div>

        {copied && (
          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 animate-fadeIn">
            <Check className="w-3.5 h-3.5" />
            <span>Link Copied to Clipboard!</span>
          </span>
        )}
      </div>

      {/* URL Display and Primary Copy Action */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            readOnly
            value={shareUrl}
            onClick={(e) => (e.target as HTMLInputElement).select()}
            className={`w-full font-mono text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none transition-colors truncate ${
              isDark
                ? 'bg-black/60 border-white/10 text-white/90 selection:bg-[#C8F169] selection:text-black'
                : 'bg-white border-[#292B27]/15 text-[#10110F] selection:bg-[#C8F169] selection:text-black'
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-copy-share-link"
            onClick={handleCopy}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
              copied
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : isDark
                ? 'bg-[#C8F169] text-[#10110F] hover:bg-[#b8e357]'
                : 'bg-[#10110F] text-[#C8F169] hover:bg-black'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Share Link</span>
              </>
            )}
          </button>

          {onOpenLinkedIn && (
            <button
              type="button"
              id={`btn-linkedin-share-${proofId}`}
              onClick={onOpenLinkedIn}
              className={`px-3 py-2.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 font-mono text-xs font-bold ${
                isDark
                  ? 'bg-[#0A66C2] border-[#0A66C2] text-white hover:bg-[#004182]'
                  : 'bg-[#0A66C2] border-[#0A66C2] text-white hover:bg-[#004182]'
              }`}
              title="Share verified proof to LinkedIn"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span className="hidden sm:inline">LinkedIn</span>
            </button>
          )}

          {showQrOption && onOpenQr && (
            <button
              type="button"
              onClick={onOpenQr}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex items-center justify-center ${
                isDark
                  ? 'bg-white/5 border-white/15 text-white/80 hover:text-white hover:bg-white/10'
                  : 'bg-white border-[#292B27]/15 text-[#72766D] hover:text-[#10110F] hover:bg-stone-50'
              }`}
              title="Show QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>
          )}

          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2.5 rounded-xl border transition-colors flex items-center justify-center ${
              isDark
                ? 'bg-white/5 border-white/15 text-white/80 hover:text-white hover:bg-white/10'
                : 'bg-white border-[#292B27]/15 text-[#72766D] hover:text-[#10110F] hover:bg-stone-50'
            }`}
            title="Open share link in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] opacity-60">
        <span>No login or app install needed for employers or clients to view.</span>
        <span className="font-mono">Tamper-evident evidence link</span>
      </div>
    </div>
  );
}
