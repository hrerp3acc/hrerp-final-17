
-- Create learning and development tables
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  duration_hours NUMERIC,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  instructor_name TEXT,
  instructor_email TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress NUMERIC DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped')),
  UNIQUE(course_id, employee_id)
);

CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuer TEXT,
  issue_date DATE,
  expiry_date DATE,
  certificate_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create payroll tables
CREATE TABLE IF NOT EXISTS public.pay_periods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  pay_date DATE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payroll_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  pay_period_id UUID NOT NULL REFERENCES public.pay_periods(id) ON DELETE CASCADE,
  gross_salary NUMERIC NOT NULL DEFAULT 0,
  basic_salary NUMERIC NOT NULL DEFAULT 0,
  allowances NUMERIC DEFAULT 0,
  overtime_amount NUMERIC DEFAULT 0,
  deductions NUMERIC DEFAULT 0,
  tax_deductions NUMERIC DEFAULT 0,
  net_salary NUMERIC NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'processed', 'paid')),
  processed_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(employee_id, pay_period_id)
);

CREATE TABLE IF NOT EXISTS public.employee_benefits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  benefit_name TEXT NOT NULL,
  benefit_type TEXT NOT NULL CHECK (benefit_type IN ('health_insurance', 'life_insurance', 'retirement', 'vacation', 'sick_leave', 'other')),
  amount NUMERIC DEFAULT 0,
  coverage_start DATE,
  coverage_end DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pay_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_benefits ENABLE ROW LEVEL SECURITY;

-- RLS policies for courses (viewable by all employees)
CREATE POLICY "All employees can view courses" 
ON public.courses 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Admins and managers can manage courses" 
ON public.courses 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.employees e 
    JOIN public.user_roles ur ON e.user_id = ur.user_id 
    WHERE e.user_id = auth.uid() 
    AND ur.role IN ('admin', 'manager')
  )
);

-- RLS policies for course enrollments
CREATE POLICY "Users can view their own enrollments" 
ON public.course_enrollments 
FOR SELECT 
USING (
  employee_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can enroll themselves" 
ON public.course_enrollments 
FOR INSERT 
WITH CHECK (
  employee_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own enrollments" 
ON public.course_enrollments 
FOR UPDATE 
USING (
  employee_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Managers can view subordinate enrollments" 
ON public.course_enrollments 
FOR SELECT 
USING (
  employee_id IN (
    SELECT e.id FROM public.employees e 
    JOIN public.employees m ON e.manager_id = m.id 
    WHERE m.user_id = auth.uid()
  )
);

-- RLS policies for certifications
CREATE POLICY "Users can view their own certifications" 
ON public.certifications 
FOR SELECT 
USING (
  employee_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage their own certifications" 
ON public.certifications 
FOR ALL 
USING (
  employee_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Managers can view subordinate certifications" 
ON public.certifications 
FOR SELECT 
USING (
  employee_id IN (
    SELECT e.id FROM public.employees e 
    JOIN public.employees m ON e.manager_id = m.id 
    WHERE m.user_id = auth.uid()
  )
);

-- RLS policies for pay periods (admin/manager only)
CREATE POLICY "Admins and managers can manage pay periods" 
ON public.pay_periods 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.employees e 
    JOIN public.user_roles ur ON e.user_id = ur.user_id 
    WHERE e.user_id = auth.uid() 
    AND ur.role IN ('admin', 'manager')
  )
);

-- RLS policies for payroll records
CREATE POLICY "Users can view their own payroll" 
ON public.payroll_records 
FOR SELECT 
USING (
  employee_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins and managers can manage payroll" 
ON public.payroll_records 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.employees e 
    JOIN public.user_roles ur ON e.user_id = ur.user_id 
    WHERE e.user_id = auth.uid() 
    AND ur.role IN ('admin', 'manager')
  )
);

-- RLS policies for employee benefits
CREATE POLICY "Users can view their own benefits" 
ON public.employee_benefits 
FOR SELECT 
USING (
  employee_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins and managers can manage benefits" 
ON public.employee_benefits 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.employees e 
    JOIN public.user_roles ur ON e.user_id = ur.user_id 
    WHERE e.user_id = auth.uid() 
    AND ur.role IN ('admin', 'manager')
  )
);
