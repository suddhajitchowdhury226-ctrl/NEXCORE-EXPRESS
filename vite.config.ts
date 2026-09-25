import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import nitro from "nitro/vite";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
    }),
    // react's vite plugin must come after tanstackStart
    react(),
    // nitro compiles server code for Vercel / Cloudflare / Node
    nitro(),
  ],
  server: {
    port: 3000,
    host: true,
  },
});
