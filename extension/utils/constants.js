export const STORAGE_KEYS = {
  USER_SETTINGS: "applypilot_user_settings",
  CURRENT_RESUME: "applypilot_current_resume",
  CURRENT_JOB: "applypilot_current_job",
  APPLICATIONS: "applypilot_applications",
  LOCAL_AI_SETTINGS: "applypilot_local_ai_settings"
};

export const DEFAULT_SETTINGS = {
  notificationsEnabled: true,
  autoTrackApplications: false,
  localAiMode: false,
  localAiEndpoint: "",
  localAiModel: "llama-3.3-70b"
};

export const SUPPORTED_PORTALS = [
  "linkedin.com",
  "indeed.com",
  "naukri.com",
  "wellfound.com",
  "greenhouse.io",
  "lever.co",
  "ashbyhq.com",
  "workday.com"
];

export const API_BASE_URL = "https://api.applypilot.ai/v1";
