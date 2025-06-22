
-- First, let's check and update the RLS policies for employees table
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can manage all employees" ON public.employees;
DROP POLICY IF EXISTS "Managers can view their department employees" ON public.employees;

-- Create more permissive policies that allow authenticated users to add employees
-- while still maintaining proper access control for viewing and updating

-- Allow all authenticated users to insert employees (for HR/admin functions)
CREATE POLICY "Authenticated users can insert employees" ON public.employees
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to view all employees (needed for directory functionality)
CREATE POLICY "Authenticated users can view employees" ON public.employees
  FOR SELECT 
  TO authenticated
  USING (true);

-- Only allow admins to update employees
CREATE POLICY "Admins can update employees" ON public.employees
  FOR UPDATE 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only allow admins to delete employees
CREATE POLICY "Admins can delete employees" ON public.employees
  FOR DELETE 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Also ensure the user_roles table has proper policies for role checking
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Allow users to view their own roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

-- Allow admins to manage all roles
CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
