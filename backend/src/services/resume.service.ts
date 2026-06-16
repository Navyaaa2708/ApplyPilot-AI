import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { query } from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

export type ResumeFile = Express.Multer.File;

const SKILL_CANDIDATES = [
  "javascript",
  "typescript",
  "react",
  "node.js",
  "express",
  "python",
  "java",
  "c++",
  "aws",
  "docker",
  "kubernetes",
  "graphql",
  "sql",
  "postgresql",
  "mongodb",
  "git",
  "html",
  "css",
  "machine learning",
  "data analysis"
];

function extractText(file: ResumeFile): Promise<string> {
  const mimeType = file.mimetype;
  if (mimeType === "application/pdf") {
    return pdfParse(file.buffer).then((result) => result.text);
  }
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return mammoth.extractRawText({ buffer: file.buffer }).then((result) => result.value);
  }
  return Promise.resolve(file.buffer.toString("utf8"));
}

function extractEmail(text: string): string {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0] : "";
}

function extractPhone(text: string): string {
  const match = text.match(/(\+?\d[\d\s\-]{7,}\d)/g);
  return match ? match[0] : "";
}

function extractUrls(text: string): string[] {
  const matches = text.match(/https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/g);
  return matches || [];
}

function parseSkills(text: string): string[] {
  const normalized = text.toLowerCase();
  return SKILL_CANDIDATES.filter((skill) => normalized.includes(skill)).map((skill) => skill);
}

function extractName(text: string): string {
  const firstLine = text.split(/\r?\n/).find((line: string) => line.trim().length > 0);
  if (!firstLine) {
    return "";
  }
  return firstLine.replace(/[^a-zA-Z\s]/g, "").trim();
}

function normalizeResume(text: string) {
  return {
    fullName: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    linkedin: extractUrls(text).find((url: string) => url.toLowerCase().includes("linkedin.com")) || "",
    github: extractUrls(text).find((url: string) => url.toLowerCase().includes("github.com")) || "",
    portfolio: extractUrls(text).find((url: string) => !url.toLowerCase().includes("linkedin.com") && !url.toLowerCase().includes("github.com")) || "",
    skills: parseSkills(text),
    summary: text.slice(0, 400).replace(/\s+/g, " ").trim(),
    rawText: text,
    normalizedText: text.replace(/\s+/g, " ").trim()
  };
}

export class ResumeService {
  static async parseAndStore(userId: string, file: ResumeFile) {
    const text = await extractText(file);
    const payload = normalizeResume(text);
    const resumeId = uuidv4();
    await query(
      `INSERT INTO resumes (id, user_id, filename, mime_type, full_name, email, phone, linkedin, github, portfolio, skills, summary, raw_text, normalized_text, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW())`,
      [resumeId, userId, file.originalname, file.mimetype, payload.fullName, payload.email, payload.phone, payload.linkedin, payload.github, payload.portfolio, payload.skills, payload.summary, payload.rawText, payload.normalizedText]
    );
    return { id: resumeId, ...payload };
  }

  static async listForUser(userId: string) {
    const result = await query(`SELECT id, filename, full_name, email, phone, linkedin, github, portfolio, skills, summary, raw_text, normalized_text, created_at FROM resumes WHERE user_id = $1 ORDER BY created_at DESC`, [userId]);
    return result.rows;
  }

  static async getById(userId: string, resumeId: string) {
    const result = await query(`SELECT id, filename, full_name, email, phone, linkedin, github, portfolio, skills, summary, raw_text, normalized_text, created_at FROM resumes WHERE user_id = $1 AND id = $2 LIMIT 1`, [userId, resumeId]);
    return result.rows[0] || null;
  }

  static async optimize(userId: string, resumeId: string, jobDescription: { role?: string; skills?: string[]; normalizedDescription?: string }) {
    const resume = await ResumeService.getById(userId, resumeId);
    if (!resume) {
      throw new Error("Resume not found.");
    }
    const optimized = {
      ...resume,
      optimizedSummary: `Optimized career summary for role: ${jobDescription?.role || "target position"}`,
      adjustedSkills: Array.from(new Set([...(resume.skills || []), ...(jobDescription?.skills || [])])).slice(0, 30)
    };
    return optimized;
  }

  static async exportResume(userId: string, resumeId: string, format: string) {
    const resume = await ResumeService.getById(userId, resumeId);
    if (!resume) {
      throw new Error("Resume not found.");
    }
    const documentText = `Resume: ${resume.full_name || resume.filename}\nEmail: ${resume.email}\nPhone: ${resume.phone}\nLinkedIn: ${resume.linkedin}\nGitHub: ${resume.github}\n\nSkills:\n${(resume.skills || []).join(", ")}\n\nSummary:\n${resume.summary}`;
    return {
      data: documentText,
      format,
      filename: `${resume.full_name || "resume"}.${format}`
    };
  }
}
