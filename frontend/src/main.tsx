import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/theme";
import { AuthProvider } from "./context/auth";
import { DataSourcesProvider } from "./context/providers";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <DataSourcesProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </DataSourcesProvider>
    </ThemeProvider>
  </StrictMode>,
);
