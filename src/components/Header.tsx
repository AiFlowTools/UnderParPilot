import React from 'react';
import { Info } from 'lucide-react';
import { useCourse } from '../hooks/useCourse';
import Logo from './Logo';

interface HeaderProps {
  className?: string;
  onClick?: () => void;
  onHowItWorksClick?: () => void;
}

export default function Header({ className = '', onClick, onHowItWorksClick }: HeaderProps) {
  const { course } = useCourse();

  return (
    <div className={`fixed top-0 left-0 right-0 bg-white shadow-md z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center" onClick={onClick}>
          {course?.logo_url ? (
            <img 
              src={course.logo_url} 
              alt="Course Logo" 
              className="h-10 max-h-[40px] mr-3"
            />
          ) : (
            <Logo className="cursor-pointer hover:opacity-90 transition-opacity" />
          )}
          
          {course?.name && (
            <h1 className="font-bold text-xl">{course.name}</h1>
          )}
        </div>
        
        {/* How It Works Button */}
        <div className="flex items-center space-x-4">
          {onHowItWorksClick && (
            <button
              onClick={onHowItWorksClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors group relative"
              aria-label="How It Works"
              title="How It Works"
            >
              <Info className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors" />
              
              {/* Tooltip - positioned below the icon */}
              <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg transform translate-y-1 group-hover:translate-y-0">
                How It Works
                {/* Triangle pointer pointing up */}
                <div className="absolute bottom-full right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}