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
        let subdomain = 'pinevalley' // fallback for local/dev

        if (!import.meta.env.DEV) {
          const hostname = window.location.hostname
          const parts = hostname.split('.')

          // Example: testcourse.aiflowtools.com → testcourse
          if (parts.length >= 3) {
            subdomain = parts[0].toLowerCase()
          } else {
            subdomain = 'pinevalley'
          }
        }

        console.log('[useCourse] Subdomain detected:', subdomain)

        const { data, error: fetchError } = await supabase
          .from('golf_courses')
          .select('*')
          .ilike('subdomain', subdomain) // case-insensitive match
          .single()

        if (fetchError) {
          console.error('[useCourse] Supabase fetch error:', fetchError)
          if (fetchError.code === 'PGRST116') {
            setError('Course not found')
          } else {
            setError('Failed to load course information')
          }
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
