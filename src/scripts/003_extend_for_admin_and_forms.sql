-- Add form types table to support multiple form types
CREATE TABLE IF NOT EXISTS public.form_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  fields JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default form types
INSERT INTO public.form_types (name, slug, description, fields) VALUES 
('General Lead', 'general', 'Standard lead capture form', '[
  {"name": "name", "type": "text", "label": "Full Name", "required": true},
  {"name": "email", "type": "email", "label": "Email Address", "required": true},
  {"name": "phone", "type": "tel", "label": "Phone Number", "required": false},
  {"name": "company", "type": "text", "label": "Company", "required": false},
  {"name": "message", "type": "textarea", "label": "Message", "required": false}
]'::jsonb),
('Loan Application', 'loan', 'Loan application lead form', '[
  {"name": "name", "type": "text", "label": "Full Name", "required": true},
  {"name": "email", "type": "email", "label": "Email Address", "required": true},
  {"name": "phone", "type": "tel", "label": "Phone Number", "required": true},
  {"name": "loan_amount", "type": "number", "label": "Loan Amount", "required": true},
  {"name": "loan_purpose", "type": "select", "label": "Loan Purpose", "required": true, "options": ["Home Purchase", "Refinance", "Business", "Personal", "Auto", "Other"]},
  {"name": "annual_income", "type": "number", "label": "Annual Income", "required": true},
  {"name": "employment_status", "type": "select", "label": "Employment Status", "required": true, "options": ["Employed", "Self-Employed", "Unemployed", "Retired", "Student"]},
  {"name": "credit_score_range", "type": "select", "label": "Credit Score Range", "required": false, "options": ["Excellent (750+)", "Good (700-749)", "Fair (650-699)", "Poor (600-649)", "Very Poor (<600)", "Unknown"]}
]'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Add form_type_id to leads table
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS form_type_id UUID REFERENCES public.form_types(id);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS form_data JSONB DEFAULT '{}';

-- Update existing leads to use general form type
UPDATE public.leads 
SET form_type_id = (SELECT id FROM public.form_types WHERE slug = 'general')
WHERE form_type_id IS NULL;

-- Update profiles table to support admin role
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create admin users table for additional admin-specific data
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  permissions JSONB DEFAULT '{"manage_users": true, "manage_forms": true, "view_analytics": true, "export_data": true}',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for new tables
ALTER TABLE public.form_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for form_types (public read, admin write)
CREATE POLICY "Allow anyone to view active form types" 
  ON public.form_types FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Allow admins to manage form types" 
  ON public.form_types FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Create policies for admin_users
CREATE POLICY "Allow admins to view admin users" 
  ON public.admin_users FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Allow admins to manage admin users" 
  ON public.admin_users FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Update leads policies to include admin access
DROP POLICY IF EXISTS "Allow authenticated users to view leads" ON public.leads;
DROP POLICY IF EXISTS "Allow authenticated users to update leads" ON public.leads;

CREATE POLICY "Allow authenticated users to view leads" 
  ON public.leads FOR SELECT 
  USING (
    auth.role() = 'authenticated' OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Allow authenticated users to update leads" 
  ON public.leads FOR UPDATE 
  USING (
    auth.role() = 'authenticated' OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Allow admins to delete leads" 
  ON public.leads FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_form_type ON public.leads(form_type_id);
CREATE INDEX IF NOT EXISTS idx_form_types_slug ON public.form_types(slug);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);

-- Create function to promote user to admin
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Find user by email
  SELECT id INTO user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Update profile to admin
  UPDATE public.profiles 
  SET is_admin = true 
  WHERE id = user_id;
  
  -- Insert into admin_users if not exists
  INSERT INTO public.admin_users (id) 
  VALUES (user_id)
  ON CONFLICT (id) DO NOTHING;
  
  RETURN TRUE;
END;
$$;
