import { execSync } from "node:child_process";

const service = process.env.RAILWAY_SERVICE_NAME ?? process.env.RAILPACK_SERVICE ?? "backend";

const starts = {
  backend: "npm run db:push -w backend && npm run start -w backend",
  frontend: "npm run start -w frontend",
};

const cmd = starts[service] ?? starts.backend;
console.log(`[railway-start] service=${service}`);
execSync(cmd, { stdio: "inherit" });
