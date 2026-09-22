import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  Calendar,
  Star,
  Headphones,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Cpu,
  CheckCircle2,
  Terminal,
  Paperclip
} from 'lucide-react';
import { ChatMessage, BusinessPreset, BookingDraft, BookingRecord, AgenticStep } from '../types';
import { BookingCard } from './BookingCard';
import { FeedbackPromptCard } from './FeedbackPromptCard';

// Subtle Web Audio synthesizer for customer service feedback
function playChime(type: 'sent' | 'received' | 'success', soundEnabled: boolean) {
  if (!soundEnabled || typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'sent') {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'received') {
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch {
    // Ignore audio restriction errors
  }
}

interface ChatInterfaceProps {
  business: BusinessPreset;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onConfirmBooking: (bookingData: any) => Promise<void>;
  onCancelBooking: (bookingId: string) => Promise<void>;
  onSubmitFeedback: (feedbackData: any) => Promise<void>;
  onResetChat: () => void;
  isLoading: boolean;
  isWidgetMode?: boolean;
  onCloseWidget?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  business,
  messages,
  onSendMessage,
  onConfirmBooking,
  onCancelBooking,
  onSubmitFeedback,
  onResetChat,
  isLoading,
  isWidgetMode = false,
  onCloseWidget
}) => {
  const [inputText, setInputText] = useState('');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // Play sound when last message is from bot
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.sender === 'assistant' && messages.length > 1) {
      if (lastMsg.bookingConfirmation) {
        playChime('success', soundEnabled);
      } else {
        playChime('received', soundEnabled);
      }
    }
  }, [messages, isLoading]);

  // Speech synthesis toggle
  const toggleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    } else {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    playChime('sent', soundEnabled);
    await onSendMessage(text);
    inputRef.current?.focus();
  };

  // Helper to render basic markdown formatting: **bold**, bullet points, code tags
  const formatMessageText = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          // Bullet points
          if (line.trim().startsWith('•') || line.trim().startsWith('*') || line.trim().startsWith('-')) {
            const itemText = line.trim().replace(/^[•*-]\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-emerald-500 font-bold mt-1 shrink-0">•</span>
                <div className="flex-1">{renderFormattedParts(itemText)}</div>
              </div>
            );
          }

          // Numbered lists
          const numMatch = line.match(/^(\d+)\.\s*(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="font-semibold text-emerald-600 shrink-0">{numMatch[1]}.</span>
                <div className="flex-1">{renderFormattedParts(numMatch[2])}</div>
              </div>
            );
          }

          return <div key={idx}>{renderFormattedParts(line)}</div>;
        })}
      </div>
    );
  };

  const renderFormattedParts = (text: string) => {
    // Replace `code` and **bold**
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="px-1.5 py-0.5 bg-slate-100 text-slate-900 border border-slate-200 font-mono text-[11px] rounded">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div
      className={`flex flex-col bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-md transition-all ${
        isWidgetMode ? 'h-[600px] w-full' : 'h-[720px]'
      }`}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-lg shadow-2xs">
              {business.avatar}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">{business.name}</h2>
              <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                24/7 Agentic AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-xs">
              Instant inquiries, automated bookings & live resolution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Audio Chime Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute notification sound' : 'Unmute sound'}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset Chat */}
          <button
            id="btn-reset-chat"
            onClick={onResetChat}
            title="Reset Conversation"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {isWidgetMode && onCloseWidget && (
            <button
              id="btn-close-widget"
              onClick={onCloseWidget}
              title="Minimize chat"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* SLA & Live Status Strip */}
      <div className="px-4 py-1.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-b border-emerald-100/80 text-[11px] text-emerald-900 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Real-time autonomous tool execution enabled</span>
        </div>
        <span className="text-[10px] text-emerald-700 font-semibold font-mono">
          Latency: &lt; 0.8s
        </span>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/60">
        {/* Quick Starter Pills if fresh session */}
        {messages.length <= 1 && (
          <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
            <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Recommended Quick Customer Actions:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {business.quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  id={`quick-prompt-${i}`}
                  onClick={() => onSendMessage(prompt)}
                  className="text-xs text-left px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 rounded-lg text-slate-700 transition-all flex items-center gap-1.5"
                >
                  <span>{prompt}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="text-[11px] text-slate-500 bg-slate-200/80 px-3 py-1 rounded-full font-medium">
                  {msg.text}
                </div>
              </div>
            );
          }

          const hasAgenticTrace = msg.agenticTrace && msg.agenticTrace.length > 0;
          const isTraceOpen = expandedTraceId === msg.id;

          return (
            <div
              key={msg.id}
              id={`chat-msg-${msg.id}`}
              className={`flex gap-2.5 sm:gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sm shrink-0 shadow-2xs mt-0.5">
                  {business.avatar}
                </div>
              )}

              <div className="max-w-[88%] sm:max-w-[80%]">
                <div
                  className={`rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm shadow-2xs ${
                    isAssistant
                      ? 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs'
                      : 'bg-slate-900 text-white rounded-tr-xs'
                  }`}
                >
                  {/* Agentic Trace Accordion Toggle for Assistant messages */}
                  {isAssistant && hasAgenticTrace && (
                    <div className="mb-2.5 pb-2 border-b border-slate-100">
                      <button
                        id={`btn-trace-toggle-${msg.id}`}
                        onClick={() => setExpandedTraceId(isTraceOpen ? null : msg.id)}
                        className="inline-flex items-center gap-1.5 px-2 py-0.8 bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/80 text-emerald-800 text-[10px] font-semibold rounded-md transition-colors"
                      >
                        <Cpu className="w-3 h-3 text-emerald-600" />
                        <span>Agentic Tools Executed ({msg.agenticTrace!.length})</span>
                        {isTraceOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      {/* Expanded Trace Details */}
                      {isTraceOpen && (
                        <div className="mt-2 p-2.5 bg-slate-900 text-slate-200 rounded-lg text-[10px] font-mono space-y-1.5 border border-slate-800 animate-in fade-in duration-200">
                          <div className="text-slate-400 font-semibold border-b border-slate-800 pb-1 flex items-center justify-between">
                            <span>🤖 Autonomous Function Calls</span>
                            <span className="text-emerald-400 font-mono">Status: 200 OK</span>
                          </div>
                          {msg.agenticTrace!.map((step, idx) => (
                            <div key={idx} className="space-y-0.5 pt-1">
                              <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span>[{step.tool}]</span>
                                <span className="text-slate-400 font-normal">({step.durationMs || 30}ms)</span>
                              </div>
                              <div className="text-slate-300 pl-4">
                                {step.label}
                              </div>
                              {step.result?.summary && (
                                <div className="text-slate-400 pl-4 italic">
                                  &rarr; {step.result.summary}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Formatted Message Body */}
                  {formatMessageText(msg.text)}

                  {/* Interactive Booking Draft Form */}
                  {msg.bookingDraft && (
                    <BookingCard
                      draft={msg.bookingDraft}
                      services={business.services}
                      businessId={business.id}
                      onConfirmBooking={onConfirmBooking}
                    />
                  )}

                  {/* Confirmed Booking Ticket Pass */}
                  {msg.bookingConfirmation && (
                    <BookingCard
                      confirmation={msg.bookingConfirmation}
                      services={business.services}
                      businessId={business.id}
                      onConfirmBooking={onConfirmBooking}
                      onCancelBooking={onCancelBooking}
                    />
                  )}

                  {/* Feedback Prompt Card */}
                  {msg.showFeedbackPrompt && (
                    <FeedbackPromptCard
                      businessId={business.id}
                      businessName={business.name}
                      onSubmitFeedback={onSubmitFeedback}
                      alreadySubmitted={msg.feedbackSubmitted}
                    />
                  )}

                  {/* Priority Escalation Card */}
                  {msg.isEscalated && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2">
                      <Headphones className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">Human Specialist Handover Dispatched</div>
                        <div className="text-[11px] text-amber-900 mt-0.5">
                          Senior On-Duty Support Lead notified. Full conversation context transferred with zero customer repetition.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Meta Strip */}
                <div className={`flex items-center gap-2 mt-1 text-[10px] text-slate-400 ${isAssistant ? 'justify-start pl-1' : 'justify-end pr-1'}`}>
                  <span>{msg.timestamp}</span>

                  {isAssistant && msg.responseTimeMs && (
                    <span className="font-mono text-emerald-600 font-medium">
                      ⚡ {(msg.responseTimeMs / 1000).toFixed(2)}s
                    </span>
                  )}

                  {isAssistant && (
                    <button
                      id={`btn-tts-${msg.id}`}
                      onClick={() => toggleSpeak(msg.id, msg.text)}
                      title="Listen to message aloud"
                      className="hover:text-slate-700 transition-colors p-0.5"
                    >
                      {speakingId === msg.id ? (
                        <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Quick Reply Pills */}
                {msg.quickReplies && msg.quickReplies.length > 0 && isAssistant && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        id={`btn-quick-reply-${i}`}
                        onClick={() => onSendMessage(reply)}
                        className="text-[11px] font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full shadow-2xs transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {!isAssistant && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs shrink-0 shadow-2xs mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading typing indicator */}
        {isLoading && (
          <div className="flex gap-2.5 sm:gap-3 justify-start">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sm shrink-0 shadow-2xs">
              {business.avatar}
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3 shadow-2xs flex items-center gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span className="text-[11px] font-medium text-slate-500">Autonomous reasoning & verifying tools...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            id="chat-input-field"
            type="text"
            placeholder={`Ask ${business.name} anything, book a slot, or check a reservation...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all shadow-2xs"
          />

          <button
            id="btn-chat-send"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
          <span>💡 Try typing: <em>"Book Deep Tissue Massage tomorrow 3pm for Sarah"</em> or <em>"Look up booking AURA-8921"</em></span>
          <span className="hidden sm:inline font-mono">24/7 AI Engine</span>
        </div>
      </div>
    </div>
  );
};
