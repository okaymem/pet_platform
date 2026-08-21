import { defineConfig } from "vite";



export default defineConfig({
  server: {
    allowedHosts: ["enabled-dry-sudden-read.trycloudflare.com"],
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});