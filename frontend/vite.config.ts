import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envDir = fileURLToPath(new URL(".", import.meta.url));
  const env = loadEnv(mode, envDir, "VITE_");

  return {
    base: env.VITE_BASE_PATH ?? "/",
    plugins: [react()],
  };
});
