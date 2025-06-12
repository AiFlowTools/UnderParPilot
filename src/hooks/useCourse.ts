import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Course {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
}

export function useCourse(courseId?: string) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      if (!courseId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('golf_courses')
          .select('id, name, logo_url, subdomain, slug, contact_email, location')
          .eq('id', courseId)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        setCourse(data);
      } catch (err: any) {
        console.error('Error fetching course:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [courseId]);

  return { course, loading, error };
}