import { getLocalStorage } from "../utils/storage.js";
import { DEFAULT_SETTINGS, STORAGE_KEYS } from "../utils/constants.js";

export async function getActiveAiConfig() {
  const settings = (await getLocalStorage(STORAGE_KEYS.USER_SETTINGS)) || DEFAULT_SETTINGS;
  return {
    localAiMode: settings.localAiMode,
    localAiEndpoint: settings.localAiEndpoint,
    localAiModel: settings.localAiModel
  };
}

export async function callLocalAi(prompt) {
  const settings = await getActiveAiConfig();
  if (!settings.localAiMode || !settings.localAiEndpoint) {
    throw new Error("Local AI mode is not configured.");
  }
  const response = await fetch(`${settings.localAiEndpoint}/v1/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: settings.localAiModel, prompt, max_tokens: 600, temperature: 0.2 })
  });
  if (!response.ok) {
    throw new Error("Local AI provider request failed.");
  }
  const body = await response.json();
  return body;
}
