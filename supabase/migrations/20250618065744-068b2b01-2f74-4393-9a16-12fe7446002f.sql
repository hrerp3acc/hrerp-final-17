
-- Create enum for leave types (if not exists)
DO $$ BEGIN
    CREATE TYPE leave_type AS ENUM ('annual', 'sick', 'personal', 'emergency', 'maternity', 'paternity');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create enum for leave status (if not exists)  
DO $$ BEGIN
    CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create enum for goal status
CREATE TYPE goal_status AS ENUM ('not_started', 'in_progress', 'completed', 'overdue');

-- Create enum for review status
CREATE TYPE review_status AS ENUM ('draft', 'in_progress', 'completed');

-- Create performance_goals table
CREATE TABLE public.performance_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  target_date DATE NOT NULL,
  weight NUMERIC DEFAULT 100,
  progress NUMERIC DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status goal_status DEFAULT 'not_started',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create performance_reviews table
CREATE TABLE public.performance_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  reviewer_id UUID,
  review_period_start DATE NOT NULL,
  review_period_end DATE NOT NULL,
  overall_rating NUMERIC CHECK (overall_rating >= 1 AND overall_rating <= 5),
  goals_rating NUMERIC CHECK (goals_rating >= 1 AND goals_rating <= 5),
  competencies_rating NUMERIC CHECK (competencies_rating >= 1 AND competencies_rating <= 5),
  development_notes TEXT,
  achievements TEXT,
  areas_for_improvement TEXT,
  status review_status DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE public.performance_goals 
ADD CONSTRAINT fk_performance_goals_employee 
FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;

ALTER TABLE public.performance_reviews 
ADD CONSTRAINT fk_performance_reviews_employee 
FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;

ALTER TABLE public.performance_reviews 
ADD CONSTRAINT fk_performance_reviews_reviewer 
FOREIGN KEY (reviewer_id) REFERENCES public.employees(id) ON DELETE SET NULL;

-- Enable RLS on both tables
ALTER TABLE public.performance_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for performance_goals
CREATE POLICY "Users can view their own goals and subordinates" 
ON public.performance_goals 
FOR SELECT 
USING (
  employee_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
    UNION
    SELECT e.id FROM public.employees e 
    JOIN public.employees m ON e.manager_id = m.id 
    WHERE m.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create goals for themselves and subordinates" 
ON public.performance_goals 
FOR INSERT 
WITH CHECK (
  employee_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
    UNION
    SELECT e.id FROM public.employees e 
    JOIN public.employees m ON e.manager_id = m.id 
    WHERE m.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own goals and subordinates" 
ON public.performance_goals 
FOR UPDATE 
USING (
  employee_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
    UNION
    SELECT e.id FROM public.employees e 
    JOIN public.employees m ON e.manager_id = m.id 
    WHERE m.user_id = auth.uid()
  )
);

-- Create RLS policies for performance_reviews
CREATE POLICY "Users can view their own reviews and subordinates" 
ON public.performance_reviews 
FOR SELECT 
USING (
  employee_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
    UNION
    SELECT e.id FROM public.employees e 
    JOIN public.employees m ON e.manager_id = m.id 
    WHERE m.user_id = auth.uid()
  )
  OR 
  reviewer_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Managers can create reviews for subordinates" 
ON public.performance_reviews 
FOR INSERT 
WITH CHECK (
  employee_id IN (
    SELECT e.id FROM public.employees e 
    JOIN public.employees m ON e.manager_id = m.id 
    WHERE m.user_id = auth.uid()
  )
);

CREATE POLICY "Reviewers can update their assigned reviews" 
ON public.performance_reviews 
FOR UPDATE 
USING (
  reviewer_id IN (
    SELECT id FROM public.employees WHERE user_id = auth.uid()
  )
);
