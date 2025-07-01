
-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can view their own timesheets" ON public.timesheets;
DROP POLICY IF EXISTS "Users can manage their own draft timesheets" ON public.timesheets;
DROP POLICY IF EXISTS "Managers can approve subordinate timesheets" ON public.timesheets;
DROP POLICY IF EXISTS "Everyone can view active job postings" ON public.job_postings;
DROP POLICY IF EXISTS "HR and admins can manage job postings" ON public.job_postings;
DROP POLICY IF EXISTS "Applicants can view their own applications" ON public.job_applications;
DROP POLICY IF EXISTS "Anyone can apply for jobs" ON public.job_applications;
DROP POLICY IF EXISTS "HR and admins can manage applications" ON public.job_applications;
DROP POLICY IF EXISTS "Users can view their own attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Users can manage their own attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Managers can view subordinate attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Managers and HR can view workforce plans" ON public.workforce_plans;
DROP POLICY IF EXISTS "Everyone can view active training programs" ON public.training_programs;
DROP POLICY IF EXISTS "HR and admins can manage training programs" ON public.training_programs;
DROP POLICY IF EXISTS "HR can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "HR can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;

-- Now create the new policies
-- Update employees table policies for better security
DROP POLICY IF EXISTS "Employees can view all employee records" ON public.employees;

-- Create more specific policies for employees table
CREATE POLICY "Users can view their own employee record" ON public.employees
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Managers can view their department employees" ON public.employees
  FOR SELECT 
  TO authenticated
  USING (
    department_id IN (
      SELECT department_id FROM public.employees 
      WHERE user_id = auth.uid() AND id IN (
        SELECT head_id FROM public.departments
      )
    )
    OR 
    id IN (
      SELECT e.id FROM public.employees e
      JOIN public.employees m ON e.manager_id = m.id
      WHERE m.user_id = auth.uid()
    )
  );

-- Update attendance_records policies
CREATE POLICY "Users can view their own attendance" ON public.attendance_records
  FOR SELECT 
  TO authenticated
  USING (
    employee_id IN (
      SELECT id FROM public.employees WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own attendance" ON public.attendance_records
  FOR ALL 
  TO authenticated
  USING (
    employee_id IN (
      SELECT id FROM public.employees WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    employee_id IN (
      SELECT id FROM public.employees WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Managers can view subordinate attendance" ON public.attendance_records
  FOR SELECT 
  TO authenticated
  USING (
    employee_id IN (
      SELECT e.id FROM public.employees e
      JOIN public.employees m ON e.manager_id = m.id
      WHERE m.user_id = auth.uid()
    )
  );

-- Update job_postings and job_applications policies
CREATE POLICY "Everyone can view active job postings" ON public.job_postings
  FOR SELECT 
  TO authenticated
  USING (status = 'open');

CREATE POLICY "HR and admins can manage job postings" ON public.job_postings
  FOR ALL 
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'hr')
  );

CREATE POLICY "Applicants can view their own applications" ON public.job_applications
  FOR SELECT 
  TO authenticated
  USING (candidate_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Anyone can apply for jobs" ON public.job_applications
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "HR and admins can manage applications" ON public.job_applications
  FOR ALL 
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'hr')
  );

-- Add missing policies for timesheets table
CREATE POLICY "Users can view their own timesheets" ON public.timesheets
  FOR SELECT 
  TO authenticated
  USING (
    employee_id IN (
      SELECT id FROM public.employees WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own draft timesheets" ON public.timesheets
  FOR ALL 
  TO authenticated
  USING (
    employee_id IN (
      SELECT id FROM public.employees WHERE user_id = auth.uid()
    ) AND status = 'draft'
  )
  WITH CHECK (
    employee_id IN (
      SELECT id FROM public.employees WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Managers can approve subordinate timesheets" ON public.timesheets
  FOR UPDATE 
  TO authenticated
  USING (
    employee_id IN (
      SELECT e.id FROM public.employees e
      JOIN public.employees m ON e.manager_id = m.id
      WHERE m.user_id = auth.uid()
    )
  );

-- Add policy for workforce_plans
CREATE POLICY "Managers and HR can view workforce plans" ON public.workforce_plans
  FOR SELECT 
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'hr') OR
    public.has_role(auth.uid(), 'manager')
  );

-- Update training_programs policies
CREATE POLICY "Everyone can view active training programs" ON public.training_programs
  FOR SELECT 
  TO authenticated
  USING (status = 'active');

CREATE POLICY "HR and admins can manage training programs" ON public.training_programs
  FOR ALL 
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'hr')
  );

-- Ensure proper policies for user management
CREATE POLICY "HR can manage user roles" ON public.user_roles
  FOR ALL 
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'hr')
  );

-- Add comprehensive policy for profiles table to allow HR access
CREATE POLICY "HR can view all profiles" ON public.profiles
  FOR SELECT 
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'hr') OR
    auth.uid() = id
  );

-- Add policy to allow profile creation during signup
CREATE POLICY "Users can create their own profile" ON public.profiles
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = id);
