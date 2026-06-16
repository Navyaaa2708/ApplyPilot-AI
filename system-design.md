# ApplyPilot AI System Design

## Purpose
This document defines the end-to-end system design and interactions for ApplyPilot AI, including component behavior, API boundaries, data contracts, and runtime flow.

## User Journeys

### Resume Upload and Management
- User uploads a PDF, DOCX, or TXT resume from the extension popup.
- The extension parses the file locally using PDF.js and Mammoth.js where available.
- Structured resume sections are normalized and sent to the backend for storage.
- The user can view and manage resumes in the dashboard.

### Job Description Extraction
- Content scripts detect supported job pages and normalize postings into a standard schema.
- Job metadata includes company, role, location, salary, requirements, responsibilities, skills, experience, and job type.
- The user can trigger analysis or optimization from the browser action popup.

### ATS Scoring
- The backend calculates keyword match, skill match, education match, experience match, and semantic similarity.
- Embeddings are generated with BGE-M3 or Nomic Embed.
- The engine returns score details, missing skills, missing keywords, and upgrade recommendations.

### AI Resume Optimization
- Users request optimization for a selected resume and job description.
- The AI layer compares the resume and JD, rewrites bullets, improves summaries, and returns an optimized resume object.
- Users may export optimized content as PDF or DOCX.

### Cover Letter Generation
- Users select a job and resume, then request a cover letter.
- The AI layer generates a personalized, ATS-friendly cover letter.
- The extension offers PDF and DOCX export.

### Application Tracking
- Users log applications with company, role, URL, status, notes, and ATS score.
- The dashboard shows a timeline and funnel view.
- Data is persisted and can be edited.

### Auto Form Fill
- Content scripts detect form fields on supported career portals.
- The extension populates fields after explicit user approval.
- No automatic form submission is performed.

### Local AI Mode
- Users configure a local Ollama endpoint.
- Local model settings are saved in extension options.
- Resume text remains on-device for local inference calls.

## Component Responsibilities

### Extension
- UI rendering in popup, dashboard, and options.
- Local document parsing and preview.
- Job page scraping and form autofill.
- API client for backend integration and local AI providers.
- User state, preferences, and session persistence.

### Backend
- Authentication, user management, and secure session handling.
- Resume normalization, storage, and search indices.
- Job normalization and platform-specific scraping helpers.
- ATS scoring logic and semantic embedding evaluation.
- AI orchestration, provider abstraction, and export generation.
- Application tracker API and analytics endpoints.

### AI Gateway
- Provides unified interfaces for completion, embedding, and streaming.
- Manages provider switching and local / cloud mode.
- Supports model configuration for Llama, Qwen, Mistral, Gemma, Phi, and DeepSeek.

## Data Model

### Resume Object
- `id`
- `userId`
- `uploadedAt`
- `source`
- `fullName`
- `email`
- `phone`
- `linkedin`
- `github`
- `portfolio`
- `headline`
- `summary`
- `skills`
- `education`
- `experience`
- `projects`
- `certifications`
- `achievements`
- `rawText`
- `normalizedText`
- `skillEmbeddings`
- `status`

### Job Object
- `id`
- `userId`
- `source`
- `company`
- `role`
- `location`
- `salaryRange`
- `jobType`
- `experienceLevel`
- `requirements`
- `responsibilities`
- `skills`
- `postedAt`
- `jobUrl`
- `normalizedDescription`

### Application Object
- `id`
- `userId`
- `resumeId`
- `jobId`
- `company`
- `role`
- `status`
- `atsScore`
- `fitScore`
- `jobUrl`
- `notes`
- `dateApplied`
- `history`

## API Contracts

### Authentication
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/oauth/google`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Resume
- `POST /api/resumes/upload`
- `GET /api/resumes`
- `GET /api/resumes/:id`
- `PUT /api/resumes/:id`
- `POST /api/resumes/:id/optimize`
- `POST /api/resumes/:id/export`

### Job
- `POST /api/jobs/normalize`
- `GET /api/jobs/:id`
- `POST /api/jobs/recommend`

### ATS
- `POST /api/ats/score`
- `GET /api/ats/explain/:id`

### AI
- `POST /api/ai/cover-letter`
- `POST /api/ai/local/connect`
- `GET /api/ai/providers`

### Applications
- `POST /api/applications`
- `GET /api/applications`
- `PUT /api/applications/:id`
- `DELETE /api/applications/:id`

## Security Design

- All API endpoints require authentication except publicly exposed health checks.
- Input schemas are validated with strong TypeScript guard logic.
- CSRF protection uses double-submit cookies for web clients.
- JWT refresh tokens are stored with secure, httpOnly cookies.
- Extension uses short-lived access tokens and refresh flows.

## Monitoring and Observability

- `GET /api/healthz` exposes application health and dependency status.
- Sentry captures errors and release metadata.
- OpenTelemetry traces request execution and provider calls.
- Structured logs include correlation IDs and request context.

## Deployment

- Build backend with TypeScript and package as Docker image.
- Deploy backend to Railway or Render with managed Postgres and Redis.
- Use Supabase Storage for resume export assets.
- Use GitHub Actions to run lint, tests, and security scans on each PR.
- Chrome extension artifacts are packaged for Web Store submission.
