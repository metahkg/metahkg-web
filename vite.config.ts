import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";
// Removed static import: import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "path"; // Needed for alias if used later

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
    // Make async
    // Load env file based on mode (development, production)
    // Load all env vars, filtering VITE_ ones is handled by Vite automatically for client exposure
    const env = loadEnv(mode, process.cwd(), "");
    const { viteStaticCopy } = await import("vite-plugin-static-copy"); // Dynamic import

    return {
        // Define process.env - Workaround for libraries expecting it
        // Load all env vars into process.env for server-side use in config/plugins
        // Client-side exposure is handled by Vite's VITE_ prefix filtering
        define: {
            // Avoid replacing process.env entirely, merge with existing if necessary
            // 'process.env': JSON.stringify(env) // Simple stringify might break things
            // A safer approach might be needed if direct process.env access is problematic
            // For now, let's rely on loadEnv populating process.env and Vite's handling
        },
        plugins: [
            react({
                // Add support for Emotion Babel plugin
                jsxImportSource: "@emotion/react",
                babel: {
                    plugins: ["@emotion/babel-plugin"],
                },
            }),
            svgr({ svgrOptions: { icon: true } }), // Configure SVGR plugin
            VitePWA({
                registerType: "autoUpdate", // Automatically update SW
                // injectRegister: 'script', // Use 'script' if you want to manually control registration in your app
                workbox: {
                    globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"], // Files to precache
                    // Add runtime caching rules if needed, e.g., for API calls
                    // runtimeCaching: [
                    //   {
                    //     urlPattern: /^https:\/\/api\.example\.com\/.*/,
                    //     handler: 'NetworkFirst',
                    //     options: {
                    //       cacheName: 'api-cache',
                    //       expiration: {
                    //         maxEntries: 10,
                    //         maxAgeSeconds: 60 * 60 * 24 // 1 day
                    //       },
                    //       cacheableResponse: {
                    //         statuses: [0, 200]
                    //       }
                    //     }
                    //   }
                    // ]
                },
                includeAssets: [
                    "favicon.ico",
                    "images/logo192.png",
                    "images/logo512.png",
                ], // Ensure icons are included
                manifest: {
                    // Copy details from public/manifest.json
                    name: "Metahkg Forum",
                    short_name: "Metahkg",
                    description: "Metahkg is a free and open source lihkg-style forum.",
                    theme_color: "#f5bd1f",
                    background_color: "#222222",
                    display: "standalone",
                    start_url: "/",
                    icons: [
                        {
                            src: "images/logo192.png", // Path relative to output dir (build/)
                            sizes: "192x192",
                            type: "image/png",
                        },
                        {
                            src: "images/logo512.png", // Path relative to output dir (build/)
                            sizes: "512x512",
                            type: "image/png",
                        },
                        // Add maskable icon if available
                        // {
                        //   src: 'images/logo-maskable-512.png',
                        //   sizes: '512x512',
                        //   type: 'image/png',
                        //   purpose: 'maskable'
                        // }
                    ],
                    // Note: gcm_sender_id is usually handled by push notification setup, not directly in manifest
                },
            }),
            viteStaticCopy({
                targets: [
                    {
                        // Try the .mjs extension which is common for modern pdfjs-dist versions
                        src: "node_modules/pdfjs-dist/build/pdf.worker.mjs",
                        dest: ".", // Copy to the root of the build output directory
                    },
                ],
            }),
        ],
        // Replicate CRA's build output directory
        build: {
            outDir: "build",
        },
        server: {
            // Replicate proxy setup from src/setupProxy.js
            proxy: {
                "/api": {
                    target: env.BACKEND_URL || "https://dev.metahkg.org", // Use loaded env var
                    changeOrigin: true,
                    secure: false, // Adjust if needed for HTTPS backend
                },
            },
            open: true, // Optional: Open browser on start
        },
        resolve: {
            // Optional: Add aliases if needed later
            // alias: {
            //   '~': path.resolve(__dirname, './src'),
            // },
        },
        // Ensure env variables prefixed with VITE_ are exposed to the client
        envPrefix: "VITE_",
    };
});
