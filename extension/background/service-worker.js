import { getLocalStorage, setLocalStorage } from "../utils/storage.js";

const DEFAULT_STATE = {
  applicationCount: 0,
  settings: {
    notificationsEnabled: true,
    autoTrackApplications: false,
    localAiMode: false,
    localAiEndpoint: "",
    localAiModel: "llama-3.3-70b"
  }
};

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === "install") {
    await setLocalStorage("applypilot_app_state", DEFAULT_STATE);
  }
});

chrome.runtime.onStartup.addListener(async () => {
  const state = await getLocalStorage("applypilot_app_state");
  if (!state) {
    await setLocalStorage("applypilot_app_state", DEFAULT_STATE);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "OPEN_DASHBOARD":
      openDashboard().then((result) => sendResponse(result));
      return true;
    case "SHOW_NOTIFICATION":
      showNotification(request.title, request.message).then(() => sendResponse({ success: true }));
      return true;
    case "TRACK_APPLICATION":
      trackApplication(request.payload).then((result) => sendResponse(result));
      return true;
    default:
      sendResponse({ success: false, error: "Unknown action" });
      return true;
  }
});

async function openDashboard() {
  try {
    await chrome.tabs.create({ url: chrome.runtime.getURL("dashboard/dashboard.html") });
    return { success: true };
  } catch (error) {
    return { success: false, error: error?.message || "Failed to open dashboard" };
  }
}

async function trackApplication(application) {
  try {
    const applications = (await getLocalStorage("applypilot_applications")) || [];
    const normalized = { ...application, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    applications.unshift(normalized);
    await setLocalStorage("applypilot_applications", applications);
    await setLocalStorage("applypilot_app_state", { ...(await getLocalStorage("applypilot_app_state")), applicationCount: applications.length });
    return { success: true, data: normalized };
  } catch (error) {
    return { success: false, error: error?.message || "Unable to track application" };
  }
}

async function showNotification(title, message) {
  if (!chrome.notifications) {
    return;
  }
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: title || "ApplyPilot AI",
    message: message || "Action completed."
  });
}
