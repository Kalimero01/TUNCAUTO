import { execSync } from "node:child_process";

const service = process.env.RAILWAY_SERVICE_NAME ?? "backend";

const starts: Record<string, string> = {
  backend: "npm run start -w backend",
  frontend: "npm run start -w frontend",
};

const cmd = starts[service] ?? starts.backend;
console.log(`[railway-start] service=${service}`);
execSync(cmd, { stdio: "inherit" });
