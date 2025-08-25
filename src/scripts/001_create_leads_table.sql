-- Create leads table for storing form submissions
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'done')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_to UUID REFERENCES auth.users(id)
);

-- Enable RLS for security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policies for marketing team access
-- Allow authenticated users to view all leads
CREATE POLICY "Allow authenticated users to view leads" 
  ON public.leads FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to update leads
CREATE POLICY "Allow authenticated users to update leads" 
  ON public.leads FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Allow anyone to insert leads (for the public form)
CREATE POLICY "Allow anyone to insert leads" 
  ON public.leads FOR INSERT 
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
