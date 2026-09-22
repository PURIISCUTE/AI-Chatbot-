import React, { useState } from 'react';
import {
  Mail,
  Search,
  ExternalLink,
  Send,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Eye,
  RefreshCw,
  Sparkles,
  Inbox,
  Filter
} from 'lucide-react';
import { DispatchedEmail, BusinessPreset } from '../types';

interface EmailDispatchesManagerProps {
  emails: DispatchedEmail[];
  currentBusiness: BusinessPreset;
  onSelectEmailToView: (email: DispatchedEmail) => void;
  onResendEmail: (bookingId: string, toEmail: string) => Promise<void>;
  onRefreshEmails: () => Promise<void>;
}

export const EmailDispatchesManager: React.FC<EmailDispatchesManagerProps> = ({
  emails,
  currentBusiness,
  onSelectEmailToView,
  onResendEmail,
  onRefreshEmails
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState<'all' | 'gmail' | 'yahoo' | 'other'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [quickTestEmail, setQuickTestEmail] = useState('');
  const [isSubmittingTest, setIsSubmittingTest] = useState(false);
  const [testSentMessage, setTestSentMessage] = useState('');

  const filteredEmails = emails.filter((e) => {
    const matchesSearch =
      e.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.confirmationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.serviceName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (domainFilter === 'gmail') return e.to.toLowerCase().includes('gmail.com');
    if (domainFilter === 'yahoo') return e.to.toLowerCase().includes('yahoo.com');
    if (domainFilter === 'other') return !e.to.toLowerCase().includes('gmail.com') && !e.to.toLowerCase().includes('yahoo.com');
    return true;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshEmails();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleQuickSend = async (targetEmail: string) => {
    if (!targetEmail.trim()) return;
    setIsSubmittingTest(true);
    try {
      // Find latest booking or use first
      const bookingId = emails[0]?.bookingId || 'bk-101';
      await onResendEmail(bookingId, targetEmail.trim());
      setTestSentMessage(`Confirmation email dispatched to ${targetEmail}!`);
      setTimeout(() => setTestSentMessage(''), 4000);
      setQuickTestEmail('');
      await onRefreshEmails();
    } catch (err) {
      console.error('Failed to trigger quick email send:', err);
    } finally {
      setIsSubmittingTest(false);
    }
  };

  // Domain metrics
  const gmailCount = emails.filter((e) => e.to.toLowerCase().includes('gmail.com')).length;
  const yahooCount = emails.filter((e) => e.to.toLowerCase().includes('yahoo.com')).length;
  const totalDispatched = emails.length;

  return (
    <div className="space-y-5">
      {/* Top Banner & KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Dispatched</span>
            <Mail className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalDispatched}</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% Confirmation Rate
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gmail Inboxes</span>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">G</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{gmailCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Direct Webmail & App Sync</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Yahoo Mail</span>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">Y!</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{yahooCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Calendar & Pass Sync</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Dispatch Engine</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-sm font-bold text-slate-900 mt-2">Active 24/7</div>
          <div className="text-[11px] text-indigo-600 mt-1 font-medium">Nodemailer + Direct Webmail</div>
        </div>
      </div>

      {/* Quick Test Sender Box */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200/80 rounded-xl p-4 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">📬</span>
              <h3 className="text-sm font-bold text-slate-900">
                Instant Email Confirmation Verification
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200/80 text-emerald-800">
                Real-Time
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Whenever the AI chatbot books an appointment, an email confirmation pass is automatically dispatched with calendar invites (.ics). You can also test sending to your real Gmail or Yahoo address below.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => handleQuickSend('pratiksurya02@gmail.com')}
              disabled={isSubmittingTest}
              className="px-2.5 py-1.5 text-xs bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <span className="font-bold text-red-600">G</span>
              <span>Send to pratiksurya02@gmail.com</span>
            </button>
            <button
              onClick={() => handleQuickSend('testuser@yahoo.com')}
              disabled={isSubmittingTest}
              className="px-2.5 py-1.5 text-xs bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <span className="font-bold text-purple-600">Y!</span>
              <span>Send to testuser@yahoo.com</span>
            </button>
          </div>
        </div>

        {/* Custom Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleQuickSend(quickTestEmail);
          }}
          className="mt-3 pt-3 border-t border-emerald-200/60 flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="relative flex-1 w-full">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="email"
              placeholder="Or enter any custom address (e.g. your personal Gmail or Yahoo)..."
              value={quickTestEmail}
              onChange={(e) => setQuickTestEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmittingTest || !quickTestEmail.trim()}
            className="w-full sm:w-auto px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmittingTest ? 'Dispatching...' : 'Dispatch Test Email'}</span>
          </button>
        </form>

        {testSentMessage && (
          <div className="mt-2 text-xs text-emerald-800 font-semibold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{testSentMessage}</span>
          </div>
        )}
      </div>

      {/* Action Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by email, guest name, code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Domain Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs shrink-0">
            <button
              onClick={() => setDomainFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                domainFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Domains
            </button>
            <button
              onClick={() => setDomainFilter('gmail')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                domainFilter === 'gmail'
                  ? 'bg-white text-red-600 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="font-bold text-red-600">G</span> Gmail ({gmailCount})
            </button>
            <button
              onClick={() => setDomainFilter('yahoo')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                domainFilter === 'yahoo'
                  ? 'bg-white text-purple-600 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="font-bold text-purple-600">Y!</span> Yahoo ({yahooCount})
            </button>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Sync Log</span>
        </button>
      </div>

      {/* Dispatched Emails List */}
      <div className="space-y-3">
        {filteredEmails.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
            <Inbox className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-semibold text-slate-700">No dispatched emails match your search.</p>
            <p className="text-xs text-slate-400 mt-1">
              Ask the chatbot to book a reservation or use the quick dispatcher above to send a confirmation pass.
            </p>
          </div>
        ) : (
          filteredEmails.map((email) => {
            const isGmail = email.to.toLowerCase().includes('gmail.com');
            const isYahoo = email.to.toLowerCase().includes('yahoo.com');

            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
              email.to
            )}&su=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.textContent)}`;

            const yahooUrl = `https://compose.mail.yahoo.com/?to=${encodeURIComponent(
              email.to
            )}&subj=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.textContent)}`;

            return (
              <div
                key={email.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-slate-900 text-white font-mono text-[11px] font-bold rounded-md">
                      #{email.confirmationCode}
                    </span>

                    {isGmail && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                        <span className="font-extrabold text-red-600">G</span> Gmail Delivery
                      </span>
                    )}

                    {isYahoo && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        <span className="font-extrabold text-purple-600">Y!</span> Yahoo Delivery
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {email.status === 'sent_smtp' ? 'Direct SMTP Sent' : 'Delivered Pass'}
                    </span>

                    <span className="text-xs text-slate-400">
                      {new Date(email.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-slate-900 truncate">
                    {email.subject}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400">Recipient:</span>{' '}
                      <strong className="text-emerald-700 font-mono">{email.to}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Guest:</span>{' '}
                      <strong className="text-slate-800">{email.customerName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Booking:</span>{' '}
                      <span>{email.date} at {email.time}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Provider:</span>{' '}
                      <span className="font-mono text-[11px]">{email.provider}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => onSelectEmailToView(email)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Email</span>
                  </button>

                  <a
                    href={gmailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                    title="Open in Gmail"
                  >
                    <span className="font-bold text-red-600">G</span>
                    <span className="hidden sm:inline">Gmail</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <a
                    href={yahooUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                    title="Open in Yahoo"
                  >
                    <span className="font-bold text-purple-600">Y!</span>
                    <span className="hidden sm:inline">Yahoo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
