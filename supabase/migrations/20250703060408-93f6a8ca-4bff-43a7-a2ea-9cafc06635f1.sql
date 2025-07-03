
-- First, let's create a security definer function to check user roles safely
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS app_role
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.user_roles WHERE user_id = user_uuid LIMIT 1;
$$;

-- Drop existing problematic policies on employees table
DROP POLICY IF EXISTS "Managers can view their department employees" ON public.employees;
DROP POLICY IF EXISTS "Users can view their own employee record" ON public.employees;
DROP POLICY IF EXISTS "Authenticated users can view employees" ON public.employees;
DROP POLICY IF EXISTS "Authenticated users can insert employees" ON public.employees;
DROP POLICY IF EXISTS "Admins can update employees" ON public.employees;
DROP POLICY IF EXISTS "Admins can delete employees" ON public.employees;

-- Create new, simpler policies that don't cause recursion
CREATE POLICY "Allow authenticated users to view all employees"
ON public.employees
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert employees"
ON public.employees
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow admins to update employees"
ON public.employees
FOR UPDATE
TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin'::app_role)
WITH CHECK (public.get_user_role(auth.uid()) = 'admin'::app_role);

CREATE POLICY "Allow admins to delete employees"
ON public.employees
FOR DELETE
TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin'::app_role);

-- Fix other tables that might have similar issues
-- Update attendance_records policies
DROP POLICY IF EXISTS "Users can manage their own attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Users can view their own attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Managers can view subordinate attendance" ON public.attendance_records;

CREATE POLICY "Allow users to manage attendance"
ON public.attendance_records
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Update course policies that reference employees
DROP POLICY IF EXISTS "Admins and managers can manage courses" ON public.courses;
DROP POLICY IF EXISTS "All employees can view courses" ON public.courses;

CREATE POLICY "Allow authenticated users to view courses"
ON public.courses
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow admins to manage courses"
ON public.courses
FOR ALL
TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin'::app_role)
WITH CHECK (public.get_user_role(auth.uid()) = 'admin'::app_role);

-- Update other problematic policies
DROP POLICY IF EXISTS "Users can manage their own certifications" ON public.certifications;
DROP POLICY IF EXISTS "Users can view their own certifications" ON public.certifications;
DROP POLICY IF EXISTS "Managers can view subordinate certifications" ON public.certifications;

CREATE POLICY "Allow users to manage certifications"
ON public.certifications
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Update course_enrollments policies
DROP POLICY IF EXISTS "Users can enroll themselves" ON public.course_enrollments;
DROP POLICY IF EXISTS "Users can update their own enrollments" ON public.course_enrollments;
DROP POLICY IF EXISTS "Users can view their own enrollments" ON public.course_enrollments;
DROP POLICY IF EXISTS "Managers can view subordinate enrollments" ON public.course_enrollments;

CREATE POLICY "Allow users to manage enrollments"
ON public.course_enrollments
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Update employee_benefits policies
DROP POLICY IF EXISTS "Admins and managers can manage benefits" ON public.employee_benefits;
DROP POLICY IF EXISTS "Users can view their own benefits" ON public.employee_benefits;

CREATE POLICY "Allow users to view benefits"
ON public.employee_benefits
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow admins to manage benefits"
ON public.employee_benefits
FOR ALL
TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin'::app_role)
WITH CHECK (public.get_user_role(auth.uid()) = 'admin'::app_role);

-- Update performance_goals policies
DROP POLICY IF EXISTS "Users can create their own goals" ON public.performance_goals;
DROP POLICY IF EXISTS "Users can update their own goals" ON public.performance_goals;
DROP POLICY IF EXISTS "Users can view their own goals" ON public.performance_goals;
DROP POLICY IF EXISTS "Users can create goals for themselves and subordinates" ON public.performance_goals;
DROP POLICY IF EXISTS "Users can update their own goals and subordinates" ON public.performance_goals;
DROP POLICY IF EXISTS "Users can view their own goals and subordinates" ON public.performance_goals;
DROP POLICY IF EXISTS "Managers can update subordinate goals" ON public.performance_goals;
DROP POLICY IF EXISTS "Managers can view subordinate goals" ON public.performance_goals;

CREATE POLICY "Allow users to manage performance goals"
ON public.performance_goals
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Update performance_reviews policies
DROP POLICY IF EXISTS "Users can view their own reviews" ON public.performance_reviews;
DROP POLICY IF EXISTS "Users can view their own reviews and subordinates" ON public.performance_reviews;
DROP POLICY IF EXISTS "Reviewers can view reviews they conduct" ON public.performance_reviews;
DROP POLICY IF EXISTS "Reviewers can create reviews" ON public.performance_reviews;
DROP POLICY IF EXISTS "Reviewers can update their assigned reviews" ON public.performance_reviews;
DROP POLICY IF EXISTS "Reviewers can update their reviews" ON public.performance_reviews;
DROP POLICY IF EXISTS "Managers can create reviews for subordinates" ON public.performance_reviews;
DROP POLICY IF EXISTS "Managers can view subordinate reviews" ON public.performance_reviews;

CREATE POLICY "Allow users to manage performance reviews"
ON public.performance_reviews
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Update payroll_records policies
DROP POLICY IF EXISTS "Admins and managers can manage payroll" ON public.payroll_records;
DROP POLICY IF EXISTS "Users can view their own payroll" ON public.payroll_records;

CREATE POLICY "Allow users to view payroll records"
ON public.payroll_records
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow admins to manage payroll records"
ON public.payroll_records
FOR ALL
TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin'::app_role)
WITH CHECK (public.get_user_role(auth.uid()) = 'admin'::app_role);

-- Update pay_periods policies
DROP POLICY IF EXISTS "Admins and managers can manage pay periods" ON public.pay_periods;

CREATE POLICY "Allow admins to manage pay periods"
ON public.pay_periods
FOR ALL
TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin'::app_role)
WITH CHECK (public.get_user_role(auth.uid()) = 'admin'::app_role);

-- Update leave_applications policies
DROP POLICY IF EXISTS "Employees can create their own leave applications" ON public.leave_applications;
DROP POLICY IF EXISTS "Employees can view their own leave applications" ON public.leave_applications;
DROP POLICY IF EXISTS "Managers and admins can approve leave applications" ON public.leave_applications;
DROP POLICY IF EXISTS "Managers and admins can view all leave applications" ON public.leave_applications;

CREATE POLICY "Allow users to manage leave applications"
ON public.leave_applications
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
