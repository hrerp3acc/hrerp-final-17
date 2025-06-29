
-- Skills Management Tables
CREATE TABLE public.skills_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.organizational_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.skills_categories(id),
  description TEXT,
  required_level TEXT DEFAULT 'intermediate',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.skill_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id),
  skill_id UUID REFERENCES public.organizational_skills(id),
  current_level INTEGER DEFAULT 0,
  target_level INTEGER DEFAULT 0,
  assessed_by UUID,
  assessment_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Training Programs Table
CREATE TABLE public.training_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  skill_id UUID REFERENCES public.organizational_skills(id),
  duration_hours INTEGER,
  status TEXT DEFAULT 'planned',
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  completion_rate INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Succession Planning Tables
CREATE TABLE public.key_positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id),
  current_holder_id UUID REFERENCES public.employees(id),
  risk_level TEXT DEFAULT 'medium',
  criticality TEXT DEFAULT 'medium',
  retirement_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.succession_candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id),
  key_position_id UUID REFERENCES public.key_positions(id),
  readiness_level TEXT DEFAULT '2+ years',
  development_progress INTEGER DEFAULT 0,
  last_assessment_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.development_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES public.succession_candidates(id),
  target_position TEXT NOT NULL,
  activities JSONB DEFAULT '[]',
  progress INTEGER DEFAULT 0,
  timeline TEXT,
  next_review_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Workforce Planning Tables
CREATE TABLE public.capacity_planning (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID REFERENCES public.departments(id),
  current_headcount INTEGER DEFAULT 0,
  planned_headcount INTEGER DEFAULT 0,
  capacity_headcount INTEGER DEFAULT 0,
  gap INTEGER DEFAULT 0,
  priority TEXT DEFAULT 'medium',
  open_positions INTEGER DEFAULT 0,
  planning_period_start DATE,
  planning_period_end DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for all tables
ALTER TABLE public.skills_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizational_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.key_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.succession_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.development_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capacity_planning ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (you can make these more restrictive based on your needs)
CREATE POLICY "Allow authenticated users to view skills_categories" ON public.skills_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage skills_categories" ON public.skills_categories FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view organizational_skills" ON public.organizational_skills FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage organizational_skills" ON public.organizational_skills FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view skill_assessments" ON public.skill_assessments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage skill_assessments" ON public.skill_assessments FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view training_programs" ON public.training_programs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage training_programs" ON public.training_programs FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view key_positions" ON public.key_positions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage key_positions" ON public.key_positions FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view succession_candidates" ON public.succession_candidates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage succession_candidates" ON public.succession_candidates FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view development_plans" ON public.development_plans FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage development_plans" ON public.development_plans FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view capacity_planning" ON public.capacity_planning FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage capacity_planning" ON public.capacity_planning FOR ALL TO authenticated USING (true);
