export interface ServiceItem {
  id: string;
  name: string;
  durationMinutes: number;
  price: string;
  description: string;
  category: string;
}

export interface BusinessPreset {
  id: string;
  name: string;
  category: string;
  badge: string;
  tagline: string;
  description: string;
  operatingHours: string;
  phone: string;
  email: string;
  address: string;
  avatar: string;
  themeColor: string; // Tailwind color class or hex
  accentBg: string;
  services: ServiceItem[];
  faqs: {
    question: string;
    answer: string;
    category: 'Hours & Location' | 'Pricing & Policy' | 'Services' | 'Support';
  }[];
  policies: {
    title: string;
    description: string;
  }[];
  quickPrompts: string[];
}

export interface BookingDraft {
  serviceId?: string;
  serviceName?: string;
  date?: string;
  time?: string;
  guestCount?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  specialNotes?: string;
}

export interface BookingRecord {
  id: string;
  businessId: string;
  serviceName: string;
  date: string;
  time: string;
  guestCount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialNotes?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  createdAt: string;
  confirmationCode: string;
  emailStatus?: 'sent_smtp' | 'delivered' | 'failed' | 'pending';
  emailDeliveredTo?: string;
}

export interface DispatchedEmail {
  id: string;
  bookingId: string;
  confirmationCode: string;
  to: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  status: 'sent_smtp' | 'delivered' | 'failed';
  provider: string; // 'Direct SMTP' | '24/7 Automated Dispatcher'
  sentAt: string;
  businessName: string;
  serviceName: string;
  date: string;
  time: string;
  customerName: string;
  hasCalendarAttachment: boolean;
}

export interface FeedbackRecord {
  id: string;
  businessId: string;
  rating: number; // 1 to 5
  sentiment: 'positive' | 'neutral' | 'negative';
  tags: string[];
  comments: string;
  customerName?: string;
  createdAt: string;
  escalatedToHuman?: boolean;
  aiResolution?: string;
}

export interface AgenticStep {
  tool: string;
  label: string;
  args?: Record<string, any>;
  result?: Record<string, any>;
  durationMs?: number;
  status: 'executing' | 'completed' | 'failed';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  intent?: 'inquiry' | 'booking' | 'feedback' | 'general' | 'escalation';
  responseTimeMs?: number;
  bookingDraft?: BookingDraft;
  bookingConfirmation?: BookingRecord;
  showFeedbackPrompt?: boolean;
  feedbackSubmitted?: FeedbackRecord;
  quickReplies?: string[];
  isEscalated?: boolean;
  agenticTrace?: AgenticStep[];
}

export interface TestScenario {
  id: string;
  title: string;
  description: string;
  category: 'inquiry' | 'booking' | 'feedback';
  userMessage: string;
  targetBusinessId: string;
}
