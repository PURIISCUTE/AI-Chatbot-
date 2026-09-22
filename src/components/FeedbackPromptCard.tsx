import React, { useState } from 'react';
import { Star, CheckCircle, HeartHandshake, AlertCircle } from 'lucide-react';
import { FeedbackRecord } from '../types';

interface FeedbackPromptCardProps {
  businessId: string;
  businessName: string;
  onSubmitFeedback: (feedback: {
    businessId: string;
    rating: number;
    tags: string[];
    comments: string;
    customerName?: string;
  }) => Promise<void>;
  alreadySubmitted?: FeedbackRecord;
  isSubmitting?: boolean;
}

const AVAILABLE_TAGS = [
  '⚡ Super Fast Response',
  '🎯 Accurate Answers',
  '🤝 Polite & Helpful',
  '📅 Easy Booking',
  '💡 24/7 Availability',
  '⚠️ Needs Follow-up'
];

export const FeedbackPromptCard: React.FC<FeedbackPromptCardProps> = ({
  businessId,
  businessName,
  onSubmitFeedback,
  alreadySubmitted,
  isSubmitting = false
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>(['⚡ Super Fast Response', '🤝 Polite & Helpful']);
  const [comments, setComments] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isDone, setIsDone] = useState(Boolean(alreadySubmitted));

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmitFeedback({
      businessId,
      rating,
      tags: selectedTags,
      comments: comments.trim() || (rating >= 4 ? 'Great 24/7 customer service experience!' : 'Could be improved.'),
      customerName: customerName.trim() || 'Valued Guest'
    });
    setIsDone(true);
  };

  if (isDone || alreadySubmitted) {
    const finalRating = alreadySubmitted?.rating || rating;
    return (
      <div id="feedback-submitted-card" className="mt-3 bg-white border border-emerald-200 rounded-xl p-4 shadow-sm text-slate-800">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs uppercase tracking-wider mb-2">
          <CheckCircle className="w-4 h-4" />
          <span>Feedback Successfully Recorded</span>
        </div>
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-4 h-4 ${
                s <= finalRating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
              }`}
            />
          ))}
          <span className="text-xs font-bold text-slate-700 ml-2">
            {finalRating} / 5 Stars
          </span>
        </div>
        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
          {alreadySubmitted?.comments || comments || 'Thank you for helping us elevate our customer experience!'}
        </p>
        <div className="mt-2 text-xs text-emerald-800 font-medium flex items-center gap-1.5">
          <HeartHandshake className="w-4 h-4 text-emerald-600" />
          <span>Your feedback has been logged in our CSAT ledger.</span>
        </div>
      </div>
    );
  }

  return (
    <div id="feedback-prompt-form-card" className="mt-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-slate-800 max-w-md">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
          How was your 24/7 customer experience?
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div>
          <label className="block text-slate-600 mb-1 font-medium">Rate our service response:</label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = hoverRating ? star <= hoverRating : star <= rating;
                return (
                  <button
                    key={star}
                    type="button"
                    id={`btn-star-rating-${star}`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        active ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-semibold text-slate-700">
              {rating === 5 && '🌟 Exceptional!'}
              {rating === 4 && '👍 Very Good'}
              {rating === 3 && '😐 Average'}
              {rating === 2 && '👎 Needs Improvement'}
              {rating === 1 && '⚠️ Dissatisfied'}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-slate-600 mb-1.5 font-medium">Highlights & Tags:</label>
          <div className="flex flex-wrap gap-1.5">
            {AVAILABLE_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-2 py-1 rounded-full text-[11px] font-medium transition-colors ${
                    isSelected
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-slate-600 mb-1 font-medium">Your Name (Optional):</label>
          <input
            type="text"
            placeholder="e.g. Alex Morgan"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-slate-600 mb-1 font-medium">Comments or Suggestions:</label>
          <textarea
            rows={2}
            placeholder="Tell us what you liked or how we can improve our 24/7 service..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          id="btn-submit-feedback-card"
          className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold rounded-lg shadow-sm transition-colors text-xs"
        >
          {isSubmitting ? 'Recording Feedback...' : 'Submit Feedback & CSAT'}
        </button>
      </form>
    </div>
  );
};
