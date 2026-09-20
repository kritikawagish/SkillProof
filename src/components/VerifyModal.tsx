import React, { useState } from 'react';
import { X, Search, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import ProofMark from './ProofMark';

interface VerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerifyProofId: (proofId: string) => void;
}

export default function VerifyModal({ isOpen, onClose, onVerifyProofId }: VerifyModalProps) {
  const [proofIdInput, setProofIdInput] = useState('SP-7F21D9');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofIdInput.trim()) {
      setError('Please enter a valid Proof ID');
      return;
    }
    setError('');
    onVerifyProofId(proofIdInput.trim());
    onClose();
  };

  return (
    <div
      id="verify-proof-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FCFBF7] text-[#292B27] rounded-2xl border border-[#292B27]/20 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6"
      >
        <div className="flex items-center justify-between border-b border-[#292B27]/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#10110F] text-[#C8F169] flex items-center justify-center">
              <ProofMark size={16} color="#C8F169" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-[#72766D] font-bold">
                PUBLIC TRUST VERIFIER
              </div>
              <h3 className="text-lg font-bold text-[#10110F]">Verify a SkillProof</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-[#72766D] hover:text-[#10110F] text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="modal-proof-id-input" className="text-xs font-mono font-bold text-[#10110F] uppercase">
              Enter Proof ID
            </label>
            <div className="relative">
              <input
                id="modal-proof-id-input"
                type="text"
                value={proofIdInput}
                onChange={(e) => {
                  setProofIdInput(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="e.g. SP-7F21D9"
                className="w-full bg-white border border-[#292B27]/20 rounded-xl px-4 py-3 font-mono text-sm font-bold text-[#10110F] uppercase focus:outline-none focus:border-[#10110F]"
              />
              <Search className="w-4 h-4 text-[#72766D] absolute right-3.5 top-3.5" />
            </div>
            {error && <p className="text-xs text-rose-600 font-mono">{error}</p>}
          </div>

          {/* Quick Presets for Judges */}
          <div className="p-3 rounded-xl bg-black/[0.02] border border-black/5 space-y-2">
            <div className="text-[10px] font-mono uppercase text-[#72766D]">Quick Test Credentials:</div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setProofIdInput('SP-7F21D9')}
                className="text-xs font-mono px-2.5 py-1 rounded bg-white border border-[#292B27]/15 hover:border-[#292B27]/40 text-[#10110F] font-semibold cursor-pointer"
              >
                SP-7F21D9 (Kritika - 87%)
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#72766D] hover:text-[#10110F]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#10110F] text-[#C8F169] hover:bg-black font-bold text-xs px-5 py-2.5 rounded-xl border border-[#C8F169]/40 flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Verify Proof</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
