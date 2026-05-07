import { appConfig } from "@/config/env.js";

function parseJsonBody(raw, response) {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`接口返回不是合法 JSON(HTTP ${response.status})`);
  }
}

export async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), options.timeoutMs || 5000);

  try {
    const response = await fetch(`${appConfig.apiBase}${path}`, {
      cache: options.method ? "no-store" : "default",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
    const text = await response.text();
    const data = parseJsonBody(text, response);
    if (!response.ok) throw new Error(data?.detail || data?.message || `请求失败 ${response.status}`);
    return data;
  } finally {
    window.clearTimeout(timeout);
  }
}
