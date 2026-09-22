import React from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Star,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { BusinessPreset } from '../types';

interface CustomerWebsitePreviewProps {
  business: BusinessPreset;
  onOpenChatWithPrompt: (prompt: string) => void;
}

export const CustomerWebsitePreview: React.FC<CustomerWebsitePreviewProps> = ({
  business,
  onOpenChatWithPrompt
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
      {/* Website Nav Bar */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{business.avatar}</span>
          <div>
            <div className="font-bold text-sm text-slate-900 leading-tight">{business.name}</div>
            <div className="text-[11px] text-slate-500 font-medium">{business.badge}</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <a href="#services" className="hover:text-slate-900 transition-colors">Services & Pricing</a>
          <a href="#about" className="hover:text-slate-900 transition-colors">About Us</a>
          <a href="#hours" className="hover:text-slate-900 transition-colors">Operating Hours</a>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-website-chat-cta"
            onClick={() => onOpenChatWithPrompt(`Hi! I'd like to book ${business.services[0]?.name || 'a service'}.`)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Book Online 24/7</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative p-8 md:p-14 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-full text-xs font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>24/7 AI Concierge Online • Average reply time 0.7s</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            {business.tagline}
          </h2>

          <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-xl">
            {business.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              id="btn-hero-book-now"
              onClick={() => onOpenChatWithPrompt(`I would like to book an appointment or check availability.`)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <span>Instant AI Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-hero-ask-question"
              onClick={() => onOpenChatWithPrompt(`What are your operating hours and policies?`)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all"
            >
              Ask a Question
            </button>
          </div>
        </div>

        {/* Floating Quick Trust Metric */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-slate-400 font-medium">Availability</div>
            <div className="text-white font-bold text-sm mt-0.5">24/7/365 Non-Stop</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">Instant Response</div>
            <div className="text-white font-bold text-sm mt-0.5">&lt; 1 Second</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">Customer Rating</div>
            <div className="text-white font-bold text-sm mt-0.5 flex items-center gap-1">
              <span>4.9 / 5.0</span>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">Support Line</div>
            <div className="text-white font-bold text-sm mt-0.5 truncate">{business.phone}</div>
          </div>
        </div>
      </div>

      {/* Featured Services & Experiences */}
      <div id="services" className="p-6 sm:p-10 bg-slate-50/60 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Bookable Offerings</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">Featured Services & Packages</h3>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            Our 24/7 AI chatbot can immediately check real-time calendar slots and confirm reservations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {business.services.map((s) => (
            <div
              key={s.id}
              className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-md">
                    {s.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-700">{s.price}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5">{s.name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{s.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {s.durationMinutes} mins
                </span>
                <button
                  id={`btn-book-service-${s.id}`}
                  onClick={() => onOpenChatWithPrompt(`I would like to book ${s.name} for tomorrow.`)}
                  className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>Book with AI</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info & Location Bar */}
      <div id="hours" className="p-6 sm:p-8 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="font-bold text-slate-900">Operating Schedule</div>
            <div className="text-slate-500">{business.operatingHours}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="font-bold text-slate-900">Location</div>
            <div className="text-slate-500">{business.address}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="font-bold text-slate-900">Verified Service</div>
            <div className="text-slate-500">100% Satisfaction Guarantee</div>
          </div>
        </div>
      </div>
    </div>
  );
};
