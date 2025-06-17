
-- Create projects table for timesheet functionality
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  client TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table for project tasks
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  estimated_hours NUMERIC,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create time_entries table for time tracking
CREATE TABLE public.time_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  break_duration INTERVAL DEFAULT '0 minutes',
  total_hours NUMERIC GENERATED ALWAYS AS (
    CASE 
      WHEN end_time IS NOT NULL THEN 
        EXTRACT(EPOCH FROM (end_time - start_time - COALESCE(break_duration, '0 minutes'::interval))) / 3600
      ELSE NULL
    END
  ) STORED,
  description TEXT,
  is_billable BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create timesheets table for timesheet management
CREATE TABLE public.timesheets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  total_hours NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(employee_id, week_start_date)
);

-- Add RLS policies for projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view projects" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Managers can manage projects" ON public.projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      JOIN public.user_roles ur ON e.user_id = ur.user_id
      WHERE e.user_id = auth.uid() 
      AND ur.role IN ('admin', 'manager')
    )
  );

-- Add RLS policies for tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view tasks" ON public.tasks
  FOR SELECT USING (true);

CREATE POLICY "Managers can manage tasks" ON public.tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      JOIN public.user_roles ur ON e.user_id = ur.user_id
      WHERE e.user_id = auth.uid() 
      AND ur.role IN ('admin', 'manager')
    )
  );

-- Add RLS policies for time_entries
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own time entries" ON public.time_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.id = time_entries.employee_id 
      AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own time entries" ON public.time_entries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.id = time_entries.employee_id 
      AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Managers can view all time entries" ON public.time_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      JOIN public.user_roles ur ON e.user_id = ur.user_id
      WHERE e.user_id = auth.uid() 
      AND ur.role IN ('admin', 'manager')
    )
  );

-- Add RLS policies for timesheets
ALTER TABLE public.timesheets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own timesheets" ON public.timesheets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.id = timesheets.employee_id 
      AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own timesheets" ON public.timesheets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.id = timesheets.employee_id 
      AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Managers can view all timesheets" ON public.timesheets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      JOIN public.user_roles ur ON e.user_id = ur.user_id
      WHERE e.user_id = auth.uid() 
      AND ur.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Managers can approve timesheets" ON public.timesheets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      JOIN public.user_roles ur ON e.user_id = ur.user_id
      WHERE e.user_id = auth.uid() 
      AND ur.role IN ('admin', 'manager')
    )
  );

-- Insert some sample projects and tasks
INSERT INTO public.projects (name, description, client, status) VALUES
  ('Website Redesign', 'Company website redesign project', 'Internal', 'active'),
  ('Mobile App Development', 'New mobile application for customers', 'TechCorp Inc', 'active'),
  ('E-commerce Platform', 'Online shopping platform development', 'RetailCorp', 'active'),
  ('Internal Tools', 'Internal productivity tools development', 'Internal', 'active');

INSERT INTO public.tasks (project_id, name, description, estimated_hours) VALUES
  ((SELECT id FROM public.projects WHERE name = 'Website Redesign'), 'Frontend Development', 'Develop frontend components', 40),
  ((SELECT id FROM public.projects WHERE name = 'Website Redesign'), 'Backend Development', 'Develop backend APIs', 30),
  ((SELECT id FROM public.projects WHERE name = 'Website Redesign'), 'Testing', 'Quality assurance testing', 20),
  ((SELECT id FROM public.projects WHERE name = 'Mobile App Development'), 'UI/UX Design', 'Design mobile app interface', 25),
  ((SELECT id FROM public.projects WHERE name = 'Mobile App Development'), 'Development', 'Mobile app development', 60),
  ((SELECT id FROM public.projects WHERE name = 'E-commerce Platform'), 'Database Design', 'Design database schema', 15),
  ((SELECT id FROM public.projects WHERE name = 'E-commerce Platform'), 'Payment Integration', 'Integrate payment systems', 20),
  ((SELECT id FROM public.projects WHERE name = 'Internal Tools'), 'Documentation', 'Write project documentation', 10);
