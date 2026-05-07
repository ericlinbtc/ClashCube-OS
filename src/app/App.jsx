import { appShellTemplate } from "@/app/appShell.js";

export function App() {
  return (
    <div
      className="clashcube-runtime-root"
      dangerouslySetInnerHTML={{ __html: appShellTemplate }}
    />
  );
}
