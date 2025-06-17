import React from 'react';
import { useCourse } from '../hooks/useCourse';

export default function DebugInfo() {
  const { course, loading, error } = useCourse();

  if (typeof window === 'undefined') return null;

  const debugData = {
    hostname: window.location.hostname,
    href: window.location.href,
    protocol: window.location.protocol,
    port: window.location.port,
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    userAgent: navigator.userAgent,
    course,
    loading,
    error,
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseKeyExists: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-md max-h-96 overflow-auto z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(debugData, null, 2)}
      </pre>
    </div>
  );
}