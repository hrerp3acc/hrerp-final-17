
-- Create enum types for performance management
DO $$ 
BEGIN
    -- Create goal_status enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'goal_status') THEN
        CREATE TYPE goal_status AS ENUM ('not_started', 'in_progress', 'completed', 'overdue');
    END IF;
    
    -- Create review_status enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'review_status') THEN
        CREATE TYPE review_status AS ENUM ('draft', 'in_progress', 'completed');
    END IF;
END $$;

-- Create performance_goals table
CREATE TABLE IF NOT EXISTS public.performance_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  target_date DATE NOT NULL,
  progress NUMERIC DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status goal_status DEFAULT 'not_started',
  weight NUMERIC DEFAULT 100 CHECK (weight > 0),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create performance_reviews table
CREATE TABLE IF NOT EXISTS public.performance_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  reviewer_id UUID,
  review_period_start DATE NOT NULL,
  review_period_end DATE NOT NULL,
  overall_rating NUMERIC CHECK (overall_rating >= 1 AND overall_rating <= 5),
  goals_rating NUMERIC CHECK (goals_rating >= 1 AND goals_rating <= 5),
  competencies_rating NUMERIC CHECK (competencies_rating >= 1 AND competencies_rating <= 5),
  achievements TEXT,
  areas_for_improvement TEXT,
  development_notes TEXT,
  status review_status DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add foreign key constraints with proper error handling
DO $$
BEGIN
    -- Add foreign key for performance_goals if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_performance_goals_employee'
    ) THEN
        ALTER TABLE public.performance_goals 
        ADD CONSTRAINT fk_performance_goals_employee 
        FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;
    END IF;

    -- Add foreign key for performance_reviews employee if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_performance_reviews_employee'
    ) THEN
        ALTER TABLE public.performance_reviews 
        ADD CONSTRAINT fk_performance_reviews_employee 
        FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;
    END IF;

    -- Add foreign key for performance_reviews reviewer if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_performance_reviews_reviewer'
    ) THEN
        ALTER TABLE public.performance_reviews 
        ADD CONSTRAINT fk_performance_reviews_reviewer 
        FOREIGN KEY (reviewer_id) REFERENCES public.employees(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE public.performance_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own goals" ON public.performance_goals;
DROP POLICY IF EXISTS "Managers can view subordinate goals" ON public.performance_goals;
DROP POLICY IF EXISTS "Users can create their own goals" ON public.performance_goals;
DROP POLICY IF EXISTS "Users can update their own goals" ON public.performance_goals;
DROP POLICY IF EXISTS "Managers can update subordinate goals" ON public.performance_goals;
DROP POLICY IF EXISTS "Users can view their own reviews" ON public.performance_reviews;
DROP POLICY IF EXISTS "Reviewers can view reviews they conduct" ON public.performance_reviews;
DROP POLICY IF EXISTS "Managers can view subordinate reviews" ON public.performance_reviews;
DROP POLICY IF EXISTS "Reviewers can create reviews" ON public.performance_reviews;
DROP POLICY IF EXISTS "Reviewers can update their reviews" ON public.performance_reviews;

-- RLS policies for performance_goals
CREATE POLICY "Users can view their own goals" 
ON public.performance_goals 
FOR SELECT 
USING (
  employee_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Managers can view subordinate goals" 
ON public.performance_goals 
FOR SELECT 
USING (
  employee_id IN (
    SELECT e.id FROM public.employees e 
    JOIN public.employees m ON e.manager_id = m.id 
    WHERE m.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own goals" 
ON public.performance_goals 
FOR INSERT 
WITH CHECK (
  employee_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own goals" 
ON public.performance_goals 
FOR UPDATE 
USING (
  employee_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Managers can update subordinate goals" 
ON public.performance_goals 
FOR UPDATE 
USING (
  employee_id IN (
    SELECT e.id FROM public.employees e 
    JOIN public.employees m ON e.manager_id = m.id 
    WHERE m.user_id = auth.uid()
  )
);

-- RLS policies for performance_reviews
CREATE POLICY "Users can view their own reviews" 
ON public.performance_reviews 
FOR SELECT 
USING (
  employee_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Reviewers can view reviews they conduct" 
ON public.performance_reviews 
FOR SELECT 
USING (
  reviewer_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Managers can view subordinate reviews" 
ON public.performance_reviews 
FOR SELECT 
USING (
  employee_id IN (
    SELECT e.id FROM public.employees e 
    JOIN public.employees m ON e.manager_id = m.id 
    WHERE m.user_id = auth.uid()
  )
);

CREATE POLICY "Reviewers can create reviews" 
ON public.performance_reviews 
FOR INSERT 
WITH CHECK (
  reviewer_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Reviewers can update their reviews" 
ON public.performance_reviews 
FOR UPDATE 
USING (
  reviewer_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
  )
);
