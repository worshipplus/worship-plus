// vite.config.mjs
import { defineConfig } from "file:///Users/gomatheus/Desktop/louvor-adpg/poc/node_modules/vite/dist/node/index.js";
import react from "file:///Users/gomatheus/Desktop/louvor-adpg/poc/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "/Users/gomatheus/Desktop/louvor-adpg/poc";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    // Bind explicitly to localhost to avoid network binding issues
    host: "127.0.0.1",
    port: 5173,
    strictPort: false,
    watch: {
      // Ignore large or external folders to prevent unnecessary restarts.
      // Use both workspace-relative globs and an absolute pattern to be robust.
      ignored: [
        "**/node_modules/**",
        "**/.git/**",
        // workspace-level agents folder (relative)
        "../agents/**",
        // workspace-level agents folder (absolute)
        path.resolve(__vite_injected_original_dirname, "..", "agents") + "/**/*"
      ]
    },
    hmr: {
      // keep default overlay but ensure host is consistent for HMR websocket
      host: "127.0.0.1"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2dvbWF0aGV1cy9EZXNrdG9wL2xvdXZvci1hZHBnL3BvY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2dvbWF0aGV1cy9EZXNrdG9wL2xvdXZvci1hZHBnL3BvYy92aXRlLmNvbmZpZy5tanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2dvbWF0aGV1cy9EZXNrdG9wL2xvdXZvci1hZHBnL3BvYy92aXRlLmNvbmZpZy5tanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICBzZXJ2ZXI6IHtcbiAgICAvLyBCaW5kIGV4cGxpY2l0bHkgdG8gbG9jYWxob3N0IHRvIGF2b2lkIG5ldHdvcmsgYmluZGluZyBpc3N1ZXNcbiAgICBob3N0OiAnMTI3LjAuMC4xJyxcbiAgICBwb3J0OiA1MTczLFxuICAgIHN0cmljdFBvcnQ6IGZhbHNlLFxuICAgIHdhdGNoOiB7XG4gICAgICAvLyBJZ25vcmUgbGFyZ2Ugb3IgZXh0ZXJuYWwgZm9sZGVycyB0byBwcmV2ZW50IHVubmVjZXNzYXJ5IHJlc3RhcnRzLlxuICAgICAgLy8gVXNlIGJvdGggd29ya3NwYWNlLXJlbGF0aXZlIGdsb2JzIGFuZCBhbiBhYnNvbHV0ZSBwYXR0ZXJuIHRvIGJlIHJvYnVzdC5cbiAgICAgIGlnbm9yZWQ6IFtcbiAgICAgICAgJyoqL25vZGVfbW9kdWxlcy8qKicsXG4gICAgICAgICcqKi8uZ2l0LyoqJyxcbiAgICAgICAgLy8gd29ya3NwYWNlLWxldmVsIGFnZW50cyBmb2xkZXIgKHJlbGF0aXZlKVxuICAgICAgICAnLi4vYWdlbnRzLyoqJyxcbiAgICAgICAgLy8gd29ya3NwYWNlLWxldmVsIGFnZW50cyBmb2xkZXIgKGFic29sdXRlKVxuICAgICAgICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4nLCAnYWdlbnRzJykgKyAnLyoqLyonXG4gICAgICBdXG4gICAgfSxcbiAgICBobXI6IHtcbiAgICAgIC8vIGtlZXAgZGVmYXVsdCBvdmVybGF5IGJ1dCBlbnN1cmUgaG9zdCBpcyBjb25zaXN0ZW50IGZvciBITVIgd2Vic29ja2V0XG4gICAgICBob3N0OiAnMTI3LjAuMC4xJ1xuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFMsU0FBUyxvQkFBb0I7QUFDelUsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUZqQixJQUFNLG1DQUFtQztBQUl6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsUUFBUTtBQUFBO0FBQUEsSUFFTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixPQUFPO0FBQUE7QUFBQTtBQUFBLE1BR0wsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUVBO0FBQUE7QUFBQSxRQUVBLEtBQUssUUFBUSxrQ0FBVyxNQUFNLFFBQVEsSUFBSTtBQUFBLE1BQzVDO0FBQUEsSUFDRjtBQUFBLElBQ0EsS0FBSztBQUFBO0FBQUEsTUFFSCxNQUFNO0FBQUEsSUFDUjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
