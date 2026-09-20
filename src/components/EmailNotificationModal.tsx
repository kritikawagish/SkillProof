import React, { useState, useEffect } from 'react';
import { Mail, ShieldCheck, CheckCircle2, Clock, ExternalLink, X, Trash2, Check, ArrowRight, Building, UserCheck } from 'lucide-react';
import { notificationService, EmailAlert, DEFAULT_USER_EMAIL } from '../services/notificationService';

interface EmailNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVerification?: (proofId: string) => void;
  highlightAlertId?: string;
}

export default function EmailNotificationModal({
  isOpen,
  onClose,
  onOpenVerification,
  highlightAlertId,
}: EmailNotificationModalProps) {
  const [notifications, setNotifications] = useState<EmailAlert[]>([]);
  const [selectedAlertId, setSelectedAlertId] = useState<string>('');

  useEffect(() => {
    const unsub = notificationService.subscribe((items) => {
      setNotifications(items);
      if (items.length > 0) {
        if (highlightAlertId && items.some((i) => i.id === highlightAlertId)) {
          setSelectedAlertId(highlightAlertId);
        } else if (!selectedAlertId || !items.some((i) => i.id === selectedAlertId)) {
          setSelectedAlertId(items[0].id);
        }
      }
    });
    return unsub;
  }, [highlightAlertId]);

  if (!isOpen) return null;

  const activeAlert = notifications.find((n) => n.id === selectedAlertId) || notifications[0];

  const handleSelect = (alert: EmailAlert) => {
    setSelectedAlertId(alert.id);
    if (!alert.read) {
      notificationService.markAsRead(alert.id);
    }
  };

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
  };

  return (
    <div
      id="email-notification-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        id="email-notification-modal"
        className="bg-[#FCFBF7] rounded-3xl border border-[#292B27]/15 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-[#10110F]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Window Header */}
        <div className="bg-[#10110F] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C8F169] text-[#10110F] flex items-center justify-center font-bold">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-tight">Candidate Email Alerts</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-[#C8F169] font-bold">
                  MOCK NOTIFICATION SERVICE
                </span>
              </div>
              <p className="text-xs text-white/60 font-mono">
                Delivering alerts to: <strong className="text-white">{DEFAULT_USER_EMAIL}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-mono text-white/70 hover:text-white transition-colors cursor-pointer hidden sm:block"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Client Workspace: Sidebar List & Message Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[460px]">
          {/* Email Inbox Sidebar */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[#292B27]/10 bg-[#F4F1E8]/60 overflow-y-auto max-h-48 md:max-h-none">
            <div className="p-3 border-b border-[#292B27]/10 flex items-center justify-between text-xs font-mono text-[#72766D]">
              <span>INBOX ({notifications.length})</span>
              <span>{notifications.filter((n) => !n.read).length} unread</span>
            </div>

            <div className="divide-y divide-[#292B27]/5">
              {notifications.map((item) => {
                const isSelected = item.id === selectedAlertId;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`w-full text-left p-3.5 transition-all cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-white shadow-xs border-l-4 border-l-[#10110F]'
                        : 'hover:bg-black/[0.03]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-bold truncate ${item.read ? 'text-[#10110F]' : 'text-black'}`}>
                        {item.employerCompany}
                      </span>
                      <span className="text-[10px] font-mono text-[#72766D] shrink-0">
                        {item.formattedDate}
                      </span>
                    </div>

                    <div className="text-xs text-[#10110F] font-medium truncate flex items-center gap-1.5">
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                      <span className="truncate">{item.subject}</span>
                    </div>

                    <div className="text-[11px] text-[#72766D] line-clamp-1">
                      {item.notes || 'Evidence verified by employer.'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email Reader Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FCFBF7]">
            {activeAlert ? (
              <div className="space-y-6 max-w-2xl mx-auto">
                {/* Email Header */}
                <div className="space-y-3 pb-4 border-b border-[#292B27]/10">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold flex items-center gap-1.5 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{activeAlert.decisionLabel}</span>
                    </span>

                    <span className="text-xs font-mono text-[#72766D]">
                      {activeAlert.formattedDate}
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-[#10110F] leading-snug">
                    {activeAlert.subject}
                  </h2>

                  {/* Metadata Row */}
                  <div className="bg-[#F4F1E8] p-3 rounded-xl border border-[#292B27]/10 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[#72766D]">From:</span>
                      <span className="font-semibold text-[#10110F]">{activeAlert.from}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#72766D]">To:</span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {activeAlert.to}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#72766D]">Verified Proof ID:</span>
                      <span className="font-bold text-[#10110F]">{activeAlert.proofId}</span>
                    </div>
                  </div>
                </div>

                {/* Styled HTML Email Mock Container */}
                <div className="rounded-2xl border border-[#292B27]/15 bg-white p-6 shadow-sm space-y-5">
                  {/* SkillProof Branded Email Banner */}
                  <div className="flex items-center justify-between border-b border-[#292B27]/10 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-[#10110F] flex items-center justify-center text-[#C8F169] font-bold text-xs">
                        SP
                      </div>
                      <span className="font-bold text-sm text-[#10110F]">SkillProof Notification</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-[#C8F169]/30 text-[#10110F] px-2 py-0.5 rounded font-bold">
                      Audit Recorded
                    </span>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-[#292B27] leading-relaxed">
                      Hello <strong>{activeAlert.workerName}</strong>,
                    </p>
                    <p className="text-sm text-[#292B27] leading-relaxed">
                      Great news! An authorized employer verifier from{' '}
                      <strong>{activeAlert.employerCompany}</strong> has reviewed and officially certified your
                      demonstrated skill evidence record for{' '}
                      <span className="font-mono font-bold bg-[#F4F1E8] px-1.5 py-0.5 rounded">
                        {activeAlert.proofId}
                      </span>
                      .
                    </p>
                  </div>

                  {/* Employer Verifier Signature Box */}
                  <div className="p-4 rounded-xl bg-[#F4F1E8] border border-[#292B27]/10 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#10110F]">
                      <Building className="w-4 h-4 text-emerald-700" />
                      <span>{activeAlert.employerCompany}</span>
                    </div>
                    <div className="text-xs text-[#5C6057] pl-6">
                      Signed by: <strong className="text-[#10110F]">{activeAlert.employerVerifier}</strong>{' '}
                      ({activeAlert.employerTitle})
                    </div>
                    <div className="text-xs text-[#292B27] pl-6 pt-2 italic border-t border-[#292B27]/10 mt-2">
                      "{activeAlert.notes}"
                    </div>
                  </div>

                  {/* Direct Action Link in Email */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onOpenVerification) {
                          onOpenVerification(activeAlert.proofId);
                        }
                      }}
                      className="w-full bg-[#10110F] hover:bg-black text-[#C8F169] text-xs font-mono font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <span>View Live Employer Verification Document</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Email Footer */}
                  <div className="text-[11px] text-[#72766D] font-mono text-center pt-2 border-t border-[#292B27]/10">
                    This notification was automatically dispatched to {activeAlert.to} by the SkillProof Trust
                    Service. Zero password or sign-in required to inspect cryptographic evidence.
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#72766D]">
                <Mail className="w-12 h-12 stroke-1 mb-2 text-[#72766D]" />
                <p className="text-sm font-semibold text-[#10110F]">No alerts yet</p>
                <p className="text-xs max-w-xs mt-1">
                  When an employer confirms verification on the public verification view, an alert will be
                  triggered here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
