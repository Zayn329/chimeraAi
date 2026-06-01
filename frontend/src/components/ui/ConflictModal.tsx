import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  eventDate: string;
  conflictsWith: string[];
}

export const ConflictModal: React.FC<ConflictModalProps> = ({
  isOpen, onClose, eventName, eventDate, conflictsWith
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brutal-black/60 backdrop-blur-sm">
      <div className="border-3 border-brutal-black bg-brutal-white p-0 shadow-[8px_8px_0px_0px_rgba(15,15,15,1)] max-w-md w-full mx-4 relative animate-shake">
        {/* Header */}
        <div className="bg-red-600 text-brutal-white px-5 py-3 flex items-center justify-between border-b-2 border-brutal-black">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <span className="font-mono font-bold text-xs uppercase tracking-widest">
              ⚠️ Scheduling Conflict
            </span>
          </div>
          <button onClick={onClose} className="hover:opacity-70 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="border-2 border-red-400 bg-red-50 p-4">
            <p className="font-bold text-sm uppercase tracking-wide text-red-800 mb-2">
              Conflict Detected
            </p>
            <p className="text-xs text-brutal-black leading-relaxed">
              The event <strong className="text-red-700">"{eventName}"</strong> scheduled
              for <strong className="font-mono">{eventDate}</strong> clashes with
              existing calendar entries:
            </p>
            <ul className="mt-2 space-y-1">
              {conflictsWith.map((c, i) => (
                <li key={i} className="text-xs font-mono text-red-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-red-500 inline-block" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-brutal-gray-light border border-brutal-black p-3">
            <p className="text-[10px] font-mono text-brutal-gray-dark uppercase tracking-wider mb-1">
              Recommended Action
            </p>
            <p className="text-xs text-brutal-black leading-relaxed">
              Review your calendar and consider rescheduling one of the conflicting events to avoid overlap.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-brutal-black text-brutal-white font-mono uppercase font-bold py-2.5 text-xs tracking-widest border-2 border-brutal-black hover:bg-brutal-white hover:text-brutal-black hover:shadow-[3px_3px_0px_0px_rgba(15,15,15,1)] active:shadow-none transition-all"
          >
            Acknowledge & Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
