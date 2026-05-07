import { appConfig } from "@/config/env.js";
import { appRoutes } from "@/app/routes.js";
import { openclawApi } from "@/services/openclawApi.js";

export function exposeFrameworkRuntime() {
  window.ClashCubeRuntime = {
    config: appConfig,
    routes: appRoutes,
    api: openclawApi,
  };
}
