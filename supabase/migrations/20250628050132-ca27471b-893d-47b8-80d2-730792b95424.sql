
-- Create compliance_items table for compliance management
CREATE TABLE public.compliance_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  due_date date,
  assigned_to uuid REFERENCES public.employees(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  priority text DEFAULT 'medium',
  completion_date date
);

-- Create workforce_plans table for workforce planning
CREATE TABLE public.workforce_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  department_id uuid REFERENCES public.departments(id),
  plan_type text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  start_date date,
  end_date date,
  target_headcount integer,
  current_headcount integer,
  budget numeric,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create skills table for skill management
CREATE TABLE public.skills (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text,
  description text,
  level_required text DEFAULT 'intermediate',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create employee_skills junction table
CREATE TABLE public.employee_skills (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency_level text DEFAULT 'beginner',
  years_experience numeric DEFAULT 0,
  certified boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(employee_id, skill_id)
);

-- Create system_configs table for admin settings
CREATE TABLE public.system_configs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key text NOT NULL UNIQUE,
  config_value jsonb NOT NULL,
  description text,
  category text DEFAULT 'general',
  is_public boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert some sample data for compliance
INSERT INTO public.compliance_items (title, description, category, status, due_date, priority) VALUES
('Annual Safety Training', 'Complete mandatory safety training for all employees', 'Training', 'pending', '2024-12-31', 'high'),
('Data Privacy Audit', 'Quarterly audit of data handling procedures', 'Security', 'in_progress', '2024-07-15', 'high'),
('Financial Compliance Review', 'Review financial processes for regulatory compliance', 'Financial', 'completed', '2024-06-01', 'medium'),
('Employee Handbook Update', 'Update employee handbook with new policies', 'HR', 'pending', '2024-08-30', 'medium');

-- Insert sample skills data
INSERT INTO public.skills (name, category, description, level_required) VALUES
('JavaScript', 'Programming', 'Modern JavaScript programming language', 'intermediate'),
('React', 'Frontend', 'React.js framework for building user interfaces', 'intermediate'),
('Node.js', 'Backend', 'Server-side JavaScript runtime', 'intermediate'),
('SQL', 'Database', 'Structured Query Language for database management', 'beginner'),
('Project Management', 'Management', 'Planning and executing projects effectively', 'intermediate'),
('Communication', 'Soft Skills', 'Effective verbal and written communication', 'beginner');

-- Insert sample workforce plans
INSERT INTO public.workforce_plans (title, description, plan_type, status, start_date, end_date, target_headcount, current_headcount, budget) VALUES
('Q4 Engineering Expansion', 'Expand engineering team to meet product roadmap demands', 'expansion', 'active', '2024-10-01', '2024-12-31', 15, 12, 500000),
('Sales Team Restructure', 'Reorganize sales team for better territory coverage', 'restructure', 'draft', '2024-09-01', '2024-11-30', 8, 10, 200000),
('Customer Support Scale', 'Scale customer support for increased user base', 'expansion', 'planning', '2024-08-01', '2024-10-31', 6, 4, 150000);

-- Insert sample system configs
INSERT INTO public.system_configs (config_key, config_value, description, category, is_public) VALUES
('company_name', '"TechCorp Inc."', 'Company name displayed throughout the system', 'general', true),
('work_week_hours', '40', 'Standard work week hours', 'time', true),
('leave_approval_required', 'true', 'Whether leave applications require approval', 'leave', false),
('max_login_attempts', '5', 'Maximum failed login attempts before lockout', 'security', false);

-- Enable RLS on new tables
ALTER TABLE public.compliance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workforce_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_configs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Authenticated users can view compliance items" ON public.compliance_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage compliance items" ON public.compliance_items FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view workforce plans" ON public.workforce_plans FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage workforce plans" ON public.workforce_plans FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view skills" ON public.skills FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage skills" ON public.skills FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view employee skills" ON public.employee_skills FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage employee skills" ON public.employee_skills FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view public configs" ON public.system_configs FOR SELECT TO authenticated USING (is_public = true);
CREATE POLICY "Admins can manage all configs" ON public.system_configs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
