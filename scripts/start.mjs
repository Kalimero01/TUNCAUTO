import { execSync } from "node:child_process";

console.log("[start] Running database migrations...");
try {
  execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
} catch {
  console.error("[start] Database migration failed — continuing startup.");
}

console.log("[start] Seeding default admin if needed...");
try {
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
} catch {
  console.error("[start] Seed failed — admin may already exist.");
}

console.log("[start] Starting Next.js...");
execSync("next start", { stdio: "inherit" });
