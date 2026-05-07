import "@/styles/main.css";
import { StrictMode } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { App } from "@/app/App.jsx";
import { exposeFrameworkRuntime } from "@/app/bootstrapFramework.js";

const rootElement = document.querySelector("#root");

if (!rootElement) {
  throw new Error("Missing #root element.");
}

exposeFrameworkRuntime();

flushSync(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});

await import("@/legacy/bootstrap.js");
