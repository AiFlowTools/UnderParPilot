import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Course {
  id: string
  name: string
  logo_url?: string
  subdomain: string
  slug: string
  contact_email?: string
  location?: string
}

interface UseCourseResult {
  course: Course | null
  loading: boolean
  error: string | null
}

export function useCourse(): UseCourseResult {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true)
      setError(null)

      try {
       let subdomain = 'testcourse' // fallback for dev & Bolt preview

if (!import.meta.env.DEV && typeof window !== 'undefined') {
  const hostname = window.location.hostname
  const parts = hostname.split('.')

  if (parts.length >= 3) {
    subdomain = parts[0].toLowerCase()
  } else {
    console.warn('[useCourse] No subdomain found — falling back to:', subdomain)
  }
} else {
  console.log('[useCourse] DEV mode — using fallback subdomain:', subdomain)
}

        console.log('[useCourse] Detected subdomain:', subdomain)

    const { data, error: fetchError } = await supabase
  .from('golf_courses')
  .select('id, name, logo_url, subdomain, slug, contact_email, location')
  .eq('subdomain', subdomain.toLowerCase())
  .maybeSingle() // ✅ <- prevents "must return exactly 1 row" error

        if (fetchError) {
          console.error('[useCourse] Supabase fetch error:', fetchError)
          setError('Golf course not found')
          setCourse(null)
        } else {
          setCourse(data)
        }
      } catch (err) {
        console.error('[useCourse] Unexpected error:', err)
        setError('An unexpected error occurred')
        setCourse(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [])

  return { course, loading, error }
}
