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
            console.log('[useCourse] Localhost detected')
            subdomain = 'testcourse'
          } else {
            const parts = hostname.split('.')
            if (parts.length >= 3) {
              subdomain = parts[0].toLowerCase()
              console.log('[useCourse] Extracted subdomain:', subdomain)
            } else {
              console.warn('[useCourse] No subdomain found in hostname')
              setError('Subdomain missing from hostname.')
              setCourse(null)
              setLoading(false)
              return
            }
          }
        }

        console.log('[useCourse] Final subdomain for query:', subdomain)

        // Optional: test Supabase connection
        const { error: testError } = await supabase.from('golf_courses').select('id').limit(1)
        if (testError) {
          console.error('[useCourse] Supabase connection failed:', testError)
          setError(`Database error: ${testError.message}`)
          return
        }

        // Fetch course by subdomain
        const { data, error: fetchError } = await supabase
          .from('golf_courses')
          .select('id, name, logo_url, subdomain, slug, contact_email, location')
          .eq('subdomain', subdomain)
          .maybeSingle()

        if (fetchError) {
          console.error('[useCourse] Error fetching course:', fetchError)
          setError(`Failed to load course: ${fetchError.message}`)
          setCourse(null)
        } else if (!data) {
          console.warn('[useCourse] No course found for subdomain:', subdomain)
          setError(`No course found for subdomain "${subdomain}"`)
          setCourse(null)
        } else {
          console.log('[useCourse] Course loaded:', data)
          setCourse(data)
        }
      } catch (err) {
        console.error('[useCourse] Unexpected error:', err)
        setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`)
        setCourse(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [])

  return { course, loading, error }
}
