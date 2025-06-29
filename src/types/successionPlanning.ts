
export interface KeyPosition {
  id: string;
  title: string;
  department_id?: string;
  current_holder_id?: string;
  risk_level: string;
  criticality: string;
  retirement_date?: string;
  created_at: string;
  updated_at: string;
  department?: any;
  current_holder?: any;
}

export interface SuccessionCandidate {
  id: string;
  employee_id: string;
  key_position_id: string;
  readiness_level: string;
  development_progress: number;
  last_assessment_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  employee?: any;
  key_position?: KeyPosition;
}

export interface DevelopmentPlan {
  id: string;
  candidate_id: string;
  target_position: string;
  activities: string[];
  progress: number;
  timeline?: string;
  next_review_date?: string;
  created_at: string;
  updated_at: string;
  candidate?: SuccessionCandidate;
}
