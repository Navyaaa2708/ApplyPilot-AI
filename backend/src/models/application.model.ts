export interface ApplicationRecord {
  id: string;
  user_id: string;
  resume_id: string | null;
  company: string;
  role: string;
  status: string;
  ats_score: number;
  fit_score: number;
  job_url: string;
  notes: string;
  date_applied: string;
  created_at: string;
  updated_at?: string;
}
