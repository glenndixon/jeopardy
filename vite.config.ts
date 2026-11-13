import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // `public` is our build output, not Vite's static-assets source directory.
  publicDir: false,
  build: {
    outDir: "public",
    emptyOutDir: true,
  },
});
