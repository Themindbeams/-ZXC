import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Heart,
  ShieldCheck,
  Award
} from 'lucide-react';

export const ConnectActivities: React.FC = () => {
  const {
    connectActivities,
    toggleActivityAttendance,
    currentUser
  } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Company Activities & Team Gatherings</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Voluntary company celebrations, hands-on training workshops, and social hours respecting employee preferences.
          </p>
        </div>
      </div>

      {/* Respectful Employee Privacy Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Respectful Culture Standard: All company social events are strictly opt-in. Private medical or HR details are never published or broadcasted without consent.
          </span>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {connectActivities.map(activity => (
          <div
            key={activity.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-indigo-300 transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {activity.type}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {activity.attendeesCount} Attending
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{activity.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{activity.description}</p>

              <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{activity.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{activity.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{activity.location}</span>
                </div>
              </div>

              {activity.respectfulPreferencesNotice && (
                <div className="p-2.5 rounded-lg bg-slate-50 text-[11px] text-slate-500 border border-slate-100 italic">
                  Note: {activity.respectfulPreferencesNotice}
                </div>
              )}
            </div>

            {/* Attendance Toggle */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Organized by {activity.organizer}
              </span>

              <button
                onClick={() => toggleActivityAttendance(activity.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activity.isAttending
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200'
                }`}
              >
                {activity.isAttending ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Attending</span>
                  </>
                ) : (
                  <span>RSVP / Join</span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
