import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  HelpCircle,
  Clock,
  Shield,
  Send,
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { BusinessPreset } from '../types';

interface KnowledgeBaseExplorerProps {
  business: BusinessPreset;
  onAskQuestionInChat: (question: string) => void;
}

export const KnowledgeBaseExplorer: React.FC<KnowledgeBaseExplorerProps> = ({
  business,
  onAskQuestionInChat
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Hours & Location', 'Pricing & Policy', 'Services', 'Support'];

  const filteredFaqs = business.faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Overview Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>24/7 Automated Knowledge Engine</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">{business.name} Knowledge Base</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              The AI Customer Service Chatbot references this validated source of truth 24/7 to deliver zero-hallucination answers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Hours</div>
                <div className="font-semibold text-slate-800 truncate">{business.operatingHours.split('•')[0]}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Support Line</div>
                <div className="font-semibold text-slate-800 truncate">{business.phone}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Email</div>
                <div className="font-semibold text-slate-800 truncate">{business.email}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="input-search-kb"
            type="text"
            placeholder="Search FAQs, policies, services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredFaqs.map((faq, index) => (
          <div
            key={index}
            id={`faq-card-${index}`}
            className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-md">
                  {faq.category}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Live in 24/7 AI
                </span>
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5 flex items-start gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{faq.question}</span>
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed pl-5">
                {faq.answer}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                id={`btn-ask-faq-${index}`}
                onClick={() => onAskQuestionInChat(faq.question)}
                className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                <span>Test in 24/7 Chat</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Business Policies Overview */}
      {business.policies && business.policies.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-3">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Official Operating & Service Policies</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {business.policies.map((p, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 text-xs">
                <div className="font-bold text-slate-800">{p.title}</div>
                <div className="text-slate-600 mt-1 leading-relaxed">{p.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
