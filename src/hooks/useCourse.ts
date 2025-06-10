import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Course {
  id: string;
  name: string;
  logo_url?: string;
  subdomain: string;
  slug: string;
  contact_email?: string;
  location?: string;
}

interface UseCourseResult {
  course: Course | null;
  loading: boolean;
  error: string | null;
}

export function useCourse(): UseCourseResult {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      try {
        setLoading(true);
        setError(null);

        // Default to 'pinevalley' for development environment
        let subdomain = 'pinevalley';
        
        // Only attempt to extract subdomain from hostname in production
        if (!import.meta.env.DEV) {
          const hostname = window.location.hostname;
          const parts = hostname.split('.');
          
          // Handle different scenarios:
          // - subdomain.domain.com -> use subdomain
          // - domain.com -> use default course
          if (parts.length >= 3) {
            // Has subdomain (e.g., testcourse.aiflowtools.com)
            subdomain = parts[0];
          } else if (parts.length === 2) {
            // No subdomain (e.g., aiflowtools.com) - use default
            subdomain = 'pinevalley';
          }
        }

        console.log('Looking for course with subdomain:', subdomain);

        // Query the golf_courses table
        const { data, error: fetchError } = await supabase
          .from('golf_courses')
          .select('*')
          .eq('subdomain', subdomain)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            // No rows returned - course not found
            setError('Course not found');
          } else {
            console.error('Error fetching course:', fetchError);
            setError('Failed to load course information');
          }
          return;
        }

        setCourse(data);
      } catch (err) {
        console.error('Error in fetchCourse:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, []);

  return { course, loading, error };
}