import React from 'react';
import { Goal as GolfBall } from 'lucide-react';
import { useCourse } from '../hooks/useCourse';

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

export default function Logo({ className = '', onClick }: LogoProps) {
  const { course } = useCourse();

  return (
    <div className={`flex items-center gap-2 ${className}`} onClick={onClick}>
      <div className="relative">
        <GolfBall className="w-8 h-8 text-green-600" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#C8B273] rounded-full" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-serif text-green-600 leading-tight">
          {course?.name || 'Golf Course'}
        </span>
        <span className="text-sm text-gray-600">Golf Club</span>
      </div>
    </div>
  );
}
