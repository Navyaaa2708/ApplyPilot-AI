export function captureError(error, context = {}) {
  // In a full production deployment, connect this to Sentry or another monitoring backend.
  // Chrome extension runtime errors are logged with enough context for debugging.
  console.error("ApplyPilot telemetry error", { error, ...context });
}

export function captureEvent(name, details = {}) {
  console.info("ApplyPilot telemetry event", { event: name, ...details });
}
