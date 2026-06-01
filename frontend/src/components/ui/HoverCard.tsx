import React, { useState } from 'react';

interface HoverCardProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export const HoverCard: React.FC<HoverCardProps> = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="cursor-pointer">{trigger}</div>
      {isOpen && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-brutal-white border-brutal-gray-dark border-2 p-4 text-left shadow-[4px_4px_0px_0px_rgba(15,15,15,1)] text-xs text-brutal-black font-mono transition-all">
          <div className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-brutal-white border-r-2 border-b-2 border-brutal-gray-dark rotate-45"></div>
          <div className="relative z-10">{children}</div>
        </div>
      )}
    </div>
  );
};
