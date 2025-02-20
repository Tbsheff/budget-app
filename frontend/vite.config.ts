import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: mode === "development" ? "/" : "/",
  server: {
    host: "::",
    port: 4173, // Match the port exposed in Docker
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:5000",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, "/api"),
    //   },
    // },
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
