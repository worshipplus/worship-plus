import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/theme";
import { AuthProvider } from "./context/auth";
import { DataSourcesProvider } from "./context/providers";
import { HttpUserSource } from "./adapters/implementations/HttpUserSource";
import { HttpSetlistSource } from "./adapters/implementations/HttpSetlistSource";
import { HttpEventSource } from "./adapters/implementations/HttpEventSource";
import type { DataSources } from "./context/providers";

const apiUrl = import.meta.env.VITE_API_URL ?? "";

const sources: DataSources = {
  userSource: new HttpUserSource(apiUrl),
  setlistSource: new HttpSetlistSource(apiUrl),
  eventSource: new HttpEventSource(apiUrl),
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <DataSourcesProvider sources={sources}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </DataSourcesProvider>
    </ThemeProvider>
  </StrictMode>,
);
