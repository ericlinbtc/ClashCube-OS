import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const appRoutes = [
  "/overview",
  "/projects",
  "/workflow",
  "/skills",
  "/knowledge",
  "/config",
  "/subscription",
];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const controllerTarget = env.VITE_CONTROLLER_PROXY_TARGET || env.OPENCLAW_API || "http://192.168.5.190:8000";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: controllerTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    preview: {
      proxy: {
        "/api": {
          target: controllerTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    appType: "spa",
    define: {
      __APP_ROUTES__: JSON.stringify(appRoutes),
    },
  };
});
