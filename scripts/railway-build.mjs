import { execSync } from "node:child_process";

const service = process.env.RAILWAY_SERVICE_NAME ?? process.env.RAILPACK_SERVICE ?? "backend";

const builds = {
  backend: "npm run build -w backend && npm run db:generate -w backend",
  frontend: "npm run build -w frontend",
};

const cmd = builds[service] ?? builds.backend;
console.log(`[railway-build] service=${service}`);
execSync(cmd, { stdio: "inherit" });
