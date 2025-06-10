import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Course {
  id: string;
  name: string;
  location?: string;
  contact_email?: string;
  subdomain?: string;
  logo_url?: string;
}

export function useCourse() {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get the subdomain from the current URL
        const hostname = window.location.hostname;
        const subdomain = hostname.split('.')[0];

        // For development/localhost, use a default course ID
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
        
        let query = supabase.from('golf_courses').select('*');
        
        if (isLocalhost) {
          // Use the default course ID for localhost
          query = query.eq('id', 'c4a48f69-a535-4f57-8716-d34cff63059b');
        } else {
          // Use subdomain for production
          query = query.eq('subdomain', subdomain);
        }

        const { data, error: fetchError } = await query.single();

        if (fetchError) {
          throw fetchError;
        }

        setCourse(data);
      } catch (err: any) {
        console.error('Error fetching course:', err);
        setError(err.message);
        // Set a default course for fallback
        setCourse({
          id: 'c4a48f69-a535-4f57-8716-d34cff63059b',
          name: 'Pine Valley Golf Club',
          location: 'Pine Valley, NJ'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, []);

  return { course, loading, error };
}