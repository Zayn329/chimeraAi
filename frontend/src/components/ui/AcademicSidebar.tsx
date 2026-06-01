import React, { useState, useEffect } from 'react';
import { Calendar, Star, RefreshCw } from 'lucide-react';

interface CalendarEvent {
  event_name: string;
  date: string;
  category: string;
  subject: string;
}

interface CalendarData {
  events: CalendarEvent[];
  subject_priorities: Record<string, string>;
}

interface AcademicSidebarProps {
  refreshTrigger: number; // increment to force refetch
}

const CATEGORY_STYLES: Record<string, string> = {
  Exam: 'bg-red-100 text-red-800 border-red-300',
  Deadline: 'bg-amber-100 text-amber-800 border-amber-300',
  Other: 'bg-blue-100 text-blue-800 border-blue-300',
};

const PRIORITY_STYLES: Record<string, string> = {
  'High Priority': 'bg-red-600 text-white animate-pulse',
  Medium: 'bg-amber-500 text-white',
  Low: 'bg-blue-500 text-white',
};

export const AcademicSidebar: React.FC<AcademicSidebarProps> = ({ refreshTrigger }) => {
  const [data, setData] = useState<CalendarData>({ events: [], subject_priorities: {} });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'priorities'>('calendar');

  const fetchCalendar = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/academic/calendar');
      if (res.ok) {
        const json = await res.json();
        setData({
          events: json.events || [],
          subject_priorities: json.subject_priorities || {},
        });
      }
    } catch {
      // Server may not be running; show empty state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, [refreshTrigger]);

  const sortedEvents = [...data.events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const priorityEntries = Object.entries(data.subject_priorities);

  return (
    <div className="border-2 border-brutal-black bg-brutal-white shadow-[4px_4px_0px_0px_rgba(15,15,15,1)] flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-brutal-black bg-brutal-gray-light">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brutal-black" />
          <span className="font-mono font-bold text-[10px] uppercase tracking-widest">
            Academic Hub
          </span>
        </div>
        <button
          onClick={fetchCalendar}
          className="p-1 border border-brutal-black hover:bg-brutal-black hover:text-brutal-white transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b-2 border-brutal-black">
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex-1 py-2 font-mono text-[10px] uppercase tracking-wider font-bold transition-colors ${
            activeTab === 'calendar'
              ? 'bg-brutal-black text-brutal-white'
              : 'bg-brutal-white text-brutal-black hover:bg-brutal-gray-light'
          }`}
        >
          📅 Calendar ({sortedEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('priorities')}
          className={`flex-1 py-2 font-mono text-[10px] uppercase tracking-wider font-bold border-l-2 border-brutal-black transition-colors ${
            activeTab === 'priorities'
              ? 'bg-brutal-black text-brutal-white'
              : 'bg-brutal-white text-brutal-black hover:bg-brutal-gray-light'
          }`}
        >
          🎯 Priorities ({priorityEntries.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {activeTab === 'calendar' ? (
          sortedEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs text-brutal-gray-dark font-mono">No events yet.</p>
              <p className="text-[10px] text-brutal-gray-dark mt-1">
                Upload a notice to auto-populate.
              </p>
            </div>
          ) : (
            sortedEvents.map((evt, i) => (
              <div
                key={i}
                className="border border-brutal-black p-3 bg-brutal-white hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_rgba(15,15,15,1)] transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-bold text-xs uppercase tracking-wide leading-tight">
                    {evt.event_name}
                  </h4>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 border whitespace-nowrap ${
                      CATEGORY_STYLES[evt.category] || CATEGORY_STYLES.Other
                    }`}
                  >
                    {evt.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-brutal-gray-dark">
                  <span>{evt.date}</span>
                  <span>•</span>
                  <span>{evt.subject}</span>
                </div>
              </div>
            ))
          )
        ) : priorityEntries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-brutal-gray-dark font-mono">No priorities set.</p>
            <p className="text-[10px] text-brutal-gray-dark mt-1">
              Exam events auto-set High Priority.
            </p>
          </div>
        ) : (
          priorityEntries.map(([subject, priority]) => (
            <div
              key={subject}
              className="border border-brutal-black p-3 bg-brutal-white flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-brutal-orange" />
                <span className="font-bold text-xs uppercase tracking-wide">{subject}</span>
              </div>
              <span
                className={`text-[9px] font-mono font-bold px-2 py-0.5 ${
                  PRIORITY_STYLES[priority] || 'bg-brutal-gray-light text-brutal-black'
                }`}
              >
                {priority}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
