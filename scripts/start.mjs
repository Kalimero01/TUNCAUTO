import { execSync } from "node:child_process";

const port = process.env.PORT ?? "3000";

console.log("[start] Running database migrations...");
try {
  execSync("npx prisma db push --skip-generate", { stdio: "inherit", timeout: 120_000 });
} catch (error) {
  console.error("[start] Database migration failed — continuing startup.", error?.message);
}

console.log("[start] Seeding default admin if needed...");
try {
  execSync("node scripts/seed.mjs", { stdio: "inherit", timeout: 60_000 });
} catch {
  console.error("[start] Seed failed — admin may already exist.");
}

console.log(`[start] Starting Next.js on port ${port}...`);
execSync(`npx next start -p ${port}`, { stdio: "inherit" });
