import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  // The parent folder (D:\EESA_WEB) has its own package-lock.json; pin the workspace root to this app.
  turbopack: { root: path.resolve(__dirname) },
  outputFileTracingRoot: path.resolve(__dirname),
  // Stop `next dev` from writing an AGENTS.md into the project root.
  agentRules: false,
  // Keeps the dev-mode badge out of visual-diff screenshots.
  devIndicators: false,
};

export default nextConfig;
