-- 1. Add columns to CONSULTANT registrations
ALTER TABLE public.consultant_registrations
ADD COLUMN IF NOT EXISTS signature_url TEXT,
ADD COLUMN IF NOT EXISTS document_urls JSONB NOT NULL DEFAULT '[]'::jsonb;


-- 2. Add columns to CONTRACTOR registrations
ALTER TABLE public.contractor_registrations
ADD COLUMN IF NOT EXISTS signature_url TEXT,
ADD COLUMN IF NOT EXISTS document_urls JSONB NOT NULL DEFAULT '[]'::jsonb;
