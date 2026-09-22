import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Bot, Sparkles, ChevronDown, Maximize2, Minimize2 } from 'lucide-react';
import { BusinessPreset, ChatMessage } from '../types';
import { ChatInterface } from './ChatInterface';

interface FloatingChatWidgetProps {
  business: BusinessPreset;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onConfirmBooking: (bookingData: any) => Promise<void>;
  onCancelBooking: (bookingId: string) => Promise<void>;
  onSubmitFeedback: (feedbackData: any) => Promise<void>;
  onResetChat: () => void;
  isLoading: boolean;
  isOpen: boolean;
  onToggleOpen: () => void;
  onOpenWithPrompt?: (prompt: string) => void;
}

export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({
  business,
  messages,
  onSendMessage,
  onConfirmBooking,
  onCancelBooking,
  onSubmitFeedback,
  onResetChat,
  isLoading,
  isOpen,
  onToggleOpen,
  onOpenWithPrompt
}) => {
  const [showProactiveBubble, setShowProactiveBubble] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowProactiveBubble(false);
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Proactive Speech Bubble (like Intercom / Gorgias) when widget is closed */}
      {!isOpen && showProactiveBubble && (
        <div className="mb-3 mr-1 max-w-xs bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-300 relative group">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowProactiveBubble(false);
            }}
            className="absolute -top-2 -left-2 w-5 h-5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            title="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex items-start gap-2.5 cursor-pointer" onClick={onToggleOpen}>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-sm shrink-0 mt-0.5">
              {business.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-bold text-slate-900">{business.name} Concierge</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                👋 Hello! Need help booking, checking pricing, or looking up a reservation? I'm online 24/7!
              </p>
              <div className="mt-2 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                <span>Start conversation &rarr;</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Expanded Window */}
      {isOpen && (
        <div
          className={`mb-3 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all animate-in fade-in zoom-in-95 duration-200 ${
            isFullScreen
              ? 'fixed inset-4 sm:inset-10 z-50 mb-0'
              : 'w-[92vw] sm:w-[420px] max-h-[85vh]'
          }`}
        >
          {/* Top window controls */}
          <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold">{business.name} Live Concierge</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-widget-fullscreen-toggle"
                onClick={() => setIsFullScreen(!isFullScreen)}
                title={isFullScreen ? 'Restore' : 'Maximize'}
                className="p-1 hover:text-slate-200 text-slate-400 transition-colors"
              >
                {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                id="btn-widget-minimize"
                onClick={onToggleOpen}
                title="Minimize"
                className="p-1 hover:text-slate-200 text-slate-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <ChatInterface
              business={business}
              messages={messages}
              onSendMessage={onSendMessage}
              onConfirmBooking={onConfirmBooking}
              onCancelBooking={onCancelBooking}
              onSubmitFeedback={onSubmitFeedback}
              onResetChat={onResetChat}
              isLoading={isLoading}
              isWidgetMode={true}
              onCloseWidget={onToggleOpen}
            />
          </div>
        </div>
      )}

      {/* Launcher Button */}
      <button
        id="btn-floating-chat-launcher"
        onClick={onToggleOpen}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
          isOpen
            ? 'bg-slate-900 text-white hover:bg-slate-800'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
        }`}
        title={isOpen ? 'Close chat' : 'Open 24/7 Customer Service Chat'}
      >
        {isOpen ? (
          <ChevronDown className="w-6 h-6" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-amber-400 text-slate-950 font-bold text-[9px] rounded-full flex items-center justify-center shadow-xs">
              1
            </span>
            <span className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
          </>
        )}
      </button>
    </div>
  );
};
