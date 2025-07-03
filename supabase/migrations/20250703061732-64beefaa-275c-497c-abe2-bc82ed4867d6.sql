
-- Employee Documents System
CREATE TABLE public.employee_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_confidential BOOLEAN DEFAULT false,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Employee History/Audit Log
CREATE TABLE public.employee_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES auth.users(id),
  change_type TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'status_changed'
  field_name TEXT,
  old_value TEXT,
  new_value TEXT,
  change_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Employee Notes/Feedback
CREATE TABLE public.employee_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  note_type TEXT NOT NULL DEFAULT 'general', -- 'general', 'feedback', 'disciplinary', 'achievement'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_confidential BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  visibility TEXT DEFAULT 'managers', -- 'self', 'managers', 'hr', 'all'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Attendance Devices
CREATE TABLE public.attendance_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_name TEXT NOT NULL,
  device_type TEXT NOT NULL DEFAULT 'biometric', -- 'biometric', 'card', 'mobile', 'web'
  location TEXT NOT NULL,
  ip_address INET,
  is_active BOOLEAN DEFAULT true,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Device Logs
CREATE TABLE public.device_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES public.attendance_devices(id),
  employee_id UUID REFERENCES public.employees(id),
  log_type TEXT NOT NULL, -- 'check_in', 'check_out', 'break_start', 'break_end'
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  device_info JSONB,
  is_valid BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Leave Attachments
CREATE TABLE public.leave_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leave_application_id UUID NOT NULL REFERENCES public.leave_applications(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Salary Components
CREATE TABLE public.salary_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  component_name TEXT NOT NULL,
  component_type TEXT NOT NULL, -- 'earning', 'deduction'
  amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  percentage DECIMAL(5, 2),
  is_fixed BOOLEAN DEFAULT true,
  is_taxable BOOLEAN DEFAULT true,
  effective_from DATE NOT NULL,
  effective_to DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Employee Bank Details
CREATE TABLE public.employee_bank_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  ifsc_code TEXT NOT NULL,
  account_type TEXT DEFAULT 'savings',
  branch_name TEXT,
  is_primary BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Review Participants for 360-degree reviews
CREATE TABLE public.review_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.performance_reviews(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES public.employees(id),
  participant_type TEXT NOT NULL, -- 'self', 'manager', 'peer', 'subordinate', 'client'
  feedback_submitted BOOLEAN DEFAULT false,
  feedback_content TEXT,
  rating DECIMAL(3, 2),
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Screening Criteria for AI recruitment
CREATE TABLE public.screening_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_posting_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE,
  criteria_name TEXT NOT NULL,
  criteria_type TEXT NOT NULL, -- 'keyword', 'experience', 'education', 'skill'
  required_value TEXT NOT NULL,
  weight INTEGER DEFAULT 1,
  is_mandatory BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Offer Templates
CREATE TABLE public.offer_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name TEXT NOT NULL,
  template_content TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id),
  position_level TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- System Announcements
CREATE TABLE public.system_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  announcement_type TEXT DEFAULT 'general', -- 'general', 'urgent', 'policy', 'event'
  target_audience TEXT[] DEFAULT ARRAY['all'], -- roles or 'all'
  is_active BOOLEAN DEFAULT true,
  publish_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expire_date TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Employee Self Service Logs
CREATE TABLE public.employee_self_service_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'profile_update', 'document_download', 'leave_application', etc.
  action_details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for all new tables
ALTER TABLE public.employee_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_bank_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screening_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_self_service_logs ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (will be refined based on specific requirements)
CREATE POLICY "Authenticated users can manage employee documents"
ON public.employee_documents FOR ALL TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view employee history"
ON public.employee_history FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create employee history"
ON public.employee_history FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage employee notes"
ON public.employee_notes FOR ALL TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view attendance devices"
ON public.attendance_devices FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admins can manage attendance devices"
ON public.attendance_devices FOR ALL TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin'::app_role)
WITH CHECK (public.get_user_role(auth.uid()) = 'admin'::app_role);

CREATE POLICY "Authenticated users can manage device logs"
ON public.device_logs FOR ALL TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage leave attachments"
ON public.leave_attachments FOR ALL TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage salary components"
ON public.salary_components FOR ALL TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage bank details"
ON public.employee_bank_details FOR ALL TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can manage review participants"
ON public.review_participants FOR ALL TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "HR can manage screening criteria"
ON public.screening_criteria FOR ALL TO authenticated
USING (public.get_user_role(auth.uid()) IN ('admin'::app_role, 'hr'::app_role))
WITH CHECK (public.get_user_role(auth.uid()) IN ('admin'::app_role, 'hr'::app_role));

CREATE POLICY "HR can manage offer templates"
ON public.offer_templates FOR ALL TO authenticated
USING (public.get_user_role(auth.uid()) IN ('admin'::app_role, 'hr'::app_role))
WITH CHECK (public.get_user_role(auth.uid()) IN ('admin'::app_role, 'hr'::app_role));

CREATE POLICY "Everyone can view active announcements"
ON public.system_announcements FOR SELECT TO authenticated
USING (is_active = true AND (expire_date IS NULL OR expire_date > now()));

CREATE POLICY "Admins can manage announcements"
ON public.system_announcements FOR ALL TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin'::app_role)
WITH CHECK (public.get_user_role(auth.uid()) = 'admin'::app_role);

CREATE POLICY "Users can view their own self service logs"
ON public.employee_self_service_logs FOR SELECT TO authenticated
USING (employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()));

CREATE POLICY "Users can create their own self service logs"
ON public.employee_self_service_logs FOR INSERT TO authenticated
WITH CHECK (employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_employee_documents_employee_id ON public.employee_documents(employee_id);
CREATE INDEX idx_employee_history_employee_id ON public.employee_history(employee_id);
CREATE INDEX idx_employee_notes_employee_id ON public.employee_notes(employee_id);
CREATE INDEX idx_device_logs_employee_id ON public.device_logs(employee_id);
CREATE INDEX idx_device_logs_timestamp ON public.device_logs(timestamp);
CREATE INDEX idx_leave_attachments_leave_id ON public.leave_attachments(leave_application_id);
CREATE INDEX idx_salary_components_employee_id ON public.salary_components(employee_id);
CREATE INDEX idx_bank_details_employee_id ON public.employee_bank_details(employee_id);
CREATE INDEX idx_review_participants_review_id ON public.review_participants(review_id);
CREATE INDEX idx_screening_criteria_job_id ON public.screening_criteria(job_posting_id);
CREATE INDEX idx_announcements_active ON public.system_announcements(is_active, expire_date);
CREATE INDEX idx_self_service_logs_employee_id ON public.employee_self_service_logs(employee_id);
