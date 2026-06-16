export function info(message: string, meta: Record<string, unknown> = {}) {
  // eslint-disable-next-line no-console
  console.info(JSON.stringify({ level: "info", message, ...meta, timestamp: new Date().toISOString() }));
}

export function error(message: string, meta: Record<string, unknown> = {}) {
  // eslint-disable-next-line no-console
  console.error(JSON.stringify({ level: "error", message, ...meta, timestamp: new Date().toISOString() }));
}
