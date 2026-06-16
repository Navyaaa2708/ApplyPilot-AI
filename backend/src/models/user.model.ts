export interface UserRecord {
  id: string;
  email: string;
  full_name: string;
  password_hash?: string;
  created_at: string;
}
