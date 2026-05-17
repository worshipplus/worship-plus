import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/theme";
import { AuthProvider } from "./context/auth";
import { EventsProvider } from "./context/events";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <EventsProvider>
          <App />
        </EventsProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
