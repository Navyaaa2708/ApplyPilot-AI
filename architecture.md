# ApplyPilot AI Architecture

## Purpose
This architecture document defines the production-grade component structure for ApplyPilot AI. It covers the Chrome extension, backend API, AI gateway, data persistence, security model, monitoring, and deployment patterns.

## Architecture Overview
ApplyPilot AI is split into three main layers:

1. Chrome Extension
   - UI surfaces and browser-level automation
   - Resume upload, JD extraction, ATS analysis, application tracking, and local AI settings
   - Communicates with the backend API for secure processing and long-term storage

2. Backend API
   - Node.js + Express.js + TypeScript service
   - Auth, resume parsing, job normalization, ATS scoring, AI orchestration, application tracking, and insights
   - Exposes REST endpoints for extension and external clients

3. AI Gateway
   - Abstracts access to open source inference providers
   - Supports local inference providers such as Ollama and vLLM-enabled systems
   - Supports cloud provider fallback and streaming responses

## Key Design Principles

- Privacy-first
  - Sensitive resume text and application data are encrypted in transit and at rest.
  - Local AI mode keeps resume content on-device whenever possible.
  - No OpenAI dependencies.

- Modular service design
  - Separation of concerns between parsing, scoring, AI generation, storage, and telemetry.
  - Business logic is isolated from provider-specific AI details.

- Provider abstraction
  - AI requests never call provider-specific code directly.
  - Provider config can switch between models and inference engines without changing business logic.

- Chrome Web Store compliance
  - No `eval()` or inline JavaScript.
  - Minimal permissions and explicit user consent for form autofill.
  - CSP enforced for extension pages.

- Production readiness
  - Strong typing with TypeScript
  - Input validation and error handling
  - Monitoring with Sentry and OpenTelemetry
  - Test suites with Jest and Playwright

## Component Map

- `extension/`
  - `manifest.json`
  - `background/` service worker and message handlers
  - `content/` scripts for job scraping and autofill
  - `popup/`, `dashboard/`, `options/` UI modules
  - `services/` for API, resume, and job integration
  - `ai/` local model connection and provider settings
  - `storage/` state persistence wrappers
  - `security/` sanitization and CSP enforcement helpers

- `backend/`
  - `src/app.ts` entrypoint
  - `src/routes/` request routing
  - `src/controllers/` business logic orchestration
  - `src/services/` domain logic for resumes, jobs, ATS, AI, and tracking
  - `src/models/` persistence mapping for PostgreSQL
  - `src/middleware/` auth, validation, error handling, rate limiting
  - `src/config/` environment and provider configuration
  - `src/utils/` helper libraries for logging, security, parsing, and embedding

## Data Flow

1. User uploads resume in the extension UI.
2. Extension sends resume metadata to backend resume endpoint.
3. Backend parses document, extracts structured resume sections, and stores normalized data.
4. User navigates to a job posting.
5. Content script extracts a normalized job object and sends it to the extension.
6. User requests ATS analysis or resume optimization.
7. Extension calls backend ATS or AI endpoints.
8. Backend uses embeddings and provider abstraction to generate scores, recommendations, tailored resumes, and cover letters.
9. Results are returned to extension UI, displayed in dashboards, and saved to PostgreSQL.

## Security and Compliance

- OAuth and password auth are handled by backend with secure cookies and JWT.
- Chrome storage is used only for session state and user preferences.
- No hidden tracking or background form submission.
- Form autofill requires explicit user interaction and review.
- All extension pages are CSP-locked and loaded from self-hosted resources.

## Deployment Targets

- Backend API: Railway or Render with Docker support.
- Frontend extension: packaged via Chrome ZIP and published to Chrome Web Store.
- Storage: PostgreSQL and Redis are provisioned by hosted providers.
- Object storage: Supabase Storage for optimized resumes and exports.

## Monitoring

- Sentry to capture errors and performance issues.
- OpenTelemetry to track request latency and AI call durations.
- Structured logging for audits and production diagnostics.

## Production Readiness Checklist

- [x] No inline script in extension pages
- [x] CSP enforced
- [x] Extension permissions minimized
- [x] Backend typed with TypeScript
- [x] AI abstraction layer implemented
- [x] Resume and JD normalization built
- [x] ATS scoring and recommendations available
- [x] Auth and secure storage defined
- [x] Test suite scaffolded
- [x] Deployment and docs created
