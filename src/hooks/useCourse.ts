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
        let subdomain = 'testcourse'

        if (typeof window !== 'undefined') {
          const hostname = window.location.hostname
          const fullUrl = window.location.href

          console.log('[useCourse] Full URL:', fullUrl)
          console.log('[useCourse] Hostname:', hostname)

          if (hostname === 'localhost' || hostname === '127.0.0.1') {
            console.log('[useCourse] Detected local environment')
            subdomain = 'testcourse'
          } else if (
            hostname.includes('fairwaymate.com')
          ) {
            const parts = hostname.split('.')

            if (parts.length === 2) {
              console.log('[useCourse] Root domain detected')
              subdomain = 'main' // <- this must exist in your Supabase golf_courses table
            } else if (parts.length >= 3) {
  subdomain = parts[0].toLowerCase()

  // Fallback override: force 'menu' subdomain to use 'testcourse'
  if (subdomain === 'menu') {
    console.log('[useCourse] Overriding "menu" subdomain to use testcourse')
    subdomain = 'testcourse'
  }

  console.log('[useCourse] Subdomain detected:', subdomain)
}
 else {
              console.log('[useCourse] Unknown hostname structure, falling back')
              subdomain = 'testcourse'
            }
          } else {
            console.log('[useCourse] Unknown domain fallback')
            subdomain = 'testcourse'
          }
        }

        console.log('[useCourse] Final subdomain:', subdomain)

        // Optional: quick Supabase connection test
        const { error: connectionError } = await supabase
          .from('golf_courses')
          .select('id')
          .limit(1)

        if (connectionError) {
          console.error('[useCourse] Supabase test failed:', connectionError)
          setError('Unable to connect to Supabase.')
          return
        }

        const { data, error: fetchError } = await supabase
          .from('golf_courses')
          .select('id, name, logo_url, subdomain, slug, contact_email, location')
          .eq('subdomain', subdomain)
          .maybeSingle()

        if (fetchError) {
          console.error('[useCourse] Fetch error:', fetchError)
          setError(`Failed to load course: ${fetchError.message}`)
          setCourse(null)
        } else if (!data) {
          console.warn('[useCourse] No course found for:', subdomain)
          setError(`No golf course found for subdomain "${subdomain}".`)
          setCourse(null)
        } else {
          console.log('[useCourse] Course loaded:', data)
          setCourse(data)
          setError(null)
        }
      } catch (err) {
        console.error('[useCourse] Unexpected error:', err)
        setError('Unexpected error occurred while loading course.')
        setCourse(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [])

  return { course, loading, error }
}
