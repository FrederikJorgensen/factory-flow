import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: [],
            manifest: {
                name: "Factory Flow",
                short_name: "Flow",
                description: "Monorepo web application shell.",
                theme_color: "#132238",
                background_color: "#f5f1e8",
                display: "standalone",
                start_url: "/"
            }
        })
    ],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true
            }
        }
    }
});
