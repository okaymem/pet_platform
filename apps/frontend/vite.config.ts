import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";


export default defineConfig({
  plugins:[tailwindcss()],
  server: {
    allowedHosts: ["cheers-artificial-hampshire-hopefully.trycloudflare.com"],
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
}); 