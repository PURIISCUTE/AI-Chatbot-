import React from 'react';
import {
  Bot,
  Calendar,
  Star,
  BookOpen,
  Sparkles,
  ChevronDown,
  Building2,
  Zap,
  CheckCircle2,
  Mail
} from 'lucide-react';
import { BusinessPreset } from '../types';

interface HeaderProps {
  currentBusiness: BusinessPreset;
  businesses: BusinessPreset[];
  onSelectBusiness: (business: BusinessPreset) => void;
  activeTab: 'website' | 'chat' | 'bookings' | 'feedback' | 'kb' | 'emails';
  onSelectTab: (tab: 'website' | 'chat' | 'bookings' | 'feedback' | 'kb' | 'emails') => void;
  bookingCount: number;
  emailCount?: number;
  csatScore: number;
  onOpenScenarios: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentBusiness,
  businesses,
  onSelectBusiness,
  activeTab,
  onSelectTab,
  bookingCount,
  emailCount = 0,
  csatScore,
  onOpenScenarios
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Top Banner: Status & Business Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & 24/7 Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs shrink-0">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  24/7 Agentic Customer Service
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  LIVE & WORKING
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Inquiries • Autonomous Bookings • Sentiment & CSAT Resolution
              </p>
            </div>
          </div>

          {/* Business Preset Switcher & Scenario Trigger */}
          <div className="flex items-center gap-2.5">
            {/* Business Selector */}
            <div className="relative">
              <label htmlFor="business-selector" className="sr-only">Switch Business</label>
              <select
                id="business-selector"
                value={currentBusiness.id}
                onChange={(e) => {
                  const found = businesses.find((b) => b.id === e.target.value);
                  if (found) onSelectBusiness(found);
                }}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-2xs appearance-none"
              >
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.avatar} {b.name} ({b.badge})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>

            {/* Test Scenarios Quick Button */}
            <button
              id="btn-open-scenarios-drawer"
              onClick={onOpenScenarios}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-semibold rounded-xl shadow-2xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden md:inline">Test Scenarios</span>
              <span className="md:hidden">Tests</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-slate-100 overflow-x-auto py-1">
          <button
            id="tab-website"
            onClick={() => onSelectTab('website')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'website'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="text-sm">🌐</span>
            <span>Customer Website + Floating Widget</span>
          </button>

          <button
            id="tab-chat"
            onClick={() => onSelectTab('chat')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Dedicated Chat View</span>
          </button>

          <button
            id="tab-bookings"
            onClick={() => onSelectTab('bookings')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Bookings & Schedule</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'bookings'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {bookingCount}
            </span>
          </button>

          <button
            id="tab-emails"
            onClick={() => onSelectTab('emails')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'emails'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Mail className="w-4 h-4 text-emerald-500" />
            <span>Email Confirmations</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'emails'
                  ? 'bg-emerald-400 text-slate-900'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {emailCount}
            </span>
          </button>

          <button
            id="tab-feedback"
            onClick={() => onSelectTab('feedback')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'feedback'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Customer Feedback & CSAT</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'feedback'
                  ? 'bg-amber-400 text-slate-900'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {csatScore}%
            </span>
          </button>

          <button
            id="tab-kb"
            onClick={() => onSelectTab('kb')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'kb'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Knowledge Base & Rules</span>
          </button>
        </div>
      </div>
    </header>
  );
};
