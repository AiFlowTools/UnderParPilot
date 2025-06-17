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
        // Extract subdomain from current hostname
        let subdomain = 'testcourse' // fallback for dev & Bolt preview

        if (typeof window !== 'undefined') {
          const hostname = window.location.hostname
          console.log('[useCourse] Current hostname:', hostname)
          
          // Handle different environments
          if (hostname === 'localhost' || hostname === '127.0.0.1') {
            // Local development - use fallback
            console.log('[useCourse] Local development - using fallback subdomain:', subdomain)
          } else if (hostname.includes('aiflowtools.com')) {
            // Production domain
            const parts = hostname.split('.')
            if (parts.length >= 3) {
              // Extract subdomain (e.g., "testcourse" from "testcourse.aiflowtools.com")
              subdomain = parts[0].toLowerCase()
              console.log('[useCourse] Extracted subdomain from production:', subdomain)
            } else if (hostname === 'aiflowtools.com') {
              // Main domain without subdomain - use fallback
              console.log('[useCourse] Main domain detected - using fallback subdomain:', subdomain)
            }
          } else {
            // Other domains (like Netlify preview URLs) - use fallback
            console.log('[useCourse] Unknown domain - using fallback subdomain:', subdomain)
          }
        }

        console.log('[useCourse] Final subdomain for query:', subdomain)

        const { data, error: fetchError } = await supabase
          .from('golf_courses')
          .select('id, name, logo_url, subdomain, slug, contact_email, location')
          .eq('subdomain', subdomain.toLowerCase())
          .maybeSingle() // Prevents "must return exactly 1 row" error

        if (fetchError) {
          console.error('[useCourse] Supabase fetch error:', fetchError)
          setError('Failed to load golf course data')
          setCourse(null)
        } else if (!data) {
          console.warn('[useCourse] No course found for subdomain:', subdomain)
          setError('Golf course not found')
          setCourse(null)
        } else {
          console.log('[useCourse] Course loaded successfully:', data)
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