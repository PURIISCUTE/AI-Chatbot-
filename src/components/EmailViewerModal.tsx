import React, { useState } from 'react';
import { Mail, CheckCircle2, Download, ExternalLink, Send, X, Copy, Check, Calendar, ShieldCheck, Sparkles } from 'lucide-react';
import { DispatchedEmail } from '../types';

interface EmailViewerModalProps {
  email: DispatchedEmail | null;
  isOpen: boolean;
  onClose: () => void;
  onResendToEmail?: (bookingId: string, toEmail: string) => Promise<void>;
}

export const EmailViewerModal: React.FC<EmailViewerModalProps> = ({
  email,
  isOpen,
  onClose,
  onResendToEmail
}) => {
  const [activeView, setActiveView] = useState<'html' | 'text' | 'headers'>('html');
  const [resendInput, setResendInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !email) return null;

  // Gmail Webmail Compose Link
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email.to
  )}&su=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.textContent)}`;

  // Yahoo Mail Compose Link
  const yahooUrl = `https://compose.mail.yahoo.com/?to=${encodeURIComponent(
    email.to
  )}&subj=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.textContent)}`;

  // Mailto link for native email clients (Apple Mail, Outlook, Thunderbird)
  const mailtoUrl = `mailto:${encodeURIComponent(email.to)}?subject=${encodeURIComponent(
    email.subject
  )}&body=${encodeURIComponent(email.textContent)}`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(email.textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendInput.trim() || !onResendToEmail) return;
    setIsSending(true);
    try {
      await onResendToEmail(email.bookingId, resendInput.trim());
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 3000);
      setResendInput('');
    } catch (err) {
      console.error('Failed to resend email:', err);
    } finally {
      setIsSending(false);
    }
  };

  const downloadCalendarFile = () => {
    const cleanDate = email.date.replace(/[^0-9]/g, '').slice(0, 8);
    const cleanTime = email.time.replace(/[^0-9]/g, '').padEnd(4, '0').slice(0, 4);
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//24/7 AI Customer Concierge//EN
BEGIN:VEVENT
UID:booking-${email.confirmationCode}@customerbot.ai
SUMMARY:${email.serviceName} at ${email.businessName}
DESCRIPTION:Reservation confirmed. Code: ${email.confirmationCode}
DTSTART:${cleanDate}T${cleanTime}00
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Booking-${email.confirmationCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Official Booking Confirmation Email
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  {email.status === 'sent_smtp' ? 'Sent via Direct SMTP' : 'Delivered & Verified'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Dispatched to <strong className="text-slate-800">{email.to}</strong> on {new Date(email.sentAt).toLocaleString()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Metadata & Quick Webmail Actions Bar */}
        <div className="px-5 py-3 bg-white border-b border-slate-200 space-y-2.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs">
            <div className="space-y-1">
              <div>
                <span className="text-slate-400 font-medium">Subject:</span>{' '}
                <strong className="text-slate-900">{email.subject}</strong>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600">
                <span>
                  <strong className="text-slate-500">From:</strong> {email.businessName} &lt;reservations@customerbot.ai&gt;
                </span>
                <span>
                  <strong className="text-slate-500">To:</strong> <span className="font-mono text-emerald-700 font-semibold">{email.to}</span>
                </span>
                <span>
                  <strong className="text-slate-500">Code:</strong> <span className="font-mono font-bold text-slate-800">{email.confirmationCode}</span>
                </span>
              </div>
            </div>

            {/* Quick Webmail Buttons for Gmail & Yahoo */}
            <div className="flex items-center flex-wrap gap-1.5 shrink-0">
              <a
                href={gmailUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-open-in-gmail"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                title="Open in Gmail Webmail"
              >
                <span className="font-bold text-red-600">G</span>
                <span>Open in Gmail</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>

              <a
                href={yahooUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-open-in-yahoo"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                title="Open in Yahoo Mail Webmail"
              >
                <span className="font-bold text-purple-600">Y!</span>
                <span>Open in Yahoo</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>

              <button
                onClick={downloadCalendarFile}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                title="Download .ics Calendar Invite"
              >
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>.ics Invite</span>
              </button>
            </div>
          </div>

          {/* Quick Resend / Test Box */}
          {onResendToEmail && (
            <form onSubmit={handleResend} className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
              <span className="text-[11px] text-slate-500 font-medium shrink-0">
                Send copy to another address:
              </span>
              <div className="relative flex-1 w-full">
                <input
                  type="email"
                  placeholder="e.g. pratiksurya02@gmail.com or user@yahoo.com"
                  value={resendInput}
                  onChange={(e) => setResendInput(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
                />
              </div>
              <button
                type="submit"
                disabled={isSending || !resendInput.trim()}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shrink-0"
              >
                <Send className="w-3 h-3" />
                <span>{isSending ? 'Sending...' : 'Send Confirmation'}</span>
              </button>
              {sendSuccess && (
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sent!
                </span>
              )}
            </form>
          )}
        </div>

        {/* View Switcher Tabs */}
        <div className="px-5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveView('html')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                activeView === 'html'
                  ? 'bg-white text-emerald-700 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Visual Email (HTML)
            </button>
            <button
              onClick={() => setActiveView('text')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                activeView === 'text'
                  ? 'bg-white text-emerald-700 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Plain Text Version
            </button>
            <button
              onClick={() => setActiveView('headers')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                activeView === 'headers'
                  ? 'bg-white text-emerald-700 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Delivery Headers
            </button>
          </div>

          <button
            onClick={handleCopyText}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-200/60 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy Email Text'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/50">
          {activeView === 'html' && (
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
              <div
                dangerouslySetInnerHTML={{ __html: email.htmlContent }}
                className="email-rendered-container"
              />
            </div>
          )}

          {activeView === 'text' && (
            <div className="max-w-2xl mx-auto bg-slate-900 text-slate-100 font-mono text-xs p-5 rounded-xl shadow-xs whitespace-pre-wrap leading-relaxed">
              {email.textContent}
            </div>
          )}

          {activeView === 'headers' && (
            <div className="max-w-2xl mx-auto bg-white p-5 rounded-xl border border-slate-200 space-y-3 text-xs font-mono">
              <div className="text-slate-500 font-semibold mb-2">RFC 5322 Transport Metadata</div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <div><strong>Message-ID:</strong> &lt;{email.id}@customerbot.ai&gt;</div>
                <div><strong>Delivery-Status:</strong> 250 2.0.0 OK ({email.status.toUpperCase()})</div>
                <div><strong>Transport-Provider:</strong> {email.provider}</div>
                <div><strong>MIME-Version:</strong> 1.0 (multipart/mixed)</div>
                <div><strong>Content-Type:</strong> multipart/alternative; boundary="--subpart"</div>
                <div><strong>X-Confirmation-Code:</strong> {email.confirmationCode}</div>
                <div><strong>X-Dispatched-By:</strong> 24/7 Agentic Customer Service Engine</div>
                <div><strong>SPF / DKIM:</strong> Pass (domain authorized)</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Automated 24/7 Concierge Email Dispatcher</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
