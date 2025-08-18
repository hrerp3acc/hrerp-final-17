-- Create certifications table
CREATE TABLE public.certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  name TEXT NOT NULL,
  issuer TEXT,
  issue_date DATE,
  expiry_date DATE,
  status TEXT DEFAULT 'active',
  credential_id TEXT,
  certificate_url TEXT,
  verification_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for certifications
CREATE POLICY "Users can view their own certifications"
ON public.certifications
FOR SELECT
USING (employee_id IN (
  SELECT id FROM employees WHERE user_id = auth.uid()
));

CREATE POLICY "Users can create their own certifications"
ON public.certifications
FOR INSERT
WITH CHECK (employee_id IN (
  SELECT id FROM employees WHERE user_id = auth.uid()
));

CREATE POLICY "Users can update their own certifications"
ON public.certifications
FOR UPDATE
USING (employee_id IN (
  SELECT id FROM employees WHERE user_id = auth.uid()
));

CREATE POLICY "HR and admins can manage all certifications"
ON public.certifications
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr'::app_role));

-- Create update trigger for certifications
CREATE TRIGGER update_certifications_updated_at
BEFORE UPDATE ON public.certifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();