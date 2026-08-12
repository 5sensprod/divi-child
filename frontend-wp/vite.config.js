import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    host: true,
    port: 5174,
    proxy: {
      "/wp-json": {
        target: "https://axemusique.shop",
        changeOrigin: true,
        secure: true,
      },
      // Menu publié par PocketApp (ticket 8).
      //
      // NÉCESSAIRE EN DÉVELOPPEMENT SEULEMENT, et pas par confort : le fichier
      // est servi par Apache SANS en-tête `Access-Control-Allow-Origin`, là où
      // `/wp-json` en renvoie un. Sans ce proxy, le navigateur bloque la requête
      // depuis localhost — l'ancienne source se charge, la nouvelle non, et le
      // symptôme ressemble à un bogue du code de bascule.
      //
      // En production, le site et le fichier sont sur la MÊME ORIGINE : aucune
      // vérification CORS n'a lieu et ce proxy n'existe pas. C'est pourquoi on
      // ne touche pas au serveur pour un besoin de développement.
      "/data": {
        target: "https://axemusique.shop",
        changeOrigin: true,
        secure: true,
      },
      // Endpoint public du catalogue Axe Musique.
      //
      // L'endpoint renvoie pourtant `Access-Control-Allow-Origin: *` — le
      // proxy n'est donc pas indispensable ici, contrairement à `/data`. Il
      // est gardé pour que l'URL soit LA MÊME en développement et en
      // production (`/server/api/catalog.php`, relative) : une URL absolue en
      // dev et relative en prod est le genre d'écart qui se découvre après le
      // déploiement.
      "/server": {
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
