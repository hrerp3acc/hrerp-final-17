export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          module: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          module?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          module?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      attendance_records: {
        Row: {
          break_duration: unknown | null
          check_in_time: string | null
          check_out_time: string | null
          created_at: string | null
          date: string
          employee_id: string
          id: string
          notes: string | null
          status: string | null
          total_hours: number | null
        }
        Insert: {
          break_duration?: unknown | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          date: string
          employee_id: string
          id?: string
          notes?: string | null
          status?: string | null
          total_hours?: number | null
        }
        Update: {
          break_duration?: unknown | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          date?: string
          employee_id?: string
          id?: string
          notes?: string | null
          status?: string | null
          total_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      capacity_planning: {
        Row: {
          capacity_headcount: number | null
          created_at: string
          current_headcount: number | null
          department_id: string | null
          gap: number | null
          id: string
          open_positions: number | null
          planned_headcount: number | null
          planning_period_end: string | null
          planning_period_start: string | null
          priority: string | null
          updated_at: string
        }
        Insert: {
          capacity_headcount?: number | null
          created_at?: string
          current_headcount?: number | null
          department_id?: string | null
          gap?: number | null
          id?: string
          open_positions?: number | null
          planned_headcount?: number | null
          planning_period_end?: string | null
          planning_period_start?: string | null
          priority?: string | null
          updated_at?: string
        }
        Update: {
          capacity_headcount?: number | null
          created_at?: string
          current_headcount?: number | null
          department_id?: string | null
          gap?: number | null
          id?: string
          open_positions?: number | null
          planned_headcount?: number | null
          planning_period_end?: string | null
          planning_period_start?: string | null
          priority?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "capacity_planning_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          certificate_url: string | null
          created_at: string | null
          employee_id: string
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuer: string | null
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string | null
          employee_id: string
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          certificate_url?: string | null
          created_at?: string | null
          employee_id?: string
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certifications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_items: {
        Row: {
          assigned_to: string | null
          category: string
          completion_date: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category: string
          completion_date?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          completion_date?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_items_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          employee_id: string
          enrolled_at: string | null
          id: string
          progress: number | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          employee_id: string
          enrolled_at?: string | null
          id?: string
          progress?: number | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          employee_id?: string
          enrolled_at?: string | null
          id?: string
          progress?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          duration_hours: number | null
          id: string
          instructor_email: string | null
          instructor_name: string | null
          status: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_hours?: number | null
          id?: string
          instructor_email?: string | null
          instructor_name?: string | null
          status?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_hours?: number | null
          id?: string
          instructor_email?: string | null
          instructor_name?: string | null
          status?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string | null
          description: string | null
          head_id: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          head_id?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          head_id?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_department_head"
            columns: ["head_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      development_plans: {
        Row: {
          activities: Json | null
          candidate_id: string | null
          created_at: string
          id: string
          next_review_date: string | null
          progress: number | null
          target_position: string
          timeline: string | null
          updated_at: string
        }
        Insert: {
          activities?: Json | null
          candidate_id?: string | null
          created_at?: string
          id?: string
          next_review_date?: string | null
          progress?: number | null
          target_position: string
          timeline?: string | null
          updated_at?: string
        }
        Update: {
          activities?: Json | null
          candidate_id?: string | null
          created_at?: string
          id?: string
          next_review_date?: string | null
          progress?: number | null
          target_position?: string
          timeline?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "development_plans_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "succession_candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_benefits: {
        Row: {
          amount: number | null
          benefit_name: string
          benefit_type: string
          coverage_end: string | null
          coverage_start: string | null
          created_at: string | null
          employee_id: string
          id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          benefit_name: string
          benefit_type: string
          coverage_end?: string | null
          coverage_start?: string | null
          created_at?: string | null
          employee_id: string
          id?: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          benefit_name?: string
          benefit_type?: string
          coverage_end?: string | null
          coverage_start?: string | null
          created_at?: string | null
          employee_id?: string
          id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_benefits_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_skills: {
        Row: {
          certified: boolean | null
          created_at: string
          employee_id: string
          id: string
          proficiency_level: string | null
          skill_id: string
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          certified?: boolean | null
          created_at?: string
          employee_id: string
          id?: string
          proficiency_level?: string | null
          skill_id: string
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          certified?: boolean | null
          created_at?: string
          employee_id?: string
          id?: string
          proficiency_level?: string | null
          skill_id?: string
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_skills_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address: string | null
          created_at: string | null
          department_id: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_id: string
          first_name: string
          id: string
          last_name: string
          location: string | null
          manager_id: string | null
          notes: string | null
          phone: string | null
          position: string | null
          salary: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["employee_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          department_id?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id: string
          first_name: string
          id?: string
          last_name: string
          location?: string | null
          manager_id?: string | null
          notes?: string | null
          phone?: string | null
          position?: string | null
          salary?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["employee_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          department_id?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string
          first_name?: string
          id?: string
          last_name?: string
          location?: string | null
          manager_id?: string | null
          notes?: string | null
          phone?: string | null
          position?: string | null
          salary?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["employee_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_reports: {
        Row: {
          created_at: string
          description: string | null
          file_size: string | null
          file_url: string | null
          generated_by: string | null
          id: string
          name: string
          report_data: Json
          status: string | null
          template_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_size?: string | null
          file_url?: string | null
          generated_by?: string | null
          id?: string
          name: string
          report_data: Json
          status?: string | null
          template_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          file_size?: string | null
          file_url?: string | null
          generated_by?: string | null
          id?: string
          name?: string
          report_data?: Json
          status?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_reports_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          applied_at: string | null
          candidate_email: string
          candidate_name: string
          candidate_phone: string | null
          cover_letter: string | null
          id: string
          job_posting_id: string
          resume_url: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          updated_at: string | null
        }
        Insert: {
          applied_at?: string | null
          candidate_email: string
          candidate_name: string
          candidate_phone?: string | null
          cover_letter?: string | null
          id?: string
          job_posting_id: string
          resume_url?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
        }
        Update: {
          applied_at?: string | null
          candidate_email?: string
          candidate_name?: string
          candidate_phone?: string | null
          cover_letter?: string | null
          id?: string
          job_posting_id?: string
          resume_url?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_posting_id_fkey"
            columns: ["job_posting_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          created_at: string | null
          department_id: string | null
          description: string | null
          id: string
          location: string | null
          posted_by: string | null
          requirements: string | null
          salary_max: number | null
          salary_min: number | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          location?: string | null
          posted_by?: string | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          location?: string | null
          posted_by?: string | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_postings_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      key_positions: {
        Row: {
          created_at: string
          criticality: string | null
          current_holder_id: string | null
          department_id: string | null
          id: string
          retirement_date: string | null
          risk_level: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          criticality?: string | null
          current_holder_id?: string | null
          department_id?: string | null
          id?: string
          retirement_date?: string | null
          risk_level?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          criticality?: string | null
          current_holder_id?: string | null
          department_id?: string | null
          id?: string
          retirement_date?: string | null
          risk_level?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "key_positions_current_holder_id_fkey"
            columns: ["current_holder_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "key_positions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_applications: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          employee_id: string
          end_date: string
          id: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          reason: string | null
          start_date: string
          status: Database["public"]["Enums"]["leave_status"] | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          employee_id: string
          end_date: string
          id?: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          reason?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["leave_status"] | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          employee_id?: string
          end_date?: string
          id?: string
          leave_type?: Database["public"]["Enums"]["leave_type"]
          reason?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["leave_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_applications_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_applications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_progress: {
        Row: {
          completed_at: string | null
          completed_steps: number[] | null
          current_step: number | null
          id: string
          is_completed: boolean | null
          started_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          completed_steps?: number[] | null
          current_step?: number | null
          id?: string
          is_completed?: boolean | null
          started_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          completed_steps?: number[] | null
          current_step?: number | null
          id?: string
          is_completed?: boolean | null
          started_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      organizational_skills: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          required_level: string | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          required_level?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          required_level?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizational_skills_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "skills_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      pay_periods: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          pay_date: string
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          pay_date: string
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          pay_date?: string
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payroll_records: {
        Row: {
          allowances: number | null
          basic_salary: number
          created_at: string | null
          deductions: number | null
          employee_id: string
          gross_salary: number
          id: string
          net_salary: number
          overtime_amount: number | null
          paid_at: string | null
          pay_period_id: string
          processed_at: string | null
          status: string | null
          tax_deductions: number | null
          updated_at: string | null
        }
        Insert: {
          allowances?: number | null
          basic_salary?: number
          created_at?: string | null
          deductions?: number | null
          employee_id: string
          gross_salary?: number
          id?: string
          net_salary?: number
          overtime_amount?: number | null
          paid_at?: string | null
          pay_period_id: string
          processed_at?: string | null
          status?: string | null
          tax_deductions?: number | null
          updated_at?: string | null
        }
        Update: {
          allowances?: number | null
          basic_salary?: number
          created_at?: string | null
          deductions?: number | null
          employee_id?: string
          gross_salary?: number
          id?: string
          net_salary?: number
          overtime_amount?: number | null
          paid_at?: string | null
          pay_period_id?: string
          processed_at?: string | null
          status?: string | null
          tax_deductions?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_records_pay_period_id_fkey"
            columns: ["pay_period_id"]
            isOneToOne: false
            referencedRelation: "pay_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_goals: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          employee_id: string
          id: string
          notes: string | null
          progress: number | null
          status: Database["public"]["Enums"]["goal_status"] | null
          target_date: string
          title: string
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          employee_id: string
          id?: string
          notes?: string | null
          progress?: number | null
          status?: Database["public"]["Enums"]["goal_status"] | null
          target_date: string
          title: string
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          employee_id?: string
          id?: string
          notes?: string | null
          progress?: number | null
          status?: Database["public"]["Enums"]["goal_status"] | null
          target_date?: string
          title?: string
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_performance_goals_employee"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_goals_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_reviews: {
        Row: {
          achievements: string | null
          areas_for_improvement: string | null
          competencies_rating: number | null
          created_at: string | null
          development_notes: string | null
          employee_id: string
          goals_rating: number | null
          id: string
          overall_rating: number | null
          review_period_end: string
          review_period_start: string
          reviewer_id: string | null
          status: Database["public"]["Enums"]["review_status"] | null
          updated_at: string | null
        }
        Insert: {
          achievements?: string | null
          areas_for_improvement?: string | null
          competencies_rating?: number | null
          created_at?: string | null
          development_notes?: string | null
          employee_id: string
          goals_rating?: number | null
          id?: string
          overall_rating?: number | null
          review_period_end: string
          review_period_start: string
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["review_status"] | null
          updated_at?: string | null
        }
        Update: {
          achievements?: string | null
          areas_for_improvement?: string | null
          competencies_rating?: number | null
          created_at?: string | null
          development_notes?: string | null
          employee_id?: string
          goals_rating?: number | null
          id?: string
          overall_rating?: number | null
          review_period_end?: string
          review_period_start?: string
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["review_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_performance_reviews_employee"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_performance_reviews_reviewer"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_reviews_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department_id: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          position: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department_id?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          position?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department_id?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          position?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          status: string | null
          updated_at: string
        }
        Insert: {
          client?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          client?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      report_templates: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          template_config: Json
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          template_config: Json
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          template_config?: Json
          updated_at?: string
        }
        Relationships: []
      }
      skill_assessments: {
        Row: {
          assessed_by: string | null
          assessment_date: string | null
          created_at: string
          current_level: number | null
          employee_id: string | null
          id: string
          notes: string | null
          skill_id: string | null
          target_level: number | null
          updated_at: string
        }
        Insert: {
          assessed_by?: string | null
          assessment_date?: string | null
          created_at?: string
          current_level?: number | null
          employee_id?: string | null
          id?: string
          notes?: string | null
          skill_id?: string | null
          target_level?: number | null
          updated_at?: string
        }
        Update: {
          assessed_by?: string | null
          assessment_date?: string | null
          created_at?: string
          current_level?: number | null
          employee_id?: string | null
          id?: string
          notes?: string | null
          skill_id?: string | null
          target_level?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_assessments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_assessments_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "organizational_skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          level_required: string | null
          name: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          level_required?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          level_required?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      skills_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      succession_candidates: {
        Row: {
          created_at: string
          development_progress: number | null
          employee_id: string | null
          id: string
          key_position_id: string | null
          last_assessment_date: string | null
          notes: string | null
          readiness_level: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          development_progress?: number | null
          employee_id?: string | null
          id?: string
          key_position_id?: string | null
          last_assessment_date?: string | null
          notes?: string | null
          readiness_level?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          development_progress?: number | null
          employee_id?: string | null
          id?: string
          key_position_id?: string | null
          last_assessment_date?: string | null
          notes?: string | null
          readiness_level?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "succession_candidates_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "succession_candidates_key_position_id_fkey"
            columns: ["key_position_id"]
            isOneToOne: false
            referencedRelation: "key_positions"
            referencedColumns: ["id"]
          },
        ]
      }
      system_configs: {
        Row: {
          category: string | null
          config_key: string
          config_value: Json
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          config_key: string
          config_value: Json
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          config_key?: string
          config_value?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      system_notifications: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          message: string
          target_users: string[] | null
          title: string
          type: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          message: string
          target_users?: string[] | null
          title: string
          type?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          message?: string
          target_users?: string[] | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          description: string | null
          estimated_hours: number | null
          id: string
          name: string
          project_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_hours?: number | null
          id?: string
          name: string
          project_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_hours?: number | null
          id?: string
          name?: string
          project_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          break_duration: unknown | null
          created_at: string
          description: string | null
          employee_id: string
          end_time: string | null
          id: string
          is_billable: boolean | null
          project_id: string | null
          start_time: string
          status: string | null
          task_id: string | null
          total_hours: number | null
          updated_at: string
        }
        Insert: {
          break_duration?: unknown | null
          created_at?: string
          description?: string | null
          employee_id: string
          end_time?: string | null
          id?: string
          is_billable?: boolean | null
          project_id?: string | null
          start_time: string
          status?: string | null
          task_id?: string | null
          total_hours?: number | null
          updated_at?: string
        }
        Update: {
          break_duration?: unknown | null
          created_at?: string
          description?: string | null
          employee_id?: string
          end_time?: string | null
          id?: string
          is_billable?: boolean | null
          project_id?: string | null
          start_time?: string
          status?: string | null
          task_id?: string | null
          total_hours?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      timesheets: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          employee_id: string
          id: string
          notes: string | null
          status: string | null
          submitted_at: string | null
          total_hours: number | null
          updated_at: string
          week_end_date: string
          week_start_date: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          employee_id: string
          id?: string
          notes?: string | null
          status?: string | null
          submitted_at?: string | null
          total_hours?: number | null
          updated_at?: string
          week_end_date: string
          week_start_date: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          employee_id?: string
          id?: string
          notes?: string | null
          status?: string | null
          submitted_at?: string | null
          total_hours?: number | null
          updated_at?: string
          week_end_date?: string
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "timesheets_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheets_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      training_programs: {
        Row: {
          completion_rate: number | null
          created_at: string
          current_participants: number | null
          description: string | null
          duration_hours: number | null
          end_date: string | null
          id: string
          max_participants: number | null
          skill_id: string | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          completion_rate?: number | null
          created_at?: string
          current_participants?: number | null
          description?: string | null
          duration_hours?: number | null
          end_date?: string | null
          id?: string
          max_participants?: number | null
          skill_id?: string | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          completion_rate?: number | null
          created_at?: string
          current_participants?: number | null
          description?: string | null
          duration_hours?: number | null
          end_date?: string | null
          id?: string
          max_participants?: number | null
          skill_id?: string | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_programs_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "organizational_skills"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          dashboard_preferences: Json | null
          id: string
          language: string | null
          notification_preferences: Json | null
          theme: string | null
          timezone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          dashboard_preferences?: Json | null
          id?: string
          language?: string | null
          notification_preferences?: Json | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          dashboard_preferences?: Json | null
          id?: string
          language?: string | null
          notification_preferences?: Json | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      workforce_plans: {
        Row: {
          budget: number | null
          created_at: string
          created_by: string | null
          current_headcount: number | null
          department_id: string | null
          description: string | null
          end_date: string | null
          id: string
          plan_type: string
          start_date: string | null
          status: string
          target_headcount: number | null
          title: string
          updated_at: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          created_by?: string | null
          current_headcount?: number | null
          department_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          plan_type: string
          start_date?: string | null
          status?: string
          target_headcount?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          created_by?: string | null
          current_headcount?: number | null
          department_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          plan_type?: string
          start_date?: string | null
          status?: string
          target_headcount?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workforce_plans_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "employee" | "hr"
      application_status:
        | "applied"
        | "screening"
        | "interview"
        | "offer"
        | "hired"
        | "rejected"
      employee_status: "active" | "inactive" | "terminated"
      goal_status: "not_started" | "in_progress" | "completed" | "overdue"
      leave_status: "pending" | "approved" | "rejected"
      leave_type:
        | "annual"
        | "sick"
        | "personal"
        | "emergency"
        | "maternity"
        | "paternity"
      review_status: "draft" | "in_progress" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "employee", "hr"],
      application_status: [
        "applied",
        "screening",
        "interview",
        "offer",
        "hired",
        "rejected",
      ],
      employee_status: ["active", "inactive", "terminated"],
      goal_status: ["not_started", "in_progress", "completed", "overdue"],
      leave_status: ["pending", "approved", "rejected"],
      leave_type: [
        "annual",
        "sick",
        "personal",
        "emergency",
        "maternity",
        "paternity",
      ],
      review_status: ["draft", "in_progress", "completed"],
    },
  },
} as const
