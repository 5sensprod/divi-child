import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./", // 👈 AJOUTEZ CETTE LIGNE
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/wp-json": {
        target: "https://axemusique.shop",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      buffer: "buffer",
    },
  },
  optimizeDeps: {
    include: ["buffer"],
  },
});
