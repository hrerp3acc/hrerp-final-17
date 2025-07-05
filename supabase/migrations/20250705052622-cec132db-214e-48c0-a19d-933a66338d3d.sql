
-- Create missing tables for complete Supabase integration

-- Timesheets table (for timesheet management)
CREATE TABLE IF NOT EXISTS public.timesheets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  total_hours NUMERIC DEFAULT 0,
  overtime_hours NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Learning progress tracking
CREATE TABLE IF NOT EXISTS public.learning_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  course_id UUID,
  certification_id UUID,
  progress_percentage INTEGER DEFAULT 0,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'failed')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User activity logs for analytics
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  action_type TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- System settings/configurations
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  category TEXT DEFAULT 'general',
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for new tables
ALTER TABLE public.timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Timesheets policies
CREATE POLICY "Users can manage their own timesheets" 
  ON public.timesheets FOR ALL 
  USING (employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid()));

CREATE POLICY "Managers can view all timesheets" 
  ON public.timesheets FOR SELECT 
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Learning progress policies
CREATE POLICY "Users can manage their own learning progress" 
  ON public.learning_progress FOR ALL 
  USING (employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid()));

CREATE POLICY "Managers can view all learning progress" 
  ON public.learning_progress FOR SELECT 
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr'));

-- User activity logs policies
CREATE POLICY "Users can view their own activity logs" 
  ON public.user_activity_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity logs" 
  ON public.user_activity_logs FOR SELECT 
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own activity logs" 
  ON public.user_activity_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- System settings policies
CREATE POLICY "Admins can manage system settings" 
  ON public.system_settings FOR ALL 
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view public settings" 
  ON public.system_settings FOR SELECT 
  USING (is_public = true OR has_role(auth.uid(), 'admin'));

-- Insert some default system settings
INSERT INTO public.system_settings (setting_key, setting_value, category, description, is_public) VALUES
('company_name', '"Your Company"', 'general', 'Company name displayed in the application', true),
('working_hours_per_day', '8', 'attendance', 'Standard working hours per day', true),
('overtime_threshold', '40', 'attendance', 'Weekly hours threshold for overtime calculation', false),
('leave_approval_required', 'true', 'leave', 'Whether leave applications require approval', false)
ON CONFLICT (setting_key) DO NOTHING;
