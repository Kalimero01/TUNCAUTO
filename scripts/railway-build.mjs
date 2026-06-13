import { execSync } from "node:child_process";

const service = process.env.RAILWAY_SERVICE_NAME ?? "backend";

const builds: Record<string, string> = {
  backend:
    "npm install && npm run build -w backend && npm run db:generate -w backend && npm run db:push -w backend",
  frontend: "npm install && npm run build -w frontend",
};

const starts: Record<string, string> = {
  backend: "npm run db:push -w backend && npm run start -w backend",
  frontend: "npm run start -w frontend",
};

const cmd = builds[service] ?? builds.backend;
console.log(`[railway-build] service=${service}`);
execSync(cmd, { stdio: "inherit" });
