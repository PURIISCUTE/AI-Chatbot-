import React, { useState } from 'react';
import {
  Star,
  Smile,
  Meh,
  Frown,
  TrendingUp,
  ShieldAlert,
  HeartHandshake,
  MessageSquare,
  Filter,
  Plus
} from 'lucide-react';
import { FeedbackRecord, BusinessPreset } from '../types';

interface FeedbackDashboardProps {
  feedbackList: FeedbackRecord[];
  currentBusiness: BusinessPreset;
  onSubmitNewFeedback: (feedback: any) => Promise<void>;
  onNavigateToChat: () => void;
}

export const FeedbackDashboard: React.FC<FeedbackDashboardProps> = ({
  feedbackList,
  currentBusiness,
  onSubmitNewFeedback,
  onNavigateToChat
}) => {
  const [filterSentiment, setFilterSentiment] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFeedbackForm, setNewFeedbackForm] = useState({
    rating: 5,
    customerName: '',
    comments: '',
    tagInput: 'Lightning Fast, Helpful'
  });

  const filtered = feedbackList.filter((f) => {
    if (filterSentiment === 'all') return true;
    return f.sentiment === filterSentiment;
  });

  const total = feedbackList.length;
  const ratings = feedbackList.map((f) => f.rating);
  const avgRating = total > 0 ? (ratings.reduce((a, b) => a + b, 0) / total).toFixed(1) : '5.0';
  const positiveCount = feedbackList.filter((f) => f.sentiment === 'positive').length;
  const neutralCount = feedbackList.filter((f) => f.sentiment === 'neutral').length;
  const negativeCount = feedbackList.filter((f) => f.sentiment === 'negative').length;
  const csatScore = total > 0 ? Math.round((positiveCount / total) * 100) : 100;

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = newFeedbackForm.tagInput.split(',').map((t) => t.trim()).filter(Boolean);
    await onSubmitNewFeedback({
      businessId: currentBusiness.id,
      rating: newFeedbackForm.rating,
      customerName: newFeedbackForm.customerName || 'Direct Reviewer',
      comments: newFeedbackForm.comments || 'Great automated service!',
      tags
    });
    setShowAddModal(false);
    setNewFeedbackForm({
      rating: 5,
      customerName: '',
      comments: '',
      tagInput: 'Lightning Fast, Helpful'
    });
  };

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">CSAT Score</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1 flex items-baseline gap-1">
            <span>{csatScore}%</span>
            <span className="text-xs font-normal text-slate-400">satisfaction</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14% vs human-only queue</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Rating</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-1.5">
            <span>{avgRating}</span>
            <div className="flex text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Based on {total} reviews</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">First Contact Resolution</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">94.8%</div>
          <div className="text-[11px] text-slate-500 mt-1">Resolved without handover</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Automated Sentiment</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <span className="text-emerald-600 text-lg font-bold">{positiveCount} 👍</span>
            <span className="text-slate-400 text-sm font-normal">/ {negativeCount} ⚠️</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Real-time triage & recovery</div>
        </div>
      </div>

      {/* Sentiment Distribution Bar */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
          <span>Customer Sentiment Distribution</span>
          <span className="text-slate-500 font-normal">{total} total reviews logged</span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${total > 0 ? (positiveCount / total) * 100 : 80}%` }}
            className="bg-emerald-500 transition-all"
            title={`Positive: ${positiveCount}`}
          />
          <div
            style={{ width: `${total > 0 ? (neutralCount / total) * 100 : 15}%` }}
            className="bg-amber-400 transition-all"
            title={`Neutral: ${neutralCount}`}
          />
          <div
            style={{ width: `${total > 0 ? (negativeCount / total) * 100 : 5}%` }}
            className="bg-rose-500 transition-all"
            title={`Negative: ${negativeCount}`}
          />
        </div>
        <div className="flex items-center gap-6 mt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600">Positive: <strong>{positiveCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="text-slate-600">Neutral: <strong>{neutralCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-slate-600">Negative / Escalated: <strong>{negativeCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
          <button
            id="filter-feedback-all"
            onClick={() => setFilterSentiment('all')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filterSentiment === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Reviews
          </button>
          <button
            id="filter-feedback-pos"
            onClick={() => setFilterSentiment('positive')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filterSentiment === 'positive' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Positive
          </button>
          <button
            id="filter-feedback-neg"
            onClick={() => setFilterSentiment('negative')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filterSentiment === 'negative' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Needs Attention
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-simulate-feedback"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Submit Feedback Test
          </button>
        </div>
      </div>

      {/* Feedback Feed */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-xl p-8 text-center">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-700">No feedback entries under this filter</div>
            <p className="text-xs text-slate-500 mt-1">Submit feedback via the 24/7 chatbot to test sentiment analysis.</p>
            <button
              onClick={onNavigateToChat}
              className="mt-3 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
            >
              Open 24/7 Chatbot
            </button>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              id={`feedback-item-${item.id}`}
              className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-900">{item.customerName || 'Anonymous Guest'}</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  {item.sentiment === 'positive' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-semibold">
                      <Smile className="w-3 h-3" />
                      Positive CSAT
                    </span>
                  )}
                  {item.sentiment === 'neutral' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[11px] font-semibold">
                      <Meh className="w-3 h-3" />
                      Neutral
                    </span>
                  )}
                  {item.sentiment === 'negative' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[11px] font-semibold">
                      <Frown className="w-3 h-3" />
                      Escalated / Critical
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                "{item.comments}"
              </p>

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {item.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* AI automated resolution note */}
              {item.aiResolution && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-start gap-2 text-xs">
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-slate-600">
                    <strong className="text-slate-800">24/7 AI System Action:</strong> {item.aiResolution}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Manual Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Submit Feedback Test</h3>
            <form onSubmit={handleModalSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Rating (1-5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewFeedbackForm({ ...newFeedbackForm, rating: s })}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          s <= newFeedbackForm.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Customer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Miller"
                  value={newFeedbackForm.customerName}
                  onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, customerName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Feedback Comments</label>
                <textarea
                  rows={3}
                  placeholder="Describe the customer experience..."
                  value={newFeedbackForm.comments}
                  onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, comments: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="Lightning Fast, Accurate Answers"
                  value={newFeedbackForm.tagInput}
                  onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, tagInput: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg"
                >
                  Log Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
