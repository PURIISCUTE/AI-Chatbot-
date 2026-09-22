import React, { useState, useEffect } from 'react';
import { BUSINESS_PRESETS, TEST_SCENARIOS } from './data/presets';
import { BusinessPreset, ChatMessage, BookingRecord, FeedbackRecord, TestScenario, DispatchedEmail } from './types';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { CustomerWebsitePreview } from './components/CustomerWebsitePreview';
import { FloatingChatWidget } from './components/FloatingChatWidget';
import { BookingsManager } from './components/BookingsManager';
import { FeedbackDashboard } from './components/FeedbackDashboard';
import { KnowledgeBaseExplorer } from './components/KnowledgeBaseExplorer';
import { ScenarioDrawer } from './components/ScenarioDrawer';
import { EmailViewerModal } from './components/EmailViewerModal';
import { EmailDispatchesManager } from './components/EmailDispatchesManager';

export default function App() {
  const [businesses] = useState<BusinessPreset[]>(BUSINESS_PRESETS);
  const [currentBusiness, setCurrentBusiness] = useState<BusinessPreset>(BUSINESS_PRESETS[0]);
  const [activeTab, setActiveTab] = useState<'website' | 'chat' | 'bookings' | 'feedback' | 'kb' | 'emails'>('website');
  const [isScenarioDrawerOpen, setIsScenarioDrawerOpen] = useState(false);
  const [isFloatingWidgetOpen, setIsFloatingWidgetOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [viewingEmail, setViewingEmail] = useState<DispatchedEmail | null>(null);

  // Initial greeting for a business
  const getInitialMessage = (business: BusinessPreset): ChatMessage => ({
    id: `msg-init-${Date.now()}`,
    sender: 'assistant',
    text: `Hello! Welcome to **${business.name}**. I am your 24/7 Agentic Customer Service Concierge.\n\nI autonomously execute:\n1. **Inquiries & Policies**: Instant answers on hours, services, and amenities.\n2. **Autonomous Bookings**: Check live calendar availability and confirm reservations.\n3. **Email Confirmations**: Automatically dispatch official email passes with calendar invites to Gmail, Yahoo, etc.\n4. **Existing Reservations**: Look up or cancel your bookings.\n5. **Feedback & CSAT**: Share your experience with immediate resolution.\n\nWhat can I take care of for you today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    intent: 'general',
    quickReplies: business.quickPrompts
  });

  const [messages, setMessages] = useState<ChatMessage[]>([getInitialMessage(BUSINESS_PRESETS[0])]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [emails, setEmails] = useState<DispatchedEmail[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackRecord[]>([]);

  // Load bookings, emails, and feedback from server on mount
  useEffect(() => {
    fetchBookings();
    fetchEmails();
    fetchFeedback();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    }
  };

  const fetchEmails = async () => {
    try {
      const res = await fetch('/api/emails');
      if (res.ok) {
        const data = await res.json();
        setEmails(data.emails || []);
      }
    } catch (err) {
      console.error('Failed to load emails:', err);
    }
  };

  const fetchFeedback = async () => {
    try {
      const res = await fetch('/api/feedback');
      if (res.ok) {
        const data = await res.json();
        setFeedbackList(data.items || []);
      }
    } catch (err) {
      console.error('Failed to load feedback:', err);
    }
  };

  // Switch business
  const handleSelectBusiness = (business: BusinessPreset) => {
    setCurrentBusiness(business);
    setMessages([getInitialMessage(business)]);
  };

  // View booking email helper
  const handleViewBookingEmail = (booking: BookingRecord) => {
    const match = emails.find(
      (e) => e.bookingId === booking.id || e.confirmationCode === booking.confirmationCode
    );
    if (match) {
      setViewingEmail(match);
    } else {
      // Create instant viewable receipt pass
      setViewingEmail({
        id: `email-${booking.id}`,
        bookingId: booking.id,
        confirmationCode: booking.confirmationCode,
        to: booking.customerEmail || 'customer@example.com',
        subject: `Booking Confirmed: ${booking.serviceName} (#${booking.confirmationCode})`,
        textContent: `Hi ${booking.customerName},\n\nYour reservation #${booking.confirmationCode} for ${booking.serviceName} on ${booking.date} at ${booking.time} is officially confirmed.\n\nThank you for choosing ${currentBusiness.name}!`,
        htmlContent: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
            <div style="border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 20px;">
              <h1 style="color: #065f46; font-size: 22px; margin: 0;">Reservation Confirmation</h1>
              <p style="color: #047857; margin: 4px 0 0 0; font-size: 14px;">Confirmation Code: <strong style="font-family: monospace; font-size: 16px;">#${booking.confirmationCode}</strong></p>
            </div>
            <p style="color: #334155; font-size: 15px;">Hello <strong>${booking.customerName}</strong>,</p>
            <p style="color: #334155; font-size: 14px; line-height: 1.5;">Thank you for reserving with us! Your reservation for <strong>${booking.serviceName}</strong> has been confirmed.</p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <h3 style="color: #0f172a; margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Reservation Details</h3>
              <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; color: #64748b;">Service:</td><td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${booking.serviceName}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748b;">Date:</td><td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${booking.date}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748b;">Time:</td><td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${booking.time}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748b;">Party Size:</td><td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${booking.guestCount} guests</td></tr>
                <tr><td style="padding: 6px 0; color: #64748b;">Contact:</td><td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${booking.customerEmail || booking.customerPhone || 'N/A'}</td></tr>
              </table>
            </div>
            <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 12px;">Need changes? Simply reply to this email or chat with our 24/7 AI Concierge anytime.</p>
          </div>
        `,
        status: 'delivered',
        provider: 'Direct SMTP / 24/7 Automated Dispatcher',
        sentAt: booking.createdAt,
        businessName: currentBusiness.name,
        serviceName: booking.serviceName,
        date: booking.date,
        time: booking.time,
        customerName: booking.customerName,
        hasCalendarAttachment: true
      });
    }
  };

  // Send message in chat
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6),
          business: currentBusiness
        })
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: ChatMessage = {
          id: `msg-bot-${Date.now()}`,
          sender: 'assistant',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          intent: data.intent,
          responseTimeMs: data.responseTimeMs,
          bookingDraft: data.bookingDraft,
          bookingConfirmation: data.bookingConfirmation,
          showFeedbackPrompt: data.showFeedbackPrompt,
          isEscalated: data.isEscalated,
          quickReplies: data.quickReplies,
          agenticTrace: data.agenticTrace
        };
        setMessages((prev) => [...prev, botMsg]);

        // If the agent autonomously confirmed a booking, refresh bookings list!
        if (data.bookingConfirmation) {
          fetchBookings();
          fetchEmails();
        }
        // If feedback was logged, refresh feedback list
        if (data.intent === 'feedback') {
          fetchFeedback();
        }
      } else {
        throw new Error('Chat API returned an error');
      }
    } catch (err) {
      const botMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        text: `Thank you for contacting **${currentBusiness.name}**! Our 24/7 system is online. Would you like to check availability or make an inquiry?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: 'general',
        quickReplies: currentBusiness.quickPrompts
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm booking
  const handleConfirmBooking = async (bookingData: any) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (res.ok) {
        const newRecord: BookingRecord = await res.json();
        setBookings((prev) => [newRecord, ...prev]);
        fetchEmails();

        // Append confirmation card in chat
        const confirmMsg: ChatMessage = {
          id: `msg-bot-confirm-${Date.now()}`,
          sender: 'assistant',
          text: `🎉 Your reservation has been **successfully confirmed 24/7**! An official confirmation email with calendar invite (.ics) has been dispatched to **${newRecord.customerEmail || 'your email'}**.\n\nHere is your verified booking pass:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          intent: 'booking',
          bookingConfirmation: newRecord,
          agenticTrace: [
            {
              tool: 'create_booking',
              label: 'Reservation Saved to Live Database',
              args: { confirmationCode: newRecord.confirmationCode },
              durationMs: 45,
              status: 'completed'
            },
            {
              tool: 'dispatch_email_confirmation',
              label: `Dispatched Confirmation Pass to ${newRecord.customerEmail || 'customer'}`,
              durationMs: 95,
              status: 'completed'
            }
          ],
          quickReplies: ['View My Schedule', 'Check Email Confirmations', 'Leave Feedback']
        };
        setMessages((prev) => [...prev, confirmMsg]);
      }
    } catch (err) {
      console.error('Failed to confirm booking:', err);
    }
  };

  // Cancel booking
  const handleCancelBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
        );

        const cancelNotice: ChatMessage = {
          id: `msg-bot-cancel-${Date.now()}`,
          sender: 'assistant',
          text: `Your reservation has been cancelled. In accordance with our 24/7 policy, zero cancellation fees apply. Would you like to reschedule for another time?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          intent: 'booking',
          agenticTrace: [
            {
              tool: 'cancel_booking',
              label: 'Status Updated to Cancelled in Database',
              durationMs: 38,
              status: 'completed'
            }
          ],
          quickReplies: ['Book New Slot', 'Ask a Question', 'Leave Feedback']
        };
        setMessages((prev) => [...prev, cancelNotice]);
      }
    } catch (err) {
      console.error('Failed to cancel booking:', err);
    }
  };

  // Submit feedback
  const handleSubmitFeedback = async (feedbackData: any) => {
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
      });

      if (res.ok) {
        const newRecord: FeedbackRecord = await res.json();
        setFeedbackList((prev) => [newRecord, ...prev]);

        const replyMsg: ChatMessage = {
          id: `msg-bot-feedback-${Date.now()}`,
          sender: 'assistant',
          text:
            feedbackData.rating >= 4
              ? `🌟 Thank you so much for the glowing **${feedbackData.rating}-star review**! We're thrilled that our 24/7 automated service exceeded your expectations.`
              : `🙏 Thank you for sharing your candid feedback. We have dispatched your comments to our Customer Experience Director for immediate follow-up.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          intent: 'feedback',
          feedbackSubmitted: newRecord,
          agenticTrace: [
            {
              tool: 'submit_feedback',
              label: 'CSAT Ledger Synchronized',
              durationMs: 29,
              status: 'completed'
            }
          ],
          quickReplies: ['Book a Service', 'View Operating Hours', 'Speak to Human Agent']
        };
        setMessages((prev) => [...prev, replyMsg]);
      }
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  // Select test scenario
  const handleSelectScenario = (scenario: TestScenario) => {
    const target = businesses.find((b) => b.id === scenario.targetBusinessId);
    if (target && target.id !== currentBusiness.id) {
      setCurrentBusiness(target);
    }
    setIsFloatingWidgetOpen(true);
    handleSendMessage(scenario.userMessage);
  };

  // Reset chat
  const handleResetChat = () => {
    setMessages([getInitialMessage(currentBusiness)]);
  };

  // CSAT Score
  const totalFeedback = feedbackList.length;
  const positiveFeedback = feedbackList.filter((f) => f.sentiment === 'positive').length;
  const csatScore = totalFeedback > 0 ? Math.round((positiveFeedback / totalFeedback) * 100) : 98;

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-800 flex flex-col relative">
      {/* Header */}
      <Header
        currentBusiness={currentBusiness}
        businesses={businesses}
        onSelectBusiness={handleSelectBusiness}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        bookingCount={bookings.filter((b) => b.status === 'confirmed').length}
        emailCount={emails.length}
        csatScore={csatScore}
        onOpenScenarios={() => setIsScenarioDrawerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'website' && (
          <div>
            <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="text-base">💡</span>
                <div>
                  <strong>Live Customer Website Mode:</strong> Experience this like actual visitors do. The floating 24/7 AI chatbot sits in the bottom-right corner, ready to handle inquiries, bookings with automated email confirmations, and reviews.
                </div>
              </div>
              <button
                onClick={() => setIsFloatingWidgetOpen(true)}
                className="px-3 py-1 bg-emerald-700 text-white rounded-lg font-semibold text-xs hover:bg-emerald-800 shrink-0 cursor-pointer"
              >
                Open Bot Widget
              </button>
            </div>

            <CustomerWebsitePreview
              business={currentBusiness}
              onOpenChatWithPrompt={(prompt) => {
                setIsFloatingWidgetOpen(true);
                handleSendMessage(prompt);
              }}
            />
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto">
            <ChatInterface
              business={currentBusiness}
              messages={messages}
              onSendMessage={handleSendMessage}
              onConfirmBooking={handleConfirmBooking}
              onCancelBooking={handleCancelBooking}
              onSubmitFeedback={handleSubmitFeedback}
              onResetChat={handleResetChat}
              isLoading={isLoading}
              onViewEmailReceipt={handleViewBookingEmail}
            />
          </div>
        )}

        {activeTab === 'bookings' && (
          <BookingsManager
            bookings={bookings}
            currentBusiness={currentBusiness}
            onCancelBooking={handleCancelBooking}
            onAddManualBooking={handleConfirmBooking}
            onViewBookingEmail={handleViewBookingEmail}
            onNavigateToChat={() => {
              setActiveTab('chat');
              setIsFloatingWidgetOpen(true);
            }}
          />
        )}

        {activeTab === 'emails' && (
          <EmailDispatchesManager
            emails={emails}
            currentBusiness={currentBusiness}
            onSelectEmailToView={(email: DispatchedEmail) => setViewingEmail(email)}
            onResendEmail={async (bookingId: string, toEmail: string) => {
              try {
                await fetch(`/api/emails/resend/${bookingId}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ to: toEmail })
                });
                await fetchEmails();
              } catch (err) {
                console.error('Failed to resend email:', err);
              }
            }}
            onRefreshEmails={fetchEmails}
          />
        )}

        {activeTab === 'feedback' && (
          <FeedbackDashboard
            feedbackList={feedbackList}
            currentBusiness={currentBusiness}
            onSubmitNewFeedback={handleSubmitFeedback}
            onNavigateToChat={() => {
              setActiveTab('chat');
              setIsFloatingWidgetOpen(true);
            }}
          />
        )}

        {activeTab === 'kb' && (
          <KnowledgeBaseExplorer
            business={currentBusiness}
            onAskQuestionInChat={(q) => {
              setActiveTab('chat');
              setIsFloatingWidgetOpen(true);
              handleSendMessage(q);
            }}
          />
        )}
      </main>

      {/* Floating Chatbot Widget (Always available on website view) */}
      {activeTab === 'website' && (
        <FloatingChatWidget
          business={currentBusiness}
          messages={messages}
          onSendMessage={handleSendMessage}
          onConfirmBooking={handleConfirmBooking}
          onCancelBooking={handleCancelBooking}
          onSubmitFeedback={handleSubmitFeedback}
          onResetChat={handleResetChat}
          isLoading={isLoading}
          isOpen={isFloatingWidgetOpen}
          onToggleOpen={() => setIsFloatingWidgetOpen(!isFloatingWidgetOpen)}
          onViewEmailReceipt={handleViewBookingEmail}
        />
      )}

      {/* Scenario Test Drawer */}
      <ScenarioDrawer
        isOpen={isScenarioDrawerOpen}
        onClose={() => setIsScenarioDrawerOpen(false)}
        scenarios={TEST_SCENARIOS}
        businesses={businesses}
        onSelectScenario={handleSelectScenario}
      />

      {/* Interactive Email Confirmation Pass & Raw Protocol Viewer Modal */}
      {viewingEmail && (
        <EmailViewerModal
          email={viewingEmail}
          isOpen={Boolean(viewingEmail)}
          onClose={() => setViewingEmail(null)}
          onResendToEmail={async (bookingId: string, toEmail: string) => {
            try {
              await fetch(`/api/emails/resend/${bookingId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: toEmail })
              });
              await fetchEmails();
            } catch (err) {
              console.error('Failed to resend confirmation email:', err);
            }
          }}
        />
      )}
    </div>
  );
}
