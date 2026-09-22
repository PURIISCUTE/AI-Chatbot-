import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, CheckCircle2, AlertCircle, Download, X, ExternalLink, Eye, Sparkles } from 'lucide-react';
import { BookingDraft, BookingRecord, ServiceItem } from '../types';

interface BookingCardProps {
  draft?: BookingDraft;
  confirmation?: BookingRecord;
  services: ServiceItem[];
  businessId: string;
  onConfirmBooking: (bookingData: any) => Promise<void>;
  onCancelBooking?: (bookingId: string) => Promise<void>;
  onViewEmailReceipt?: (confirmation: BookingRecord) => void;
  isSubmitting?: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  draft,
  confirmation,
  services,
  businessId,
  onConfirmBooking,
  onCancelBooking,
  onViewEmailReceipt,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    serviceName: draft?.serviceName || services[0]?.name || 'General Service',
    date: draft?.date || new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: draft?.time || '14:00',
    guestCount: draft?.guestCount || 1,
    customerName: draft?.customerName || '',
    customerEmail: draft?.customerEmail || '',
    customerPhone: draft?.customerPhone || '',
    specialNotes: draft?.specialNotes || ''
  });

  const [formError, setFormError] = useState('');

  if (confirmation) {
    const confCode = confirmation.confirmationCode || (confirmation as any).bookingId || 'CONF-OK';
    const sName = confirmation.serviceName || (confirmation as any).service || 'Confirmed Reservation';
    const cName = confirmation.customerName || (confirmation as any).name || 'Valued Guest';
    const dateStr = confirmation.date || new Date().toISOString().split('T')[0];
    const timeStr = confirmation.time || '14:00';
    const gCount = confirmation.guestCount || 1;
    const contactInfo = confirmation.customerEmail || confirmation.customerPhone || (confirmation as any).email || (confirmation as any).phone || 'On file';

    // Generate iCal download link
    const downloadICal = () => {
      const cleanDate = dateStr.replace(/[^0-9]/g, '').slice(0, 8);
      const cleanTime = timeStr.replace(/[^0-9]/g, '').padEnd(4, '0').slice(0, 4);
      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//24/7 AI Customer Concierge//EN
BEGIN:VEVENT
UID:${confirmation.id || confCode}@customerbot.ai
SUMMARY:${sName}
DESCRIPTION:Reservation confirmed with code ${confCode}. Notes: ${confirmation.specialNotes || 'None'}
DTSTART:${cleanDate}T${cleanTime}00
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Booking-${confCode}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <div id={`confirmation-card-${confirmation.id || confCode}`} className="mt-3 bg-white border border-emerald-200 rounded-xl p-4 shadow-sm text-slate-800">
        <div className="flex items-center justify-between border-b border-emerald-100 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Reservation Confirmed 24/7</div>
              <div className="text-sm font-bold text-slate-900">{sName}</div>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold rounded-md">
            {confCode}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs mb-3">
          <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-2 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Date: <strong className="text-slate-800">{dateStr}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-2 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Time: <strong className="text-slate-800">{timeStr}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-2 rounded-lg">
            <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Guest: <strong className="text-slate-800">{cName} ({gCount}p)</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-2 rounded-lg">
            <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Contact: <strong className="text-slate-800">{contactInfo}</strong></span>
          </div>
        </div>

        {confirmation.specialNotes && (
          <div className="text-xs bg-amber-50/60 border border-amber-200/60 text-amber-900 p-2 rounded-lg mb-3">
            <strong>Notes:</strong> {confirmation.specialNotes}
          </div>
        )}

        {/* Email Confirmation Dispatch Badge & Actions */}
        <div className="mb-3 bg-emerald-50/80 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-900 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-semibold">
              <Mail className="w-3.5 h-3.5 text-emerald-700" />
              <span>Confirmation Email Dispatched</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-800">
              Pass Issued
            </span>
          </div>
          <div className="text-[11px] text-emerald-800">
            A confirmation pass with calendar invite (.ics) was sent to <strong className="font-mono">{confirmation.customerEmail || contactInfo}</strong>.
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-emerald-200/60 flex-wrap">
            {onViewEmailReceipt && (
              <button
                onClick={() => onViewEmailReceipt(confirmation)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-semibold text-[11px] transition-colors shadow-2xs"
              >
                <Eye className="w-3 h-3 text-emerald-700" />
                <span>View Email Receipt</span>
              </button>
            )}

            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                confirmation.customerEmail || contactInfo
              )}&su=${encodeURIComponent(`Booking Confirmed: ${sName} (#${confCode})`)}&body=${encodeURIComponent(
                `Your reservation #${confCode} for ${sName} on ${dateStr} at ${timeStr} is confirmed.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 bg-white hover:bg-red-50 text-red-700 border border-red-200 rounded font-semibold text-[11px] transition-colors shadow-2xs"
            >
              <span className="font-bold text-red-600">G</span>
              <span>Open in Gmail</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>

            <a
              href={`https://compose.mail.yahoo.com/?to=${encodeURIComponent(
                confirmation.customerEmail || contactInfo
              )}&subj=${encodeURIComponent(`Booking Confirmed: ${sName} (#${confCode})`)}&body=${encodeURIComponent(
                `Your reservation #${confCode} for ${sName} on ${dateStr} at ${timeStr} is confirmed.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 rounded font-semibold text-[11px] transition-colors shadow-2xs"
            >
              <span className="font-bold text-purple-600">Y!</span>
              <span>Open in Yahoo</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            id={`btn-calendar-${confirmation.id || confCode}`}
            onClick={downloadICal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Add to Calendar (.ics)
          </button>

          {onCancelBooking && confirmation.status !== 'cancelled' && (
            <button
              id={`btn-cancel-booking-${confirmation.id || confCode}`}
              onClick={() => onCancelBooking(confirmation.id)}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium transition-colors"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    );
  }

  // Interactive booking draft form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim()) {
      setFormError('Please provide your name.');
      return;
    }
    if (!formData.customerEmail.trim() && !formData.customerPhone.trim()) {
      setFormError('Please enter either an email or phone number for confirmation.');
      return;
    }
    setFormError('');

    await onConfirmBooking({
      businessId,
      ...formData
    });
  };

  return (
    <div id="booking-draft-card" className="mt-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-slate-800 max-w-md">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
        <Calendar className="w-4 h-4 text-emerald-600" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Confirm Your Booking Details
        </span>
      </div>

      {formError && (
        <div className="mb-3 flex items-center gap-1.5 text-xs bg-rose-50 text-rose-700 p-2 rounded-lg border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
        <div>
          <label className="block font-medium text-slate-700 mb-1">Service</label>
          <select
            value={formData.serviceName}
            onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {services.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name} ({s.price})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">Time Slot</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Your Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Jordan Smith"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">Party / Guests</label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.guestCount}
              onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block font-medium text-slate-700">Email Address (Gmail, Yahoo, etc.) *</label>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, customerEmail: 'pratiksurya02@gmail.com' })}
              className="text-[10px] text-emerald-700 hover:text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 cursor-pointer"
            >
              Use pratiksurya02@gmail.com
            </button>
          </div>
          <input
            type="email"
            placeholder="e.g. name@gmail.com or user@yahoo.com"
            value={formData.customerEmail}
            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <p className="text-[10px] text-slate-500 mt-0.5">
            Your official confirmation pass, booking receipt, and calendar invite (.ics) will be dispatched here.
          </p>
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Phone Number (Optional)</label>
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={formData.customerPhone}
            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Special Requests (Optional)</label>
          <input
            type="text"
            placeholder="e.g. Dietary preference, quiet room, specific focus area"
            value={formData.specialNotes}
            onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            id="btn-submit-booking-draft"
            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? 'Confirming 24/7 Booking...' : 'Instant Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  );
};
