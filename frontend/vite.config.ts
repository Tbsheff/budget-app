import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Your backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"), // Ensure path stays intact
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    target: "esnext", // Target the latest JS features, including Top-Level Await
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",      // Ensure ESNext for dependencies
    }
  },
}));
