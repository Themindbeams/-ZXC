import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConnectCalendarEvent } from '../../types';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  Lock,
  Plus,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Filter,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const ConnectCalendar: React.FC = () => {
  const {
    connectCalendarEvents,
    currentUser,
    activeBranch,
    rsvpCalendarEvent,
    addCalendarEvent,
    openRecordInInspector
  } = useApp();

  const [activeScope, setActiveScope] = useState<'all' | 'personal' | 'team' | 'branch'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().slice(0, 16));
  const [newEndDate, setNewEndDate] = useState(
    new Date(Date.now() + 3600000).toISOString().slice(0, 16)
  );
  const [newCategory, setNewCategory] = useState<ConnectCalendarEvent['category']>('internal_staff');
  const [newPrivacy, setNewPrivacy] = useState<ConnectCalendarEvent['privacy']>('team_only');
  const [newLocation, setNewLocation] = useState('Conference Room Alpha');

  // Filter events based on scope, category, and confidentiality rules
  const visibleEvents = connectCalendarEvents.filter(ev => {
    // Confidentiality Check: If event is confidential_restricted, only attendees or HR/Admin can see details!
    if (ev.privacy === 'confidential_restricted') {
      const isAttendee = ev.attendees.includes(currentUser.id) || ev.organizerId === currentUser.id;
      const isPrivileged = currentUser.role === 'Super Admin' || currentUser.role === 'Payroll Officer';
      if (!isAttendee && !isPrivileged) return false;
    }

    if (activeScope !== 'all' && ev.scope !== activeScope) return false;
    if (selectedCategory !== 'all' && ev.category !== selectedCategory) return false;
    return true;
  });

  const getCategoryBadge = (category: ConnectCalendarEvent['category']) => {
    switch (category) {
      case 'customer_appointment':
        return <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Customer Appointment</span>;
      case 'operational_booking':
        return <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">Operational Booking</span>;
      case 'social_event':
        return <span className="text-[10px] bg-pink-100 text-pink-800 font-bold px-2 py-0.5 rounded-full">Company Social</span>;
      default:
        return <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">Internal Staff</span>;
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCalendarEvent({
      title: newTitle,
      description: newDescription,
      startDate: newStartDate,
      endDate: newEndDate,
      category: newCategory,
      scope: 'team',
      privacy: newPrivacy,
      organizerId: currentUser.id,
      organizerName: currentUser.name,
      attendees: [currentUser.id],
      locationOrRoom: newLocation
    });

    setIsAddEventModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header with Scope Switcher & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Enterprise Calendars & Appointments</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized personal, team, and facility schedules with confidentiality boundaries for sensitive HR reviews.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Scope Segmented Pill */}
          <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-semibold">
            <button
              onClick={() => setActiveScope('all')}
              className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
                activeScope === 'all' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveScope('personal')}
              className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
                activeScope === 'personal' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Calendar
            </button>
            <button
              onClick={() => setActiveScope('team')}
              className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
                activeScope === 'team' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Team
            </button>
            <button
              onClick={() => setActiveScope('branch')}
              className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
                activeScope === 'branch' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Branch / Bays
            </button>
          </div>

          {/* Add Event Button */}
          <button
            onClick={() => setIsAddEventModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Category Filter Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">Filter:</span>
        {[
          { id: 'all', label: 'All Categories' },
          { id: 'internal_staff', label: 'Internal Staff Meetings' },
          { id: 'customer_appointment', label: 'Customer Appointments' },
          { id: 'operational_booking', label: 'Operational Bay Bookings' },
          { id: 'social_event', label: 'Social & Celebrations' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Events List / Agenda Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleEvents.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
            <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No events found for this filter.</p>
          </div>
        ) : (
          visibleEvents.map(ev => {
            const myRsvp = ev.rsvpStatus[currentUser.id] || 'Pending';
            return (
              <div
                key={ev.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between hover:border-indigo-300 transition-all space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    {getCategoryBadge(ev.category)}
                    {ev.privacy === 'confidential_restricted' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        <Lock className="w-3 h-3" />
                        Confidential
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{ev.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{ev.description}</p>

                  <div className="space-y-1 pt-1 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        {ev.startDate.replace('T', ' ')} — {ev.endDate.includes('T') ? ev.endDate.split('T')[1] : ev.endDate}
                      </span>
                    </div>

                    {ev.locationOrRoom && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{ev.locationOrRoom}</span>
                      </div>
                    )}
                  </div>

                  {ev.linkedRecord && (
                    <div className="p-2 rounded bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs">
                      <span className="text-indigo-800 font-medium">Record: {ev.linkedRecord.title}</span>
                      <button
                        onClick={() => openRecordInInspector(ev.linkedRecord!.type, ev.linkedRecord!.id, ev.linkedRecord!.title)}
                        className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 cursor-pointer"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* RSVP Controls Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Organizer: <span className="font-semibold text-slate-700">{ev.organizerName}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 mr-1">RSVP:</span>
                    <button
                      onClick={() => rsvpCalendarEvent(ev.id, 'Accepted')}
                      className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                        myRsvp === 'Accepted'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => rsvpCalendarEvent(ev.id, 'Tentative')}
                      className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                        myRsvp === 'Tentative'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                    >
                      Tentative
                    </button>
                    <button
                      onClick={() => rsvpCalendarEvent(ev.id, 'Declined')}
                      className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                        myRsvp === 'Declined'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                      }`}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Appointment Modal */}
      {isAddEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Add Calendar Appointment</h3>
              </div>
              <button
                onClick={() => setIsAddEventModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Appointment Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. VIP Vehicle Intake / Service Bay 02 Booking"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={newStartDate}
                    onChange={e => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={newEndDate}
                    onChange={e => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="internal_staff">Internal Staff Meeting</option>
                    <option value="customer_appointment">Customer Appointment</option>
                    <option value="operational_booking">Operational Bay Booking</option>
                    <option value="social_event">Company Social Event</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Privacy Level</label>
                  <select
                    value={newPrivacy}
                    onChange={e => setNewPrivacy(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="team_only">Team Only</option>
                    <option value="public">Public to Branch</option>
                    <option value="confidential_restricted">Confidential / HR Restricted</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Room or Equipment Resource</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                  placeholder="e.g. Workshop Bay 02 / Boardroom"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddEventModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
