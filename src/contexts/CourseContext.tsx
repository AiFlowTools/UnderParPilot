import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getSubdomain } from '../utils/getSubdomain';

interface GolfCourse {
  id: string;
  name: string;
  location: string;
  contact_email: string;
  subdomain: string;
  user_id: string;
}

interface CourseContextType {
  course: GolfCourse | null;
  loading: boolean;
  error: string | null;
}

const CourseContext = createContext<CourseContextType>({
  course: null,
  loading: true,
  error: null,
});

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [course, setCourse] = useState<GolfCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCourse() {
      try {
        const subdomain = getSubdomain();
        
        // For development, use a default course
        if (subdomain === 'dev') {
          const { data, error: fetchError } = await supabase
            .from('golf_courses')
            .select('*')
            .maybeSingle();

          if (fetchError) throw fetchError;
          if (!data) {
            setError('No default golf course found in development environment');
            navigate('/404');
            return;
          }
          
          setCourse(data);
          return;
        }
        
        // No subdomain found
        if (!subdomain) {
          setError('No golf course specified');
          navigate('/404');
          return;
        }

        // Fetch course by subdomain
        const { data, error: fetchError } = await supabase
          .from('golf_courses')
          .select('*')
          .eq('subdomain', subdomain)
          .maybeSingle();

        if (fetchError) throw fetchError;
        if (!data) {
          setError(`Golf course not found for subdomain: ${subdomain}`);
          navigate('/404');
          return;
        }

        setCourse(data);
      } catch (err: any) {
        setError(err.message);
        navigate('/404');
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [navigate]);

  return (
    <CourseContext.Provider value={{ course, loading, error }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
}