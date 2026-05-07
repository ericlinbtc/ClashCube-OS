const boolFromEnv = (value, fallback = false) => {
  if (value == null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
};

export const appConfig = {
  apiBase: import.meta.env.VITE_API_BASE || "/api",
  useLocalDemoData: boolFromEnv(import.meta.env.VITE_USE_LOCAL_DEMO_DATA, true),
  controllerProxyTarget: import.meta.env.VITE_CONTROLLER_PROXY_TARGET || "http://192.168.5.190:8000",
};
