
-- Create tables for analytics tracking
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  module TEXT, -- 'employees', 'performance', 'payroll', etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reports configuration table
CREATE TABLE public.report_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'attendance', 'payroll', 'performance', etc.
  template_config JSONB NOT NULL, -- stores report structure and filters
  is_public BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create generated reports table
CREATE TABLE public.generated_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.report_templates(id),
  name TEXT NOT NULL,
  description TEXT,
  report_data JSONB NOT NULL,
  status TEXT DEFAULT 'generated' CHECK (status IN ('generating', 'generated', 'failed')),
  file_url TEXT,
  file_size TEXT,
  generated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user settings table
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  notification_preferences JSONB DEFAULT '{
    "email": true,
    "push": true,
    "leave_requests": true,
    "performance_reviews": true,
    "payroll_updates": false
  }'::jsonb,
  dashboard_preferences JSONB DEFAULT '{
    "layout": "default",
    "widgets": ["quick_stats", "recent_activities", "upcoming_events"]
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create onboarding progress table
CREATE TABLE public.onboarding_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_step INTEGER DEFAULT 1,
  completed_steps INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  is_completed BOOLEAN DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create system notifications table
CREATE TABLE public.system_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  target_users TEXT[] DEFAULT ARRAY['all'], -- 'all', specific user_ids, or role names
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for analytics_events
CREATE POLICY "Users can view their own analytics events" 
  ON public.analytics_events FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analytics events" 
  ON public.analytics_events FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all analytics events" 
  ON public.analytics_events FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for report_templates
CREATE POLICY "Everyone can view public report templates" 
  ON public.report_templates FOR SELECT 
  USING (is_public = true OR auth.uid() = created_by);

CREATE POLICY "Users can create report templates" 
  ON public.report_templates FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own report templates" 
  ON public.report_templates FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all report templates" 
  ON public.report_templates FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for generated_reports
CREATE POLICY "Users can view their own generated reports" 
  ON public.generated_reports FOR SELECT 
  USING (auth.uid() = generated_by);

CREATE POLICY "Users can create generated reports" 
  ON public.generated_reports FOR INSERT 
  WITH CHECK (auth.uid() = generated_by);

CREATE POLICY "Admins can view all generated reports" 
  ON public.generated_reports FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for user_settings
CREATE POLICY "Users can manage their own settings" 
  ON public.user_settings FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for onboarding_progress
CREATE POLICY "Users can manage their own onboarding progress" 
  ON public.onboarding_progress FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for system_notifications
CREATE POLICY "Everyone can view active system notifications" 
  ON public.system_notifications FOR SELECT 
  USING (
    is_active = true 
    AND (expires_at IS NULL OR expires_at > now())
    AND (
      'all' = ANY(target_users) 
      OR auth.uid()::text = ANY(target_users)
      OR EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role::text = ANY(target_users)
      )
    )
  );

CREATE POLICY "Admins can manage system notifications" 
  ON public.system_notifications FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes for better performance
CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_events_module ON public.analytics_events(module);
CREATE INDEX idx_generated_reports_created_by ON public.generated_reports(generated_by);
CREATE INDEX idx_system_notifications_active ON public.system_notifications(is_active, expires_at);
