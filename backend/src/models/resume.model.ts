export interface ResumeRecord {
  id: string;
  user_id: string;
  filename: string;
  mime_type: string;
  full_name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  skills: string[];
  summary: string;
  raw_text: string;
  normalized_text: string;
  created_at: string;
}
