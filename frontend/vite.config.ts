import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const apiBaseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.VITE_API_BASE_URL;

export default defineConfig(({ mode }) => ({
  base: mode === "development" ? "/" : "/",
  server: {
    host: "::",
    port: 8080, // Match the port exposed in Docker
    proxy: {
      "/api": {
        target: apiBaseUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
  preview: {
    port: 4173,
    allowedHosts: ["app.walit.live"], // Add allowed hosts
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2022", // Explicitly target modern JavaScript
    outDir: "dist",
  },
  optimizeDeps: {},
}));
