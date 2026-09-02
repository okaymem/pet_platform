import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";


export default defineConfig({
  plugins:[tailwindcss()],
  server: {
    allowedHosts: ["clearing-manner-bacon-million.trycloudflare.com"],
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
}); 