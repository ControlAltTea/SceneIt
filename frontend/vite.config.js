import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 👈 Your backend server URL
        changeOrigin: true,              // Adjusts the request origin
        secure: false,                   // Allow self-signed SSL if needed
      },
    },
  },
});
