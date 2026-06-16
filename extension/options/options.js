import { DEFAULT_SETTINGS, STORAGE_KEYS } from "../utils/constants.js";
import { getLocalStorage, setLocalStorage } from "../utils/storage.js";
import { sanitizeText } from "../utils/sanitize.js";

const notificationsInput = document.getElementById("notificationsEnabled");
const localAiModeInput = document.getElementById("localAiMode");
const localAiEndpointInput = document.getElementById("localAiEndpoint");
const localAiModelSelect = document.getElementById("localAiModel");
const settingsForm = document.getElementById("settingsForm");
const saveStatus = document.getElementById("saveStatus");

async function renderSettings() {
  const settings = (await getLocalStorage(STORAGE_KEYS.USER_SETTINGS)) || DEFAULT_SETTINGS;
  notificationsInput.checked = settings.notificationsEnabled;
  localAiModeInput.checked = settings.localAiMode;
  localAiEndpointInput.value = settings.localAiEndpoint || "";
  localAiModelSelect.value = settings.localAiModel || DEFAULT_SETTINGS.localAiModel;
}

async function saveSettings(event) {
  event.preventDefault();
  const payload = {
    notificationsEnabled: notificationsInput.checked,
    localAiMode: localAiModeInput.checked,
    localAiEndpoint: sanitizeText(localAiEndpointInput.value.trim()),
    localAiModel: sanitizeText(localAiModelSelect.value)
  };
  await setLocalStorage(STORAGE_KEYS.USER_SETTINGS, payload);
  saveStatus.textContent = "Settings saved successfully.";
}

settingsForm.addEventListener("submit", saveSettings);
window.addEventListener("DOMContentLoaded", renderSettings);
