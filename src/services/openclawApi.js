import { request } from "@/services/httpClient.js";

export const openclawApi = {
  health() {
    return request("/healthz");
  },
  nodes() {
    return request("/nodes");
  },
  workflows(params = {}) {
    const query = new URLSearchParams(params);
    return request(`/workflows${query.size ? `?${query}` : ""}`);
  },
  runWorkflow(payload) {
    return request("/workflows/run", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  sendCommand(payload) {
    return request("/commands", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  createDiscussion(payload) {
    return request("/discussions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  registerNode(payload) {
    return request("/nodes/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
