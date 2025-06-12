import React from 'react';
import { useParams } from 'react-router-dom';
import { useCourse } from '../hooks/useCourse';
import Logo from './Logo';

interface HeaderProps {
  className?: string;
  onClick?: () => void;
}

export default function Header({ className = '', onClick }: HeaderProps) {
  const { course } = useCourse()
console.log('[Header] course:', course)

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
        
        <div className="w-24" /> {/* Spacer for alignment */}
      </div>
    </div>
  );
}