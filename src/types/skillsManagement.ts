
export interface SkillCategory {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationalSkill {
  id: string;
  name: string;
  category_id?: string;
  description?: string;
  required_level: string;
  created_at: string;
  updated_at: string;
  category?: SkillCategory;
}

export interface SkillAssessment {
  id: string;
  employee_id: string;
  skill_id: string;
  current_level: number;
  target_level: number;
  assessed_by?: string;
  assessment_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  skill?: OrganizationalSkill;
  employee?: any;
}

export interface TrainingProgram {
  id: string;
  title: string;
  description?: string;
  skill_id?: string;
  duration_hours?: number;
  status: string;
  max_participants?: number;
  current_participants: number;
  completion_rate: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  skill?: OrganizationalSkill;
}
