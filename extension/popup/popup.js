import { sanitizeText } from "../utils/sanitize.js";
import { getLocalStorage, setLocalStorage } from "../utils/storage.js";
import { STORAGE_KEYS, API_BASE_URL } from "../utils/constants.js";

const resumeInput = document.getElementById("resumeInput");
const uploadResumeBtn = document.getElementById("uploadResumeBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const openDashboardBtn = document.getElementById("openDashboardBtn");
const optionsBtn = document.getElementById("optionsBtn");
const resumeStatus = document.getElementById("resumeStatus");

async function updateStatus(message) {
  resumeStatus.textContent = sanitizeText(message);
}

async function loadResume() {
  const resume = await getLocalStorage(STORAGE_KEYS.CURRENT_RESUME);
  if (resume) {
    await updateStatus(`Resume loaded: ${sanitizeText(resume.fullName || resume.extractedName || "Uploaded")}`);
  }
}

async function uploadResume(file) {
  const formData = new FormData();
  formData.append("resume", file);
  const response = await fetch(`${API_BASE_URL}/resumes/upload`, {
    method: "POST",
    body: formData,
    credentials: "include"
  });
  if (!response.ok) {
    throw new Error("Resume upload failed.");
  }
  return await response.json();
}

uploadResumeBtn.addEventListener("click", async () => {
  if (!resumeInput.files || resumeInput.files.length === 0) {
    await updateStatus("Select a resume file before uploading.");
    return;
  }
  uploadResumeBtn.disabled = true;
  uploadResumeBtn.textContent = "Uploading...";
  try {
    const file = resumeInput.files[0];
    const result = await uploadResume(file);
    await setLocalStorage(STORAGE_KEYS.CURRENT_RESUME, result.data);
    await updateStatus(`Resume uploaded: ${sanitizeText(result.data.fullName || result.data.extractedName || "Resume")}`);
  } catch (error) {
    await updateStatus("Upload failed. Please try again.");
    console.error(error);
  } finally {
    uploadResumeBtn.disabled = false;
    uploadResumeBtn.textContent = "Upload Resume";
  }
});

analyzeBtn.addEventListener("click", async () => {
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = "Analyzing...";
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { action: "GET_JOB_DATA" });
    if (!response || !response.success) {
      await updateStatus("Unable to read the job page. Open a supported job posting.");
      return;
    }
    await setLocalStorage(STORAGE_KEYS.CURRENT_JOB, response.data);
    chrome.runtime.sendMessage({ action: "OPEN_DASHBOARD" });
  } catch (error) {
    console.error(error);
    await updateStatus("Job analysis failed.");
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = "Analyze Job";
  }
});

openDashboardBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "OPEN_DASHBOARD" });
});

optionsBtn.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

document.addEventListener("DOMContentLoaded", loadResume);
