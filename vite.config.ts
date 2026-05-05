import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("pdfjs-dist")) return "pdfjs";
          if (id.includes("react") || id.includes("scheduler")) {
            return "react-vendor";
          }
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("@supabase")) return "supabase";
          return "vendor";
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
});
