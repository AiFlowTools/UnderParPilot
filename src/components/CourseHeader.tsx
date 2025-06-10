import React from 'react';
import { Goal as GolfBall } from 'lucide-react';

interface CourseHeaderProps {
  courseName?: string;
  logoUrl?: string;
  className?: string;
  onClick?: () => void;
}

export default function CourseHeader({ 
  courseName = 'Pine Valley Golf Club', 
  logoUrl, 
  className = '', 
  onClick 
}: CourseHeaderProps) {
  return (
    <div 
      className={`flex items-center gap-2 ${className}`}
      onClick={onClick}
    >
      <div className="relative">
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt={`${courseName} logo`}
            className="w-8 h-8 object-contain"
            onError={(e) => {
              // Fallback to default icon if logo fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`${logoUrl ? 'hidden' : ''}`}>
          <GolfBall className="w-8 h-8 text-green-600" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#C8B273] rounded-full" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-serif text-green-600 leading-tight">
          {courseName.split(' ').slice(0, -2).join(' ') || courseName}
        </span>
        <span className="text-sm text-gray-600">
          {courseName.split(' ').slice(-2).join(' ') || 'Golf Club'}
        </span>
      </div>
    </div>
  );
}