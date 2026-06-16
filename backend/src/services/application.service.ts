import { query } from "../config/database.js";

export class ApplicationService {
  static async create(userId: string, payload: { id?: string; resumeId?: string; company: string; role: string; status?: string; atsScore?: number; fitScore?: number; jobUrl?: string; notes?: string; dateApplied?: string; }) {
    const id = payload.id || crypto.randomUUID();
    const result = await query(
      `INSERT INTO applications (id, user_id, resume_id, company, role, status, ats_score, fit_score, job_url, notes, date_applied, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW()) RETURNING *`,
      [
        id,
        userId,
        payload.resumeId || null,
        payload.company,
        payload.role,
        payload.status || "Applied",
        payload.atsScore || 0,
        payload.fitScore || 0,
        payload.jobUrl || "",
        payload.notes || "",
        payload.dateApplied || new Date().toISOString()
      ]
    );
    return result.rows[0];
  }

  static async list(userId: string) {
    const result = await query(`SELECT * FROM applications WHERE user_id = $1 ORDER BY date_applied DESC`, [userId]);
    return result.rows;
  }

  static async update(userId: string, applicationId: string, updates: { company?: string; role?: string; status?: string; ats_score?: number; fit_score?: number; job_url?: string; notes?: string; date_applied?: string; }) {
    const existing = await query(`SELECT * FROM applications WHERE user_id = $1 AND id = $2 LIMIT 1`, [userId, applicationId]);
    if (!existing.rows.length) {
      throw new Error("Application not found.");
    }
    const record = existing.rows[0];
    const merged = {
      ...record,
      ...updates
    };
    const result = await query(
      `UPDATE applications SET company = $1, role = $2, status = $3, ats_score = $4, fit_score = $5, job_url = $6, notes = $7, date_applied = $8, updated_at = NOW() WHERE id = $9 RETURNING *`,
      [merged.company, merged.role, merged.status, merged.ats_score, merged.fit_score, merged.job_url, merged.notes, merged.date_applied, applicationId]
    );
    return result.rows[0];
  }

  static async remove(userId: string, applicationId: string) {
    await query(`DELETE FROM applications WHERE user_id = $1 AND id = $2`, [userId, applicationId]);
  }
}
