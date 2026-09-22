import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Plus,
  ArrowUpDown
} from 'lucide-react';
import { BookingRecord, BusinessPreset, ServiceItem } from '../types';

interface BookingsManagerProps {
  bookings: BookingRecord[];
  currentBusiness: BusinessPreset;
  onCancelBooking: (bookingId: string) => Promise<void>;
  onAddManualBooking: (bookingData: any) => Promise<void>;
  onNavigateToChat: () => void;
  onViewBookingEmail?: (booking: BookingRecord) => void;
}

export const BookingsManager: React.FC<BookingsManagerProps> = ({
  bookings,
  currentBusiness,
  onCancelBooking,
  onAddManualBooking,
  onNavigateToChat,
  onViewBookingEmail
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBooking, setNewBooking] = useState({
    serviceName: currentBusiness.services[0]?.name || '',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '14:00',
    guestCount: 1,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    specialNotes: ''
  });

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.confirmationCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.customerName.trim()) return;
    await onAddManualBooking({
      businessId: currentBusiness.id,
      ...newBooking
    });
    setShowAddModal(false);
  };

  const downloadAllCSV = () => {
    const headers = 'Confirmation Code,Service,Date,Time,Guests,Customer Name,Email,Phone,Status\n';
    const rows = filteredBookings
      .map(
        (b) =>
          `"${b.confirmationCode}","${b.serviceName}","${b.date}","${b.time}",${b.guestCount},"${b.customerName}","${b.customerEmail}","${b.customerPhone}","${b.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bookings-Export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeCount = bookings.filter((b) => b.status === 'confirmed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Bookings</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{bookings.length}</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">Automated 24/7 scheduling</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Confirmed</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{activeCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Ready for fulfillment</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Lead Time</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">1.4 Days</div>
          <div className="text-[11px] text-slate-500 mt-1">Predictable calendar load</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">No-Show Prevention</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">99.1%</div>
          <div className="text-[11px] text-slate-500 mt-1">Instant confirmation & codes</div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="input-search-bookings"
              type="text"
              placeholder="Search by customer, code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            <button
              id="filter-status-all"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              id="filter-status-confirmed"
              onClick={() => setStatusFilter('confirmed')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                statusFilter === 'confirmed' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active
            </button>
            <button
              id="filter-status-cancelled"
              onClick={() => setStatusFilter('cancelled')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                statusFilter === 'cancelled' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            id="btn-export-bookings-csv"
            onClick={downloadAllCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <button
            id="btn-open-add-booking-modal"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Manual Booking
          </button>
        </div>
      </div>

      {/* Bookings Table / Grid */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
        {filteredBookings.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-700">No bookings match your criteria</div>
            <p className="text-xs text-slate-500 mt-1">Try testing the 24/7 chatbot to book a service automatically!</p>
            <button
              onClick={onNavigateToChat}
              className="mt-3 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg"
            >
              Open 24/7 Chatbot to Book
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Confirmation</th>
                  <th className="py-3 px-4">Service & Duration</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((b) => (
                  <tr key={b.id} id={`booking-row-${b.id}`} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {b.confirmationCode}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{b.serviceName}</div>
                      {b.specialNotes && (
                        <div className="text-[11px] text-slate-500 italic mt-0.5 max-w-xs truncate">
                          "{b.specialNotes}"
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-slate-700 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{b.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 text-[11px] mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{b.time}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{b.customerName} ({b.guestCount}p)</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[180px] flex items-center gap-1">
                        <Mail className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{b.customerEmail || b.customerPhone}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {b.status === 'confirmed' ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-semibold text-[11px]">
                            <CheckCircle className="w-3 h-3" />
                            Confirmed
                          </span>
                          <div className="text-[10px] text-emerald-700 font-medium">
                            Pass Dispatched
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full font-semibold text-[11px]">
                          <XCircle className="w-3 h-3" />
                          Cancelled
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onViewBookingEmail && (
                          <button
                            onClick={() => onViewBookingEmail(b)}
                            className="px-2.5 py-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md font-medium transition-colors"
                            title="View Dispatched Confirmation Email"
                          >
                            Email Pass
                          </button>
                        )}
                        {b.status === 'confirmed' && (
                          <button
                            id={`btn-cancel-table-${b.id}`}
                            onClick={() => onCancelBooking(b.id)}
                            className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-md font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Booking Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Add Manual Booking</h3>
            <form onSubmit={handleManualSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Service</label>
                <select
                  value={newBooking.serviceName}
                  onChange={(e) => setNewBooking({ ...newBooking, serviceName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                >
                  {currentBusiness.services.map((s) => (
                    <option key={s.id} value={s.name}>{s.name} ({s.price})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={newBooking.date}
                    onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Time</label>
                  <input
                    type="time"
                    value={newBooking.time}
                    onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={newBooking.customerName}
                    onChange={(e) => setNewBooking({ ...newBooking, customerName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Guests</label>
                  <input
                    type="number"
                    min="1"
                    value={newBooking.guestCount}
                    onChange={(e) => setNewBooking({ ...newBooking, guestCount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-medium">Recipient Email (Gmail, Yahoo, etc.) *</label>
                  <button
                    type="button"
                    onClick={() => setNewBooking({ ...newBooking, customerEmail: 'pratiksurya02@gmail.com' })}
                    className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 cursor-pointer"
                  >
                    Use pratiksurya02@gmail.com
                  </button>
                </div>
                <input
                  type="email"
                  required
                  placeholder="e.g. name@gmail.com or user@yahoo.com"
                  value={newBooking.customerEmail}
                  onChange={(e) => setNewBooking({ ...newBooking, customerEmail: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">
                  An official booking confirmation pass with calendar invite (.ics) will be dispatched here.
                </p>
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
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
