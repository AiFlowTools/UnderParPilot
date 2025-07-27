import React, { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { useCourse } from '../hooks/useCourse';
import Logo from './Logo';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../hooks/useLanguage';

interface HeaderProps {
  className?: string;
  onClick?: () => void;
  onHowItWorksClick?: () => void;
}

export default function Header({ className = '', onClick, onHowItWorksClick }: HeaderProps) {
  const { course } = useCourse();
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''} ${className}`}>
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div className="flex items-center" onClick={onClick}>
          {course?.logo_url ? (
            <img 
              src={course.logo_url} 
              alt="Course Logo" 
              className="h-12 max-h-[48px] mr-4 rounded-lg shadow-sm"
            />
          ) : (
            <Logo className="cursor-pointer hover:opacity-90 transition-opacity mr-4" />
          )}
          
          {course?.name && (
            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-900 leading-tight">
                {course.name}
              </h1>
              <p className="text-sm text-gray-600 font-medium">Golf Club</p>
            </div>
          )}
        </div>
        
        {/* How It Works Button */}
        <div className="flex items-center gap-3">
          <LanguageToggle />
          
          {onHowItWorksClick && (
            <button
              onClick={onHowItWorksClick}
              className="p-3 hover:bg-gray-100 rounded-full transition-all duration-200 group relative shadow-sm hover:shadow-md border border-gray-200 hover:border-gray-300"
              aria-label={t('howItWorks')}
              title={t('howItWorks')}
            >
              <Info className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition-colors" />
              
              {/* Tooltip - positioned below the icon */}
              <div className="absolute top-full right-0 mt-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg transform translate-y-1 group-hover:translate-y-0">
                {t('howItWorks')}
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
