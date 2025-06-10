import React from 'react';
import { AlertCircle, Home } from 'lucide-react';

interface CourseNotFoundProps {
  onRetry?: () => void;
}

export default function CourseNotFound({ onRetry }: CourseNotFoundProps) {
  const handleGoHome = () => {
    // Redirect to main domain without subdomain
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    if (parts.length >= 3) {
      // Remove subdomain and redirect
      const mainDomain = parts.slice(1).join('.');
      window.location.href = `${window.location.protocol}//${mainDomain}`;
    } else {
      // Already on main domain, just reload
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md w-full">
        <div className="flex justify-center mb-6">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Golf Course Not Found
        </h1>
        
        <p className="text-gray-600 mb-6">
          We couldn't find a golf course associated with this subdomain. 
          Please check the URL or contact support if you believe this is an error.
        </p>
        
        <div className="space-y-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          )}
          
          <button
            onClick={handleGoHome}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go to Main Site
          </button>
        </div>
      </div>
    </div>
  );
}