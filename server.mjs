import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const target = process.env.OPENCLAW_API || "http://192.168.5.190:8000";
const port = Number(process.env.PORT || 4175);
const host = process.env.HOST || "0.0.0.0";

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const appRouteIds = new Set(["overview", "workflow", "skills", "projects", "knowledge", "config", "subscription"]);

function send(response, status, body, headers = {}) {
  response.writeHead(status, headers);
  response.end(body);
}

async function proxy(request, response, url) {
  const upstreamUrl = `${target}${url.pathname.replace(/^\/api/, "")}${url.search}`;
  const body = ["GET", "HEAD"].includes(request.method || "GET")
    ? undefined
    : await new Promise((resolve, reject) => {
      const chunks = [];
      request.on("data", (chunk) => chunks.push(chunk));
      request.on("end", () => resolve(Buffer.concat(chunks)));
      request.on("error", reject);
    });

  try {
    const upstream = await fetch(upstreamUrl, {
      method: request.method,
      headers: {
        "content-type": request.headers["content-type"] || "application/json",
      },
      body,
    });
    const buffer = Buffer.from(await upstream.arrayBuffer());
    send(response, upstream.status, buffer, {
      "content-type": upstream.headers.get("content-type") || "application/octet-stream",
      "cache-control": "no-store",
    });
  } catch (error) {
    send(response, 502, JSON.stringify({ detail: error.message }), {
      "content-type": "application/json; charset=utf-8",
    });
  }
}

async function serveStatic(response, url) {
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const normalized = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(root, normalized);
  if (!filePath.startsWith(root)) {
    send(response, 403, "Forbidden");
    return;
  }
  try {
    const body = await readFile(filePath);
    const type = contentTypes[extname(filePath)] || "application/octet-stream";
    send(response, 200, body, {
      "content-type": type,
      "cache-control": "no-store",
    });
  } catch {
    const routeId = url.pathname.replace(/^\/+|\/+$/g, "").split("/")[0];
    if (!extname(url.pathname) && appRouteIds.has(routeId)) {
      const body = await readFile(join(root, "index.html"));
      send(response, 200, body, {
        "content-type": contentTypes[".html"],
        "cache-control": "no-store",
      });
      return;
    }
    send(response, 404, "Not found", { "content-type": "text/plain; charset=utf-8" });
  }
}

createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  if (url.pathname.startsWith("/api/") || url.pathname === "/api") {
    await proxy(request, response, url);
    return;
  }
  await serveStatic(response, url);
}).listen(port, host, () => {
  console.log(`OpenClaw SaaS Console: http://localhost:${port}`);
  console.log(`LAN access: http://${host === "0.0.0.0" ? "<your-lan-ip>" : host}:${port}`);
  console.log(`Proxy target: ${target}`);
});
