/*
  # Add branding fields to golf_courses table
  
  1. Changes
    - Add logo_url column for course logos
    - Add slug column for URL-friendly course identifiers
    - Ensure subdomain column exists and is unique
    
  2. Security
    - Maintain existing RLS policies
*/

-- Add logo_url column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'golf_courses' 
    AND column_name = 'logo_url'
  ) THEN
    ALTER TABLE golf_courses ADD COLUMN logo_url text;
  END IF;
END $$;

-- Add slug column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'golf_courses' 
    AND column_name = 'slug'
  ) THEN
    ALTER TABLE golf_courses ADD COLUMN slug text;
  END IF;
END $$;

-- Ensure subdomain column exists (it should from previous migrations)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'golf_courses' 
    AND column_name = 'subdomain'
  ) THEN
    ALTER TABLE golf_courses ADD COLUMN subdomain text;
  END IF;
END $$;

-- Add unique constraint on subdomain if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'golf_courses_subdomain_key'
  ) THEN
    ALTER TABLE golf_courses ADD CONSTRAINT golf_courses_subdomain_key UNIQUE (subdomain);
  END IF;
END $$;

-- Insert a default course for development/testing
INSERT INTO golf_courses (name, subdomain, slug, location, contact_email, logo_url)
VALUES (
  'Pine Valley Golf Club',
  'pinevalley',
  'pine-valley',
  'Pine Valley, NJ',
  'info@pinevalley.com',
  null
)
ON CONFLICT (subdomain) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  location = EXCLUDED.location,
  contact_email = EXCLUDED.contact_email;