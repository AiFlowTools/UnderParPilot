import React from 'react';
import { Goal as GolfBall } from 'lucide-react';

interface LogoProps {
  className?: string;
  onClick?: () => void;
  courseName?: string;
}

export default function Logo({ className = '', onClick, courseName = 'Golf Club' }: LogoProps) {
  const [name, subtitle] = courseName.split(' Golf Club').map(s => s.trim());
  
  return (
    <div 
      className={`flex items-center gap-2 ${className}`}
      onClick={onClick}
    >
      <div className="relative">
        <GolfBall className="w-8 h-8 text-green-600" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#C8B273] rounded-full" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-serif text-green-600 leading-tight">{name}</span>
        <span className="text-sm text-gray-600">Golf Club{subtitle ? ` ${subtitle}` : ''}</span>
      </div>
    </div>
  );
}