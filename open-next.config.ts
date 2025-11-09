import { defineConfig } from "@opennextjs/cloudflare";

export default defineConfig({
  // Tell OpenNext you’re deploying to Cloudflare
  preset: "cloudflare",

  // Your Next.js project lives at the repo root
  appPath: ".",

  // Directory where build artifacts go
  outDir: ".open-next",

  // Disable experimental features we don’t need
  experimental: {
    runtime: "edge",
  },

  // Optional: silence any prompts during build
  nonInteractive: true,
});
