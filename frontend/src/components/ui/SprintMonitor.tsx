import React, { useState } from 'react';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';

export const SprintMonitor: React.FC = () => {
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [rebalanceResult, setRebalanceResult] = useState<string | null>(null);

  const handleRebalance = async () => {
    setIsRebalancing(true);
    try {
      const response = await fetch('/api/academic/rebalance', { method: 'POST' });
      if (response.ok) {
        setRebalanceResult("Targets Re-calculated & Applied.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRebalancing(false);
    }
  };

  return (
    <div className="flex-1 border-b-2 border-brutal-black bg-brutal-white flex flex-col min-h-[33%]">
      <div className="bg-brutal-black text-brutal-white font-mono text-[10px] p-2 flex items-center justify-between border-b-2 border-brutal-black">
        <span className="uppercase tracking-widest font-bold flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-brutal-orange" />
          ♟️ Sprint Monitor
        </span>
        <span className="bg-brutal-orange text-brutal-black px-1 font-bold">1 ALERT</span>
      </div>
      
      <div className="p-4 flex-1 flex flex-col overflow-y-auto">
        <p className="text-[10px] font-mono text-brutal-gray-dark uppercase tracking-widest mb-3">
          Notification MCP - Real-time alerts
        </p>

        {/* Amber Warning Box */}
        <div className="border-2 border-brutal-black bg-amber-50 p-3 shadow-[2px_2px_0px_0px_rgba(15,15,15,1)] mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase text-amber-700 tracking-wider">CRITICAL SCHEDULE OVERRIDE DETECTED</span>
          </div>
          <p className="text-[11px] font-sans text-brutal-black leading-relaxed mb-3">
            Official Notice shifts 'Operating Systems Final Exam' to June 10. This creates a severe conflict with your current milestone targets. You currently have a 'Low' confidence score in this subject with only 12 available study hours remaining before the new date.
          </p>
          <button 
            onClick={handleRebalance}
            disabled={isRebalancing}
            className="w-full bg-brutal-black text-brutal-white font-mono text-[10px] font-bold py-2 px-3 border border-brutal-black flex items-center justify-center gap-2 hover:bg-brutal-orange hover:text-brutal-black transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isRebalancing ? 'animate-spin' : ''}`} />
            {isRebalancing ? "RE-BALANCING..." : "[RE-BALANCE SYSTEM SPRINT TARGETS]"}
          </button>
          
          {rebalanceResult && (
            <div className="mt-2 text-[10px] font-bold font-mono text-green-700 uppercase tracking-widest text-center">
              {rebalanceResult}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
