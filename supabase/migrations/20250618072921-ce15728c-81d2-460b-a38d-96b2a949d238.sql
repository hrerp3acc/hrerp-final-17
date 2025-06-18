
-- Check if leave_applications table exists, if not create it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'leave_applications') THEN
        -- Create leave_applications table
        CREATE TABLE public.leave_applications (
          id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
          employee_id UUID NOT NULL,
          leave_type leave_type NOT NULL,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          reason TEXT,
          status leave_status DEFAULT 'pending',
          approved_by UUID,
          approved_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );

        -- Add foreign key constraints
        ALTER TABLE public.leave_applications 
        ADD CONSTRAINT fk_leave_applications_employee 
        FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;

        ALTER TABLE public.leave_applications 
        ADD CONSTRAINT fk_leave_applications_approver 
        FOREIGN KEY (approved_by) REFERENCES public.employees(id) ON DELETE SET NULL;

        -- Enable RLS
        ALTER TABLE public.leave_applications ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies for leave applications
        CREATE POLICY "Users can view their own leave applications" 
        ON public.leave_applications 
        FOR SELECT 
        USING (
          employee_id IN (
            SELECT id FROM public.employees WHERE user_id = auth.uid()
          )
        );

        CREATE POLICY "Managers can view subordinate leave applications" 
        ON public.leave_applications 
        FOR SELECT 
        USING (
          employee_id IN (
            SELECT e.id FROM public.employees e 
            JOIN public.employees m ON e.manager_id = m.id 
            WHERE m.user_id = auth.uid()
          )
        );

        CREATE POLICY "Users can create their own leave applications" 
        ON public.leave_applications 
        FOR INSERT 
        WITH CHECK (
          employee_id IN (
            SELECT id FROM public.employees WHERE user_id = auth.uid()
          )
        );

        CREATE POLICY "Users can update their own pending leave applications" 
        ON public.leave_applications 
        FOR UPDATE 
        USING (
          employee_id IN (
            SELECT id FROM public.employees WHERE user_id = auth.uid()
          ) 
          AND status = 'pending'
        );

        CREATE POLICY "Managers can approve/reject subordinate leave applications" 
        ON public.leave_applications 
        FOR UPDATE 
        USING (
          employee_id IN (
            SELECT e.id FROM public.employees e 
            JOIN public.employees m ON e.manager_id = m.id 
            WHERE m.user_id = auth.uid()
          )
        );
    END IF;
END $$;
