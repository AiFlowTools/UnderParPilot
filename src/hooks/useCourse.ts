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
        let subdomain = 'testcourse' // fallback default

        if (typeof window !== 'undefined') {
          const hostname = window.location.hostname
          const fullUrl = window.location.href

          console.log('[useCourse] Full URL:', fullUrl)
          console.log('[useCourse] Hostname:', hostname)
          console.log('[useCourse] Protocol:', window.location.protocol)
          console.log('[useCourse] Port:', window.location.port)

          if (hostname === 'localhost' || hostname === '127.0.0.1') {
            console.log('[useCourse] Local development detected')
            subdomain = 'testcourse'
          } else if (
            hostname.includes('aiflowtools.com') ||
            hostname.includes('fairwaymate.com')
          ) {
            const parts = hostname.split('.')
            console.log('[useCourse] Domain parts:', parts)

            if (parts.length >= 3) {
              subdomain = parts[0].toLowerCase()
              console.log('[useCourse] Extracted subdomain from domain:', subdomain)
            } else {
              console.log('[useCourse] Main domain detected - using fallback')
              subdomain = 'testcourse'
            }
          } else if (
            hostname.includes('netlify.app') ||
            hostname.includes('netlify.com')
          ) {
            console.log('[useCourse] Netlify deployment detected')
            subdomain = 'testcourse'
          } else {
            console.log('[useCourse] Unknown domain - using fallback')
            subdomain = 'testcourse'
          }
        }

        console.log('[useCourse] Final subdomain for query:', subdomain)

        // Test Supabase connection
        console.log('[useCourse] Testing Supabase connection...')
        const { data: testData, error: testError } = await supabase
          .from('golf_courses')
          .select('count')
          .limit(1)

        if (testError) {
          console.error('[useCourse] Supabase connection test failed:', testError)
          setError(`Database connection failed: ${testError.message}`)
          return
        }

        console.log('[useCourse] Supabase connection successful')

        // Fetch course based on subdomain
        const { data, error: fetchError } = await supabase
          .from('golf_courses')
          .select('id, name, logo_url, subdomain, slug, contact_email, location')
          .eq('subdomain', subdomain.toLowerCase())
          .maybeSingle()

        console.log('[useCourse] Query result:', { data, error: fetchError })

        if (fetchError) {
          console.error('[useCourse] Supabase fetch error:', fetchError)
          setError(`Failed to load golf course data: ${fetchError.message}`)
          setCourse(null)
        } else if (!data) {
          console.warn('[useCourse] No course found for subdomain:', subdomain)

          const { data: allCourses } = await supabase
            .from('golf_courses')
            .select('subdomain, name')

          console.log('[useCourse] Available courses:', allCourses)
          setError(`Golf course not found for subdomain "${subdomain}". Available courses: ${allCourses?.map(c => c.subdomain).join(', ') || 'none'}`)
          setCourse(null)
        } else {
          console.log('[useCourse] Course loaded successfully:', data)
          setCourse(data)
          setError(null)
        }
      } catch (err) {
        console.error('[useCourse] Unexpected error:', err)
        setError(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`)
        setCourse(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [])

  return { course, loading, error }
}
