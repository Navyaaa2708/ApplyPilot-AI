import { query } from "../config/database.js";
import { ResumeService } from "./resume.service.js";

function computeKeywordMatch(text: string, jobText: string) {
  const resumeTokens = new Set(String(text).toLowerCase().match(/\w+/g) || []);
  const jobTokens = new Set(String(jobText).toLowerCase().match(/\w+/g) || []);
  const shared = [...resumeTokens].filter((token) => jobTokens.has(token));
  return jobTokens.size === 0 ? 0 : Math.round((shared.length / jobTokens.size) * 100);
}

type JobDescription = {
  normalizedDescription?: string;
  description?: string;
  skills?: string[];
  experienceLevel?: string;
  education?: string;
  jobUrl?: string;
};

export class ATSService {
  static async score(userId: string, resumeId: string, jobDescription: JobDescription) {
    const resume = await ResumeService.getById(userId, resumeId);
    if (!resume) {
      throw new Error("Resume not found.");
    }
    const keywordScore = computeKeywordMatch(resume.normalizedText, jobDescription.normalizedDescription || jobDescription.description || "");
    const skillTargets = new Set((jobDescription.skills || []).map((skill: string) => skill.toLowerCase()));
    const resumeSkills = new Set((resume.skills || []).map((skill: string) => skill.toLowerCase()));
    const matchedSkills = [...skillTargets].filter((skill) => resumeSkills.has(skill));
    const missingSkills = [...skillTargets].filter((skill) => !resumeSkills.has(skill));
    const skillScore = skillTargets.size ? Math.round((matchedSkills.length / skillTargets.size) * 100) : 0;
    const experienceScore = resume.normalizedText.toLowerCase().includes((jobDescription.experienceLevel || "").toLowerCase()) ? 100 : 50;
    const educationScore = resume.normalizedText.toLowerCase().includes((jobDescription.education || "").toLowerCase()) ? 100 : 50;
    const atsScore = Math.round((keywordScore * 0.35) + (skillScore * 0.35) + (experienceScore * 0.15) + (educationScore * 0.15));
    const result = {
      atsScore,
      keywordScore,
      skillScore,
      experienceScore,
      educationScore,
      matchedSkills,
      missingSkills,
      recommendations: [`Strengthen keywords around ${missingSkills.slice(0, 5).join(", ")}`, "Include measurable results for experience bullets."]
    };
    const insert = await query(
      `INSERT INTO ats_scores (id, user_id, resume_id, job_hash, score, details, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW()) RETURNING id`,
      [userId, resumeId, jobDescription.jobUrl || "", atsScore, JSON.stringify(result)]
    );
    return { id: insert.rows[0].id, ...result };
  }

  static async explain(scoreId: string) {
    const result = await query(`SELECT details FROM ats_scores WHERE id = $1 LIMIT 1`, [scoreId]);
    return result.rows[0]?.details || null;
  }
}
